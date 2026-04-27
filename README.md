# 📚 Student Attendance Tracker - AWS Cloud-Native Application

![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20DynamoDB%20%7C%20API%20Gateway%20%7C%20S3-orange)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Project Overview

This is a **serverless Student Attendance Tracking System** deployed on AWS cloud-native services. The application enables instructors to mark student attendance (present/absent/late/excused), view attendance history, generate reports, and manage records through a RESTful API. Parents receive automated email notifications when a student is marked absent or late.

### 🏫 Use Case
- **Course:** SWE5308 Cloud Technologies
- **Assessment:** Part 2 - Portfolio Coursework (60%)
- **Institution:** University of Bolton / Regent College
- **Submission Date:** 8th May 2026

### 👤 Author
- **Student ID:** Vasile.HE27436
- **Module:** SWE5308 Cloud Technologies
- **Tutor:** Richard Paul, Md Aminul Islam

---

## 🚀 Live Demo

| Component | URL |
|-----------|-----|
| **API Gateway** | `https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod/attendance` |
| **Frontend (S3)** | `http://YOUR-BUCKET.s3-website-us-east-1.amazonaws.com` |
| **GitHub Repository** | `https://github.com/Vasilikastan/student-attendance-tracker-aws.git` |




## 📐 Architecture



### AWS Services Used

| Service | Purpose |
|---------|---------|
| **AWS Lambda** | Serverless compute for CRUD operations (4 functions) |
| **Amazon DynamoDB** | NoSQL database with encryption and TTL |
| **API Gateway** | RESTful API endpoints with CORS |
| **Amazon S3** | Static website hosting for frontend |
| **AWS IAM** | Least privilege access control |
| **CloudWatch** | Monitoring, metrics, and dashboards |
| **Amazon SES** | Email notifications for absences/late arrivals |

---

## 🔧 Prerequisites

Before deploying, ensure you have:

| Tool | Version | Purpose |
|------|---------|---------|
| AWS Account | Free Tier | Hosting infrastructure |
| Python | 3.11+ | Lambda runtime |
| AWS CLI | Latest | Deployment automation |
| Git | Latest | Version control |
| Postman | Latest | API testing |
| VS Code | Latest | Code editing |



## 📦 Deployment Instructions

### Option 1: CloudFormation (Recommended)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/student-attendance-tracker-aws.git
cd student-attendance-tracker-aws

# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name attendance-tracker \
  --template-body file://infrastructure/cloudformation-template.yaml \
  --capabilities CAPABILITY_IAM

# Wait for deployment (5-10 minutes)
aws cloudformation wait stack-create-complete --stack-name attendance-tracker

# Get outputs (API URL, Frontend URL)
aws cloudformation describe-stacks \
  --stack-name attendance-tracker \
  --query "Stacks[0].Outputs"
