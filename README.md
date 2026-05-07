# Student Attendance Tracker

## Project Overview

Student Attendance Tracker is a cloud-based web application used to add, view, update and delete student attendance records.

The application uses a static frontend hosted on Amazon S3 and a serverless backend using API Gateway, AWS Lambda and DynamoDB.

## Live Application

Live website:

http://att-tracker-12345678.s3-website-us-east-1.amazonaws.com

## API Endpoint

https://ppzsd3j7d1.execute-api.us-east-1.amazonaws.com/default/records

## AWS Services Used

| AWS Service | Purpose |
|---|---|
| Amazon S3 | Hosts the static frontend website |
| API Gateway | Provides the public HTTP API endpoint |
| AWS Lambda | Runs the backend CRUD logic |
| DynamoDB | Stores student attendance records |
| IAM | Manages access permissions |
| CloudWatch | Stores Lambda logs for monitoring |

## Main Features

- Add student attendance records
- Load and display attendance records
- Update attendance status
- Delete attendance records
- Store data in DynamoDB
- Monitor backend activity using CloudWatch logs

## Architecture Summary

The user accesses the frontend through an Amazon S3 static website endpoint. The frontend sends requests to API Gateway. API Gateway invokes an AWS Lambda function. Lambda performs CRUD operations on the DynamoDB table.

```text
User Browser
   ↓
Amazon S3 Static Website
   ↓
API Gateway
   ↓
AWS Lambda
   ↓
DynamoDB
```

CloudWatch is used for logging and monitoring. IAM controls the Lambda function permissions.

## Project Structure

```text
student-attendance-tracker/
├── architecture/
│   └── architecture-diagram.png
├── backend/
│   └── lambda_function.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── screenshots/
└── README.md
```

## DynamoDB Table

Table name:

```text
StudentAttendance
```

Primary key design:

| Key | Field |
|---|---|
| Partition key | studentId |
| Sort key | attendanceDate |

Main attributes:

- studentId
- studentName
- course
- attendanceDate
- status
- createdAt
- updatedAt

## API Behaviour

| Method | Purpose |
|---|---|
| GET | Retrieve attendance records |
| POST | Add a new attendance record |
| POST with action update | Update an attendance record |
| POST with action delete | Delete an attendance record |

Update and delete use POST requests with an `action` field to avoid browser CORS issues with PUT and DELETE during frontend testing.

## Example JSON Requests

### Add record

```json
{
  "studentId": "S001",
  "studentName": "Example Student",
  "course": "Cloud Technologies",
  "attendanceDate": "2026-05-01",
  "status": "Present"
}
```

### Update record

```json
{
  "action": "update",
  "studentId": "S001",
  "attendanceDate": "2026-05-01",
  "status": "Absent"
}
```

### Delete record

```json
{
  "action": "delete",
  "studentId": "S001",
  "attendanceDate": "2026-05-01"
}
```

## Testing Summary

| Test | Expected Result | Status |
|---|---|---|
| Load records | Records are displayed on the frontend | Passed |
| Add record | New record is stored in DynamoDB | Passed |
| Update record | Attendance status is updated | Passed |
| Delete record | Record is removed from DynamoDB | Passed |
| CloudWatch logs | Lambda invocations are recorded | Passed |

## Security Notes

- Lambda uses an IAM execution role.
- DynamoDB access is controlled through IAM permissions.
- No AWS access keys are stored in frontend code.
- API Gateway is used as the public API access layer.
- CloudWatch logs are used for monitoring and troubleshooting.

## Deployment Summary

The frontend was deployed to Amazon S3 using static website hosting. The backend was deployed using AWS Lambda. API Gateway was configured to connect the frontend to Lambda, and DynamoDB was used as the database layer.

## Evidence

Screenshots are stored in the `screenshots/` folder and include evidence of:

- Architecture diagram
- DynamoDB table and records
- Lambda function and test results
- IAM permissions
- API Gateway routes and CORS
- S3 static website hosting
- Live CRUD testing
- CloudWatch logs

## Author

Student No: HE27436  
Module: SWE5308 Cloud Technologies  
Assessment: Assessment 2 Portfolio Coursework