A web-based Timesheet Management System to enable efficient tracking of work hours by employees (Associates) and oversight by their managers. 
The system should provide tailored user experiences based on user roles and support key functionalities such as task assignment, timesheet entry, and reporting.

## Project Overview

This project consists of a full-stack web application with two main parts:

- **Frontend:** React.js application for user interaction and dashboards
- **Backend:** Node.js + Express REST API server handling authentication, timesheets, and user data

The app supports two user roles: **Manager** and **Associate**, with role-based access control.

---

## Folder Structure

internship assignment/
├── frontend/ # React.js frontend app
├── backend/ # Express.js backend API
└── README.md # This file


---

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- MongoDB database (local installation or MongoDB Atlas)
- Git (optional, if cloning from GitHub)

---

## Backend Setup

1. Open terminal and navigate to the backend folder:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in `backend` folder with the following variables:

    ```env
    PORT=5000 (port number should be 5000)
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4. Start the backend server (with nodemon for development):

    ```bash
    npm run dev
    ```

5. Backend will be running at: `http://localhost:5000`

---

## Frontend Setup

1. Open a new terminal window and navigate to the frontend folder:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend` folder with:

    ```env
    REACT_APP_API_BASE_URL=http://localhost:5000/api
    ```

4. Start the React development server:

    ```bash
    npm start
    ```

5. Frontend will be running at: `http://localhost:3000`

---

## Features

- User registration and login with JWT authentication
- Role-based dashboards for Managers and Associates
- Managers can view all associates’ timesheets and filter by date/user
- Associates can submit and view their own timesheets
- Secure protected routes on frontend and backend
- CRUD operations on timesheets and users
- Responsive UI design

---

## Usage

- Register a new user as Associate or Manager
- Login with your credentials
- Explore dashboards according to your role
- Submit or review timesheets as permitted

---

## System Architecture & User Flow

### Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT
- State Management: React Context API

### Architecture Overview

React UI <--> Express API <--> MongoDB Database
| | |
Auth Context Protected Routes Data Models


### User Flow

**Associate**

- Register → Login → Submit/View own timesheets → Logout

**Manager**

-Register → Login → View all timesheets → Filter and manage → Logout

---

## Troubleshooting & Support

- Ensure MongoDB connection string is correct in `.env`
- Check if ports 3000 (frontend) and 5000 (backend) are free
- Run `npm install` again if dependencies are missing
- For any issues, feel free to contact me

---


