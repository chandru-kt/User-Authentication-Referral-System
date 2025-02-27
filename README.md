# User Authentication & Referral System

## Overview
This project is a **user authentication and referral system** built using **Node.js (Express) and MongoDB**. It includes features such as user registration, login, password reset, and referral tracking.

## Features
- **User Registration & Login** (JWT-based authentication)
- **Password Hashing** (bcrypt for security)
- **Password Reset** (Token-based reset mechanism)
- **Referral System** (Unique referral links, tracking, and statistics)
- **MongoDB for Database Management**

## Technologies Used
- **Node.js** (Express.js framework)
- **MongoDB** (Mongoose ORM)
- **JWT** (Authentication mechanism)
- **bcrypt** (Password hashing)
- **dotenv** (Environment variables)
- **nodemailer** (For email functionality, optional)
- **cors** (Cross-Origin Resource Sharing)

## Installation

### 1. Install Dependencies
```sh
npm install
```

### 4. Start the Server
```sh
node server1.js
```
The server will start at `http://localhost:3000`.

## API Endpoints

### **Authentication APIs**
#### **User Registration**
**POST** `/api/register`
![image](https://github.com/user-attachments/assets/56140229-3dd5-4840-8971-39b99bef1019)

#### **User Login**
**POST** `/api/login`
![image](https://github.com/user-attachments/assets/7eaa5c76-7300-4d2f-9d91-adde734a811a)

#### **Forgot Password**
**POST** `/api/forgot-password`
![image](https://github.com/user-attachments/assets/7f4992ce-df6a-4dfc-b024-8af65958f1ab)

_Response will include a reset token._

#### **Reset Password**
**POST** `/api/reset-password`
![image](https://github.com/user-attachments/assets/fa33dc6f-375e-4e9c-b29f-5ffd7c9f2bb8)

### **Referral System APIs**
#### **Get User's Referrals**
**GET** `/api/referrals`
_Response:_
![image](https://github.com/user-attachments/assets/74da5687-6339-4927-b749-65f8028a2a3d)

#### **Referral Statistics**
**GET** `/api/referral-stats`
_Response:_
![image](https://github.com/user-attachments/assets/e7122f30-f1f0-41f0-8098-b833d6edbeba)

## Notes
- The **password must be strong**, containing at least **one uppercase letter, one lowercase letter, one number, one special character, and a minimum of 8 characters**.
- **Referral tracking** is implemented by generating a unique referral code for each user.
- The **forgot password feature** generates a **JWT reset token** instead of sending emails (configurable).

## Future Enhancements
- Implement **reward-based referral incentives**.
- Add **OAuth authentication** (Google, GitHub, etc.).
- Improve **email verification system**.

---
_Developed with ❤️ using Node.js & MongoDB._

