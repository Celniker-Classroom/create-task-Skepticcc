// Arrays to store expenses
let expenseAmounts = [];
let expenseCategories = [];
let expenseDates = [];

// Load data from localStorage on page load
window.onload = function() {
    loadExpenses();
    updateExpenseList();
    updateSummary();
};

// Function to save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenseAmounts', JSON.stringify(expenseAmounts));
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
    localStorage.setItem('expenseDates', JSON.stringify(expenseDates));
}

// Function to load expenses from localStorage
function loadExpenses() {
    const amounts = localStorage.getItem('expenseAmounts');
    const categories = localStorage.getItem('expenseCategories');
    const dates = localStorage.getItem('expenseDates');
    if (amounts) expenseAmounts = JSON.parse(amounts);
    if (categories) expenseCategories = JSON.parse(categories);
    if (dates) expenseDates = JSON.parse(dates);
}

// Function to add expense
function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    
    if (amount > 0 && category && date) {
        expenseAmounts.push(amount);
        expenseCategories.push(category);
        expenseDates.push(date);
        saveExpenses();
        updateExpenseList();
        updateSummary();
        // Clear inputs
        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';
        document.getElementById('date').value = '';
    } else {
        alert('Please enter valid amount, select category, and choose a date.');
    }
}

// Function to update the expense list display
function updateExpenseList(filteredAmounts = expenseAmounts, filteredCategories = expenseCategories, filteredDates = expenseDates) {
    const list = document.getElementById('expenses');
    list.innerHTML = '';
    for (let i = 0; i < filteredAmounts.length; i++) {
        const li = document.createElement('li');
        li.innerHTML = `${filteredCategories[i]}: $${filteredAmounts[i].toFixed(2)} on ${filteredDates[i]} <button onclick="deleteExpense(${i})">Delete</button>`;
        list.appendChild(li);
    }
}

// Function to delete a specific expense
function deleteExpense(index) {
    expenseAmounts.splice(index, 1);
    expenseCategories.splice(index, 1);
    expenseDates.splice(index, 1);
    saveExpenses();
    updateExpenseList();
    updateSummary();
}

// Function to clear all expenses
function clearAllExpenses() {
    if (confirm('Are you sure you want to clear all expenses?')) {
        expenseAmounts = [];
        expenseCategories = [];
        expenseDates = [];
        saveExpenses();
        updateExpenseList();
        updateSummary();
    }
}

// Function to calculate total and check budget
function calculateTotal(expenseList, budgetLimit) {
    let total = 0;
    for (let i = 0; i < expenseList.length; i++) {
        total += expenseList[i];
    }
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Total Expenses: $${total.toFixed(2)}<br>`;
    
    if (total > budgetLimit) {
        resultDiv.innerHTML += `❌ You have exceeded your budget by $${(total - budgetLimit).toFixed(2)}.`;
    } else {
        resultDiv.innerHTML += `✅ You are within your budget. Remaining: $${(budgetLimit - total).toFixed(2)}.`;
    }
}

// Function to calculate maximum expense
function calculateMax(expenseList) {
    if (expenseList.length === 0) return 0;
    let max = expenseList[0];
    for (let i = 1; i < expenseList.length; i++) {
        if (expenseList[i] > max) {
            max = expenseList[i];
        }
    }
    return max;
}

// Function to calculate average expense
function calculateAverage(expenseList) {
    if (expenseList.length === 0) return 0;
    let total = 0;
    for (let i = 0; i < expenseList.length; i++) {
        total += expenseList[i];
    }
    return total / expenseList.length;
}

// Function to filter expenses by category
function filterByCategory(category) {
    if (!category) {
        updateExpenseList();
        return;
    }
    const filteredAmounts = [];
    const filteredCategories = [];
    const filteredDates = [];
    for (let i = 0; i < expenseCategories.length; i++) {
        if (expenseCategories[i] === category) {
            filteredAmounts.push(expenseAmounts[i]);
            filteredCategories.push(expenseCategories[i]);
            filteredDates.push(expenseDates[i]);
        }
    }
    updateExpenseList(filteredAmounts, filteredCategories, filteredDates);
}

// Function to update summary stats
function updateSummary() {
    const summaryDiv = document.getElementById('summaryStats');
    const total = expenseAmounts.reduce((sum, amt) => sum + amt, 0);
    const max = calculateMax(expenseAmounts);
    const avg = calculateAverage(expenseAmounts);
    summaryDiv.innerHTML = `
        <p>Total Expenses: $${total.toFixed(2)}</p>
        <p>Highest Expense: $${max.toFixed(2)}</p>
        <p>Average Expense: $${avg.toFixed(2)}</p>
        <p>Number of Expenses: ${expenseAmounts.length}</p>
    `;
}

// Event listeners
document.getElementById('addBtn').addEventListener('click', addExpense);
document.getElementById('calculateBtn').addEventListener('click', function() {
    const budgetLimit = parseFloat(document.getElementById('budgetLimit').value);
    if (budgetLimit > 0) {
        calculateTotal(expenseAmounts, budgetLimit);
    } else {
        alert('Please enter a valid budget limit.');
    }
});
document.getElementById('clearAllBtn').addEventListener('click', clearAllExpenses);
document.getElementById('filterBtn').addEventListener('click', function() {
    const category = document.getElementById('filterCategory').value;
    filterByCategory(category);
});
