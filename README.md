# HRM Labs - Junior Fullstack Developer Technical Assessment

This project is a simple HR management system built with:

- Node.js
- Express.js
- HTML
- CSS
- Vanilla JavaScript

The system allows users to manage employees and leave requests.

## Project Structure

```txt
hrm-assessment/
├── backend/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .gitignore
└── README.md
```

## Required Features

### Backend

- `GET /employees` - return all employees
- `POST /employees` - add a new employee
- `GET /employees/:id` - return a single employee by ID
- `DELETE /employees/:id` - delete an employee by ID
- `POST /leave` - create a leave request
- `GET /leave` - return all leave requests
- Reduce employee leave balance by 1 when a leave request is created
- Store data in in-memory arrays
- Return appropriate HTTP status codes: `200`, `201`, `400`, `404`

### Frontend

- Form to add a new employee
- Button to view all employees
- Display employees in a table
- Form to create a leave request
- Button to view all leave requests
- Use vanilla JavaScript `fetch API` to call backend API

## Bonus Features

The following optional features are also included:

- Validate that `leaveBalance` cannot be below 0
- Prevent creating a leave request when an employee has no leave balance
- Validate leave request dates
- `PATCH /leave/:id/approve` endpoint to approve a leave request
- Show leave request status as `pending` or `approved`
- Approve leave request button on the frontend
- Cleaner user interface with CSS

## How to Run Backend

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The backend will run at:

```txt
http://localhost:3000
```

## How to Open Frontend

Open this file in your browser:

```txt
frontend/index.html
```

You can also use VS Code Live Server.
```txt
http://localhost:5500/frontend/index.html
```

## API Examples

### Get all employees

```http
GET /employees
```

### Add new employee

```http
POST /employees
```

Example request body:

```json
{
  "name": "Le Van C",
  "department": "Marketing",
  "leaveBalance": 8
}
```

### Get employee by ID

```http
GET /employees/1
```

### Delete employee by ID

```http
DELETE /employees/1
```

### Create leave request

```http
POST /leave
```

Example request body:

```json
{
  "employeeId": "1",
  "startDate": "2026-06-20",
  "endDate": "2026-06-21",
  "reason": "Family matter"
}
```

### Get all leave requests

```http
GET /leave
```

### Approve leave request

```http
PATCH /leave/:id/approve
```

Example:

```http
PATCH /leave/1/approve
```

## HTTP Status Codes

The API uses the following HTTP status codes:

- `200 OK`
- `201 Created`
- `400 Bad Request`
- `404 Not Found`

## Notes

This project uses in-memory arrays, so all data will be reset when the backend server restarts.

No database is required for this assessment.