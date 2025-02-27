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
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo-url.git
cd your-project-folder
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Create a `.env` File
Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### 4. Start the Server
```sh
npm start
```
The server will start at `http://localhost:3000`.

## API Endpoints

### **Authentication APIs**
#### **User Registration**
**POST** `/api/register`
```json
{
  "username": "JohnDoe",
  "email": "johndoe@example.com",
  "password": "Secure@123",
  "referralCode": "optional-referral-code"
}
```

#### **User Login**
**POST** `/api/login`
```json
{
  "email": "johndoe@example.com",
  "password": "Secure@123"
}
```

#### **Forgot Password**
**POST** `/api/forgot-password`
```json
{
  "email": "johndoe@example.com"
}
```
_Response will include a reset token._

#### **Reset Password**
**POST** `/api/reset-password`
```json
{
  "token": "reset_token_received",
  "newPassword": "NewSecure@123"
}
```

### **Referral System APIs**
#### **Get User's Referrals**
**GET** `/api/referrals`
_Response:_
```json
[
  {
    "username": "JaneDoe",
    "email": "janedoe@example.com"
  }
]
```

#### **Referral Statistics**
**GET** `/api/referral-stats`
_Response:_
```json
{
  "totalReferrals": 5,
  "successfulSignUps": 3
}
```

## Notes
- The **password must be strong**, containing at least **one uppercase letter, one lowercase letter, one number, one special character, and a minimum of 8 characters**.
- **Referral tracking** is implemented by generating a unique referral code for each user.
- The **forgot password feature** generates a **JWT reset token** instead of sending emails (configurable).

## Future Enhancements
- Implement **reward-based referral incentives**.
- Add **OAuth authentication** (Google, GitHub, etc.).
- Improve **email verification system**.

## License
This project is licensed under the **MIT License**.

---
_Developed with ❤️ using Node.js & MongoDB._

