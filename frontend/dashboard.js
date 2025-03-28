document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const setBudgetBtn = document.getElementById("setBudgetBtn");
    const addExpenseBtn = document.getElementById("addExpenseBtn");
    const budgetInput = document.getElementById("budgetInput");
    const budgetDisplay = document.getElementById("budgetDisplay");
    const budgetWarning = document.getElementById("budgetWarning");
    const expenseList = document.getElementById("expenseList");
    const expenseChartCanvas = document.getElementById("expenseChart").getContext("2d");

    let totalBudget = 0;
    let expenses = [];

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    });

    // Set Budget
    setBudgetBtn.addEventListener("click", () => {
        totalBudget = parseFloat(budgetInput.value) || 0;
        budgetDisplay.textContent = `Total Budget: $${totalBudget}`;
        checkBudgetExceeded();
    });

    // Add Expense
    addExpenseBtn.addEventListener("click", () => {
        const name = document.getElementById("expenseName").value;
        const amount = parseFloat(document.getElementById("expenseAmount").value);
        const category = document.getElementById("expenseCategory").value;

        if (name && amount > 0) {
            expenses.push({ name, amount, category });
            updateExpenseList();
            updateChart();
            checkBudgetExceeded();
        }
    });

    // Update Expense List
    function updateExpenseList() {
        expenseList.innerHTML = "";
        expenses.forEach((expense, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount}</td>
                <td>${expense.category}</td>
                <td>
                    <button onclick="deleteExpense(${index})">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

    // Delete Expense
    window.deleteExpense = function(index) {
        expenses.splice(index, 1);
        updateExpenseList();
        updateChart();
        checkBudgetExceeded();
    };

    // Check Budget Exceeded
    function checkBudgetExceeded() {
        const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        if (totalExpense > totalBudget) {
            budgetWarning.style.display = "block";
        } else {
            budgetWarning.style.display = "none";
        }
    }

    // Chart.js Expense Chart
    let expenseChart = new Chart(expenseChartCanvas, {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{
                label: "Expenses",
                data: [],
                backgroundColor: ["red", "blue", "green", "orange", "purple"]
            }]
        }
    });

    function updateChart() {
        const categories = {};
        expenses.forEach(exp => {
            categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
        });

        expenseChart.data.labels = Object.keys(categories);
        expenseChart.data.datasets[0].data = Object.values(categories);
        expenseChart.update();
    }
});


// document.addEventListener("DOMContentLoaded", () => {
//     const logoutBtn = document.getElementById("logoutBtn");
//     const setBudgetBtn = document.getElementById("setBudgetBtn");
//     const addExpenseBtn = document.getElementById("addExpenseBtn");
//     const budgetInput = document.getElementById("budgetInput");
//     const budgetDisplay = document.getElementById("budgetDisplay");
//     const budgetWarning = document.getElementById("budgetWarning");
//     const expenseList = document.getElementById("expenseList");
//     const expenseChartCanvas = document.getElementById("expenseChart").getContext("2d");

//     let totalBudget = 0;
//     let expenses = [];

//     // Logout
//     logoutBtn.addEventListener("click", () => {
//         localStorage.removeItem("token");
//         window.location.href = "login.html";
//     });

//     // Set Budget
//     setBudgetBtn.addEventListener("click", () => {
//         totalBudget = parseFloat(budgetInput.value) || 0;
//         budgetDisplay.textContent = `Total Budget: $${totalBudget}`;
//         checkBudgetExceeded();
//     });

//     // Fetch expenses from MongoDB
//     async function fetchExpenses() {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await fetch("http://localhost:5000/api/expenses", {
//                 headers: { "Authorization": token }
//             });
//             const data = await response.json();
//             expenses = data; // Store fetched expenses
//             updateExpenseList();
//             updateChart();
//             checkBudgetExceeded();
//         } catch (err) {
//             console.error("Error fetching expenses:", err);
//         }
//     }

//     // Add Expense to MongoDB
//     addExpenseBtn.addEventListener("click", async () => {
//         const name = document.getElementById("expenseName").value;
//         const amount = parseFloat(document.getElementById("expenseAmount").value);
//         const category = document.getElementById("expenseCategory").value;

//         if (name && amount > 0) {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await fetch("http://localhost:5000/api/expenses/add", {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": token
//                     },
//                     body: JSON.stringify({ name, category, amount })
//                 });

//                 if (response.ok) {
//                     await fetchExpenses(); // Refresh data from MongoDB
//                     document.getElementById("expenseName").value = "";
//                     document.getElementById("expenseAmount").value = "";
//                 } else {
//                     console.error("Failed to add expense.");
//                 }
//             } catch (err) {
//                 console.error("Error adding expense:", err);
//             }
//         }
//     });

//     // Update Expense List
//     function updateExpenseList() {
//         expenseList.innerHTML = "";
//         expenses.forEach((expense) => {
//             const row = document.createElement("tr");
//             row.innerHTML = `
//                 <td>${expense.name}</td>
//                 <td>$${expense.amount}</td>
//                 <td>${expense.category}</td>
//                 <td>
//                     <button onclick="deleteExpense('${expense._id}')">Delete</button>
//                 </td>
//             `;
//             expenseList.appendChild(row);
//         });
//     }

//     // Delete Expense from MongoDB
//     window.deleteExpense = async function(id) {
//         try {
//             const token = localStorage.getItem("token");
//             const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
//                 method: "DELETE",
//                 headers: { "Authorization": token }
//             });

//             if (response.ok) {
//                 await fetchExpenses(); // Refresh expenses after deletion
//             }
//         } catch (err) {
//             console.error("Error deleting expense:", err);
//         }
//     };

//     // Check Budget Exceeded
//     function checkBudgetExceeded() {
//         const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
//         budgetWarning.style.display = totalExpense > totalBudget ? "block" : "none";
//     }

//     // Chart.js Expense Chart
//     let expenseChart = new Chart(expenseChartCanvas, {
//         type: "doughnut",
//         data: {
//             labels: [],
//             datasets: [{
//                 label: "Expenses",
//                 data: [],
//                 backgroundColor: ["red", "blue", "green", "orange", "purple"]
//             }]
//         }
//     });

//     function updateChart() {
//         const categories = {};
//         expenses.forEach(exp => {
//             categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
//         });

//         expenseChart.data.labels = Object.keys(categories);
//         expenseChart.data.datasets[0].data = Object.values(categories);
//         expenseChart.update();
//     }

//     // Load expenses from MongoDB on page load
//     fetchExpenses();
// });
