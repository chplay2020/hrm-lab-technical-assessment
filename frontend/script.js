// Backend API URL
const API_URL = "http://localhost:3000";

// Get HTML elements
const employeeForm = document.getElementById("employeeForm");
const leaveForm = document.getElementById("leaveForm");

const loadEmployeesBtn = document.getElementById("loadEmployeesBtn");
const loadLeavesBtn = document.getElementById("loadLeavesBtn");

const employeeTableBody = document.getElementById("employeeTableBody");
const leaveTableBody = document.getElementById("leaveTableBody");

const message = document.getElementById("message");

// Show simple message on the page
function showMessage(text) {
  message.textContent = text;
}


// Employee functions

// Load employees from backend and render them in the table
async function loadEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();

        // Clear old table data before rendering new data
        employeeTableBody.innerHTML = "";

        employees.forEach((employee) => {
            const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.leaveBalance}</td>
        `;

        employeeTableBody.appendChild(row);
        });
    } catch (error) {
        showMessage("Failed to load employees");
    }
}

// Create a new employee
employeeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("employeeName").value;
    const department = document.getElementById("employeeDepartment").value;
    const leaveBalance = document.getElementById("employeeLeaveBalance").value;

    const newEmployee = {
        name,
        department,
        leaveBalance: Number(leaveBalance),
    };

    try {
        const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployee),
    });

    const data = await response.json();

    if (!response.ok) {
        showMessage(data.message || "Failed to add employee");
        return;
    }

    employeeForm.reset();
    showMessage("Employee added successfully");

    loadEmployees();
    } catch (error) {
        showMessage("Failed to add employee");
    }
});

loadEmployeesBtn.addEventListener("click", loadEmployees);


// Leave request functions

// Load leave requests from backend and render them in the table
async function loadLeaveRequests() {
    try {
        const response = await fetch(`${API_URL}/leave`);
        const leaveRequests = await response.json();

        leaveTableBody.innerHTML = "";

        leaveRequests.forEach((leave) => {
            const row = document.createElement("tr");

        row.innerHTML = `
            <td>${leave.id}</td>
            <td>${leave.employeeId}</td>
            <td>${leave.employeeName}</td>
            <td>${leave.startDate}</td>
            <td>${leave.endDate}</td>
            <td>${leave.reason}</td>
        `;

        leaveTableBody.appendChild(row);
    });

    } catch (error) {
        showMessage("Failed to load leave requests");
    }
}

// Create a new leave request
leaveForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const employeeId = document.getElementById("leaveEmployeeId").value;
    const startDate = document.getElementById("leaveStartDate").value;
    const endDate = document.getElementById("leaveEndDate").value;
    const reason = document.getElementById("leaveReason").value;

    const newLeaveRequest = {
        employeeId,
        startDate,
        endDate,
        reason,
    };

    try {
        const response = await fetch(`${API_URL}/leave`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newLeaveRequest),
    });

    const data = await response.json();

    if (!response.ok) {
        showMessage(data.message || "Failed to create leave request");
        return;
    }

    leaveForm.reset();
    showMessage("Leave request created successfully");

    // Reload both tables because employee leaveBalance is changed
    loadEmployees();
    loadLeaveRequests();
    
    } catch (error) {
        showMessage("Failed to create leave request");
    }
});

loadLeavesBtn.addEventListener("click", loadLeaveRequests);

// Load data when opening the page
loadEmployees();
loadLeaveRequests();