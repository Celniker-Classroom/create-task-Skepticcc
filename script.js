// Arrays to store expenses
let expenseAmounts = [];
let expenseCategories = [];
let expenseDates = [];
let expenseIds = []; // Track unique IDs for editing expenses

// Object to store category budgets
let categoryBudgets = {
    'Food': 300,
    'Transportation': 200,
    'Entertainment': 150,
    'Utilities': 100,
    'Other': 100
};

// Load data from localStorage when page loads
window.onload = function() {
    loadExpenses();
    loadCategoryBudgets();
    updateExpenseList();
    updateSummary();
    updateCategoryBreakdown();
};

// Save all expenses to browser storage
function saveExpenses() {
    localStorage.setItem('expenseAmounts', JSON.stringify(expenseAmounts));
    localStorage.setItem('expenseCategories', JSON.stringify(expenseCategories));
    localStorage.setItem('expenseDates', JSON.stringify(expenseDates));
    localStorage.setItem('expenseIds', JSON.stringify(expenseIds));
}

// Save category budgets so they persist after page refresh
function saveCategoryBudgets() {
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
}

// Retrieve saved expenses from browser storage
function loadExpenses() {
    const amounts = localStorage.getItem('expenseAmounts');
    const categories = localStorage.getItem('expenseCategories');
    const dates = localStorage.getItem('expenseDates');
    const ids = localStorage.getItem('expenseIds');

    if (amounts) expenseAmounts = JSON.parse(amounts);
    if (categories) expenseCategories = JSON.parse(categories);
    if (dates) expenseDates = JSON.parse(dates);
    if (ids) expenseIds = JSON.parse(ids);
    else expenseIds = expenseAmounts.map((_, i) => i); // Generate IDs if loading old data
}

// Load category budgets from storage, use defaults if none saved
function loadCategoryBudgets() {
    const saved = localStorage.getItem('categoryBudgets');
    if (saved) categoryBudgets = JSON.parse(saved);
}

// Add a new expense to the list (validates inputs first)
function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Check that all required fields are filled and amount is positive
    if (amount > 0 && category && date) {
        const id = Date.now(); // Create unique ID using timestamp
        expenseAmounts.push(amount);
        expenseCategories.push(category);
        expenseDates.push(date);
        expenseIds.push(id);

        saveExpenses();
        updateExpenseList();
        updateSummary();
        updateCategoryBreakdown();

        // Clear input fields after successful add
        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';
        document.getElementById('date').value = '';
    } else {
        alert('Please enter valid amount, select category, and choose a date.');
    }
}

// Display all expenses in a formatted list (can be filtered)
function updateExpenseList(filteredAmounts = expenseAmounts, filteredCategories = expenseCategories, filteredDates = expenseDates, filteredIndices = expenseAmounts.map((_, i) => i)) {
    const list = document.getElementById('expenses');
    list.innerHTML = '';

    if (filteredAmounts.length === 0) {
        list.innerHTML = '<li style="padding: 20px; text-align: center; color: #999;">No expenses yet</li>';
        return;
    }

    for (let i = 0; i < filteredAmounts.length; i++) {
        const li = document.createElement('li');
        const originalIndex = filteredIndices[i];

        // Check if this category is over budget
        const categoryBudget = categoryBudgets[filteredCategories[i]];
        const categoryTotal = calculateCategoryTotal(filteredCategories[i]);
        const isOverBudget = categoryTotal > categoryBudget;
        const overBudgetStyle = isOverBudget ? 'border-left: 4px solid #ff5722;' : '';

        li.style.cssText = overBudgetStyle;
        li.innerHTML = `<div><strong>${filteredCategories[i]}</strong>: $${filteredAmounts[i].toFixed(2)}<br><small>${filteredDates[i]}</small></div>
                        <button onclick="deleteExpense(${originalIndex})">Delete</button>`;
        list.appendChild(li);
    }
}

// Remove a specific expense from the list by index
function deleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenseAmounts.splice(index, 1);
        expenseCategories.splice(index, 1);
        expenseDates.splice(index, 1);
        expenseIds.splice(index, 1);

        saveExpenses();
        updateExpenseList();
        updateSummary();
        updateCategoryBreakdown();
    }
}

// Delete all expenses at once (with confirmation)
function clearAllExpenses() {
    if (confirm('Are you sure you want to clear ALL expenses? This cannot be undone!')) {
        expenseAmounts = [];
        expenseCategories = [];
        expenseDates = [];
        expenseIds = [];

        saveExpenses();
        updateExpenseList();
        updateSummary();
        updateCategoryBreakdown();
    }
}

