// Import required packages
const express = require("express");
const cors = require("cors");

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());


// Temporary in-memory data
// In this assessment, data is stored in arrays instead of a database.

let employees = [
    {
        id: "1",
        name: "Nguyen Van A",
        department: "Engineering",
        leaveBalance: 12,
    },
    {
        id: "2",
        name: "Tran Thi B",
        department: "HR",
        leaveBalance: 10,
    },
];

let leaveRequests = [];

// Simple counters for auto-generated IDs
let nextEmployeeId = 3;
let nextLeaveId = 1;


// Helper functions

// Find an employee by ID
function findEmployeeById(id) {
    return employees.find((employee) => employee.id === String(id));
}

// Generate a new employee ID
function generateEmployeeId() {
    const id = String(nextEmployeeId);
    nextEmployeeId += 1;
    return id;
}

// Generate a new leave request ID
function generateLeaveId() {
    const id = String(nextLeaveId);
    nextLeaveId += 1;
    return id;
}


// Basic route

// Check if the API is running
app.get("/", (req, res) => {
    res.status(200).json({
        message: "HRM API is running",
    });
});


// Employee APIs

// Get all employees
app.get("/employees", (req, res) => {
    res.status(200).json(employees);
});

// Create a new employee
app.post("/employees", (req, res) => {
    const { id, name, department, leaveBalance } = req.body;

    // Check required fields
    if (!name || !department || leaveBalance === undefined) {
        return res.status(400).json({
            message: "name, department and leaveBalance are required",
        });
    }

    // Convert leaveBalance to number
    const parsedLeaveBalance = Number(leaveBalance);

    // Check if leaveBalance is a valid number
    if (Number.isNaN(parsedLeaveBalance)) {
        return res.status(400).json({
        message: "leaveBalance must be a number",
        });
    }

    // Bonus: leaveBalance should not be negative
    if (parsedLeaveBalance < 0) {
        return res.status(400).json({
        message: "leaveBalance cannot be below 0",
        });
    }

    // Use provided ID if available, otherwise generate a new one
    const employeeId = id ? String(id) : generateEmployeeId();

    // Prevent duplicate employee ID
    const existingEmployee = findEmployeeById(employeeId);

    if (existingEmployee) {
        return res.status(400).json({
        message: "Employee ID already exists",
        });
    }

    const newEmployee = {
        id: employeeId,
        name,
        department,
        leaveBalance: parsedLeaveBalance,
    };

    employees.push(newEmployee);

    res.status(201).json({
        message: "Employee created successfully",
        employee: newEmployee,
    });
});

// Get one employee by ID
app.get("/employees/:id", (req, res) => {
    const { id } = req.params;

    const employee = findEmployeeById(id);

    if (!employee) {
        return res.status(404).json({
        message: "Employee not found",
        });
    }

    res.status(200).json(employee);
});

// Delete one employee by ID
app.delete("/employees/:id", (req, res) => {
    const { id } = req.params;

    const employee = findEmployeeById(id);

    if (!employee) {
        return res.status(404).json({
        message: "Employee not found",
        });
    }

    employees = employees.filter((employee) => employee.id !== String(id));

    res.status(200).json({
        message: "Employee deleted successfully",
    });
});


// Leave request APIs

// Create a new leave request
app.post("/leave", (req, res) => {
    const { employeeId, startDate, endDate, reason } = req.body;

    // Check required fields
    if (!employeeId || !startDate || !endDate || !reason) {
        return res.status(400).json({
        message: "employeeId, startDate, endDate and reason are required",
        });
    }

    // Check if employee exists
    const employee = findEmployeeById(employeeId);

    if (!employee) {
        return res.status(404).json({
        message: "Employee not found",
        });
    }

    // Bonus: do not allow leave request if employee has no leave balance
    if (employee.leaveBalance <= 0) {
        return res.status(400).json({
        message: "Employee does not have enough leave balance",
        });
    }

    // Bonus: validate leave request dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({
        message: "Invalid startDate or endDate",
        });
    }

    if (start > end) {
        return res.status(400).json({
        message: "startDate cannot be after endDate",
        });
    }

    // Reduce employee leave balance by 1 when creating a leave request
    employee.leaveBalance -= 1;

    const newLeaveRequest = {
        id: generateLeaveId(),
        employeeId: String(employeeId),
        employeeName: employee.name,
        startDate,
        endDate,
        reason,

        // Bonus: default status for a new leave request
        status: "pending",
    };

    leaveRequests.push(newLeaveRequest);

    res.status(201).json({
        message: "Leave request created successfully",
        leaveRequest: newLeaveRequest,
        employee,
    });
});

// Get all leave requests
app.get("/leave", (req, res) => {
    res.status(200).json(leaveRequests);
});

// Bonus: approve one leave request by ID
app.patch("/leave/:id/approve", (req, res) => {
    const { id } = req.params;

    const leaveRequest = leaveRequests.find((leave) => leave.id === String(id));

    if (!leaveRequest) {
        return res.status(404).json({
        message: "Leave request not found",
        });
    }

    leaveRequest.status = "approved";

    res.status(200).json({
        message: "Leave request approved successfully",
        leaveRequest,
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});