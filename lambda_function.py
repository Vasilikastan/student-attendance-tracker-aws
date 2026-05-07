import json
import boto3
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key


# DynamoDB table connection
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("StudentAttendance")


# Converts DynamoDB Decimal values into normal JSON numbers
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            if obj % 1 == 0:
                return int(obj)
            return float(obj)
        return super(DecimalEncoder, self).default(obj)


def lambda_handler(event, context):
    """
    Main Lambda entry point.
    Handles API Gateway requests for CRUD operations.
    """

    try:
        method = get_http_method(event)

        if method == "OPTIONS":
            return build_response(200, {"message": "CORS preflight successful"})

        if method == "GET":
            return get_records(event)

        if method == "POST":
            body = parse_body(event)

            # POST can create, update, or delete depending on action value.
            # This helps avoid CORS issues with PUT and DELETE in the browser.
            if body.get("action") == "update":
                return update_record(body)

            if body.get("action") == "delete":
                return delete_record(body)

            return create_record(body)

        if method == "PUT":
            body = parse_body(event)
            return update_record(body)

        if method == "DELETE":
            body = parse_body(event)
            return delete_record(body)

        return build_response(405, {
            "message": f"Method {method} is not allowed"
        })

    except Exception as error:
        print("Unhandled error:", str(error))
        return build_response(500, {
            "message": "Internal server error",
            "error": str(error)
        })


def get_http_method(event):
    """
    Gets HTTP method from API Gateway event.
    Works with HTTP API v2 and REST API v1.
    """

    method = (
        event.get("requestContext", {})
        .get("http", {})
        .get("method")
    )

    if method:
        return method.upper()

    method = event.get("httpMethod")

    if method:
        return method.upper()

    return ""


def parse_body(event):
    """
    Converts request body from JSON string to Python dictionary.
    """

    body = event.get("body")

    if body is None:
        return {}

    if isinstance(body, dict):
        return body

    try:
        return json.loads(body)
    except json.JSONDecodeError:
        raise ValueError("Request body is not valid JSON")


def create_record(body):
    """
    Create a new attendance record.
    Required fields:
    studentId, studentName, course, attendanceDate, status
    """

    required_fields = [
        "studentId",
        "studentName",
        "course",
        "attendanceDate",
        "status"
    ]

    missing_fields = validate_required_fields(body, required_fields)

    if missing_fields:
        return build_response(400, {
            "message": "Missing required fields",
            "missingFields": missing_fields
        })

    item = {
        "studentId": str(body["studentId"]).strip(),
        "studentName": str(body["studentName"]).strip(),
        "course": str(body["course"]).strip(),
        "attendanceDate": str(body["attendanceDate"]).strip(),
        "status": str(body["status"]).strip(),
        "createdAt": datetime.utcnow().isoformat()
    }

    allowed_statuses = ["Present", "Absent", "Late", "Excused"]

    if item["status"] not in allowed_statuses:
        return build_response(400, {
            "message": "Invalid attendance status",
            "allowedStatuses": allowed_statuses
        })

    try:
        table.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(studentId) AND attribute_not_exists(attendanceDate)"
        )

        return build_response(201, {
            "message": "Attendance record created successfully",
            "record": item
        })

    except ClientError as error:
        if error.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return build_response(409, {
                "message": "Record already exists for this student and date"
            })

        print("DynamoDB create error:", error)
        return build_response(500, {
            "message": "Could not create attendance record"
        })


def get_records(event):
    """
    Read attendance records.
    Supports:
    GET /records
    GET /records?studentId=S001
    """

    query_params = event.get("queryStringParameters") or {}
    student_id = query_params.get("studentId")

    try:
        if student_id:
            result = table.query(
                KeyConditionExpression=Key("studentId").eq(student_id)
            )
        else:
            result = table.scan()

        records = result.get("Items", [])

        return build_response(200, {
            "message": "Records retrieved successfully",
            "count": len(records),
            "records": records
        })

    except ClientError as error:
        print("DynamoDB read error:", error)
        return build_response(500, {
            "message": "Could not retrieve attendance records"
        })