// Calculate total spending and compare it to the overall budget limit
function calculateTotal(expenseList, budgetLimit) {
    let total = 0;

    // Add up all expenses in the list
    for (let i = 0; i < expenseList.length; i++) {
        total += expenseList[i];
    }

    const resultDiv = document.getElementById('result');
    const percentage = (total / budgetLimit * 100).toFixed(1);

    // Show total and percentage of budget used
    resultDiv.innerHTML = `Total Expenses: $${total.toFixed(2)} (${percentage}% of budget)<br>`;

    if (total > budgetLimit) {
        // Alert if over budget
        resultDiv.innerHTML += `❌ You have exceeded your budget by $${(total - budgetLimit).toFixed(2)}.`;
        resultDiv.style.backgroundColor = '#ffebee';
        resultDiv.style.color = '#c62828';
    } else {
        // Show remaining budget if under limit
        resultDiv.innerHTML += `✅ You are within your budget. Remaining: $${(budgetLimit - total).toFixed(2)}.`;
        resultDiv.style.backgroundColor = '#e8f5e9';
        resultDiv.style.color = '#2e7d32';
    }
}

// Find the largest single expense
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

// Calculate the average spending per expense
function calculateAverage(expenseList) {
    if (expenseList.length === 0) return 0;
    let total = 0;

    for (let i = 0; i < expenseList.length; i++) {
        total += expenseList[i];
    }
    return total / expenseList.length;
}

// Calculate how much was spent in a specific category
function calculateCategoryTotal(category) {
    let total = 0;
    for (let i = 0; i < expenseCategories.length; i++) {
        if (expenseCategories[i] === category) {
            total += expenseAmounts[i];
        }
    }
    return total;
}

// Show expenses filtered by selected category
function filterByCategory(category) {
    if (!category) {
        // If no category selected, show all
        updateExpenseList();
        return;
    }

    const filteredAmounts = [];
    const filteredCategories = [];
    const filteredDates = [];
    const filteredIndices = [];

    // Loop through and only add the ones that match the selected category
    for (let i = 0; i < expenseCategories.length; i++) {
        if (expenseCategories[i] === category) {
            filteredAmounts.push(expenseAmounts[i]);
            filteredCategories.push(expenseCategories[i]);
            filteredDates.push(expenseDates[i]);
            filteredIndices.push(i);
        }
    }
    updateExpenseList(filteredAmounts, filteredCategories, filteredDates, filteredIndices);
}

// Show total, average, max spending and number of expenses
function updateSummary() {
    const summaryDiv = document.getElementById('summaryStats');
    const total = expenseAmounts.reduce((sum, amt) => sum + amt, 0);
    const max = calculateMax(expenseAmounts);
    const avg = calculateAverage(expenseAmounts);
    const count = expenseAmounts.length;

    summaryDiv.innerHTML = `
        <p><strong>Total Expenses:</strong> $${total.toFixed(2)}</p>
        <p><strong>Highest Expense:</strong> $${max.toFixed(2)}</p>
        <p><strong>Average Expense:</strong> $${avg.toFixed(2)}</p>
        <p><strong>Number of Expenses:</strong> ${count}</p>
    `;
}

// Show how much was spent in each category and if it exceeds the limit
function updateCategoryBreakdown() {
    const breakdownDiv = document.getElementById('categoryBreakdown');
    if (!breakdownDiv) return;

    let html = '<div class="category-stats">';
    let totalSpent = 0;

    // Loop through each category and show spending
    for (let category in categoryBudgets) {
        const spent = calculateCategoryTotal(category);
        const budget = categoryBudgets[category];
        const percentage = (spent / budget * 100).toFixed(0);
        const isOver = spent > budget;

        totalSpent += spent;

        const statusIcon = isOver ? '⚠️' : '✓';
        const remaining = budget - spent;

        html += `
            <div class="category-item" style="border-left: 4px solid ${isOver ? '#ff5722' : '#4CAF50'};">
                <p><strong>${category}</strong> ${statusIcon}</p>
                <p>Spent: $${spent.toFixed(2)} / $${budget} (${percentage}%)</p>
                <p>${isOver ? `⚠️ Over by $${(spent - budget).toFixed(2)}` : `Remaining: $${remaining.toFixed(2)}`}</p>
            </div>
        `;
    }

    html += '</div>';
    breakdownDiv.innerHTML = html;
}

// Button event listeners - these run when user clicks buttons
document.getElementById('addBtn').addEventListener('click', addExpense);

document.getElementById('calculateBtn').addEventListener('click', function() {
    const budgetLimit = parseFloat(document.getElementById('budgetLimit').value);
    // Check that budget is valid before calculating
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

// Allow Enter key to add expense
document.getElementById('amount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addExpense();
});

// added fundemntal ideas and eventlisteners to complete the functionality of the app, including saving to localStorage, filtering by category, and showing summary stats. The code is structured to be easy to read and maintain, with comments explaining each function's purpose.