def update_record(body):
    """
    Update an existing attendance record.
    Required fields:
    studentId, attendanceDate

    Optional fields:
    studentName, course, status
    """

    required_fields = ["studentId", "attendanceDate"]
    missing_fields = validate_required_fields(body, required_fields)

    if missing_fields:
        return build_response(400, {
            "message": "Missing required fields",
            "missingFields": missing_fields
        })

    student_id = str(body["studentId"]).strip()
    attendance_date = str(body["attendanceDate"]).strip()

    allowed_update_fields = ["studentName", "course", "status"]
    update_expression_parts = []
    expression_attribute_names = {}
    expression_attribute_values = {}

    for field in allowed_update_fields:
        if field in body and body[field] is not None and str(body[field]).strip() != "":
            name_placeholder = f"#{field}"
            value_placeholder = f":{field}"

            update_expression_parts.append(f"{name_placeholder} = {value_placeholder}")
            expression_attribute_names[name_placeholder] = field
            expression_attribute_values[value_placeholder] = str(body[field]).strip()

    if not update_expression_parts:
        return build_response(400, {
            "message": "No valid update fields provided"
        })

    if "status" in body:
        allowed_statuses = ["Present", "Absent", "Late", "Excused"]
        if str(body["status"]).strip() not in allowed_statuses:
            return build_response(400, {
                "message": "Invalid attendance status",
                "allowedStatuses": allowed_statuses
            })

    update_expression_parts.append("#updatedAt = :updatedAt")
    expression_attribute_names["#updatedAt"] = "updatedAt"
    expression_attribute_values[":updatedAt"] = datetime.utcnow().isoformat()

    update_expression = "SET " + ", ".join(update_expression_parts)

    try:
        result = table.update_item(
            Key={
                "studentId": student_id,
                "attendanceDate": attendance_date
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
            ConditionExpression="attribute_exists(studentId) AND attribute_exists(attendanceDate)",
            ReturnValues="ALL_NEW"
        )

        return build_response(200, {
            "message": "Attendance record updated successfully",
            "record": result.get("Attributes", {})
        })

    except ClientError as error:
        if error.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return build_response(404, {
                "message": "Attendance record not found"
            })

        print("DynamoDB update error:", error)
        return build_response(500, {
            "message": "Could not update attendance record"
        })


def delete_record(body):
    """
    Delete an attendance record.
    Required fields:
    studentId, attendanceDate
    """

    required_fields = ["studentId", "attendanceDate"]
    missing_fields = validate_required_fields(body, required_fields)

    if missing_fields:
        return build_response(400, {
            "message": "Missing required fields",
            "missingFields": missing_fields
        })

    student_id = str(body["studentId"]).strip()
    attendance_date = str(body["attendanceDate"]).strip()

    try:
        table.delete_item(
            Key={
                "studentId": student_id,
                "attendanceDate": attendance_date
            },
            ConditionExpression="attribute_exists(studentId) AND attribute_exists(attendanceDate)"
        )

        return build_response(200, {
            "message": "Attendance record deleted successfully"
        })

    except ClientError as error:
        if error.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return build_response(404, {
                "message": "Attendance record not found"
            })

        print("DynamoDB delete error:", error)
        return build_response(500, {
            "message": "Could not delete attendance record"
        })


def validate_required_fields(body, required_fields):
    """
    Checks required fields are present and not empty.
    """

    missing_fields = []

    for field in required_fields:
        if field not in body or body[field] is None or str(body[field]).strip() == "":
            missing_fields.append(field)

    return missing_fields


def build_response(status_code, body):
    """
    Builds API Gateway response with CORS headers.
    """

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization"
        },
        "body": json.dumps(body, cls=DecimalEncoder)
    }