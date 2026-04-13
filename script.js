// Arrays to store expenses
let expenseAmounts = [];
let expenseCategories = [];

// Function to add expense
function addExpense() {
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    if (amount && category) {
        expenseAmounts.push(amount);
        expenseCategories.push(category);
        updateExpenseList();
        // Clear inputs
        document.getElementById('amount').value = '';
        document.getElementById('category').value = '';
    } else {
        alert('Please enter both amount and category.');
    }
}

// Function to update the expense list display
function updateExpenseList() {
    const list = document.getElementById('expenses');
    list.innerHTML = '';
    for (let i = 0; i < expenseAmounts.length; i++) {
        const li = document.createElement('li');
        li.textContent = `${expenseCategories[i]}: $${expenseAmounts[i].toFixed(2)}`;
        list.appendChild(li);
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
        resultDiv.innerHTML += `You have exceeded your budget by $${(total - budgetLimit).toFixed(2)}.`;
    } else {
        resultDiv.innerHTML += `You are within your budget. Remaining: $${(budgetLimit - total).toFixed(2)}.`;
    }
}

// Event listeners
document.getElementById('addBtn').addEventListener('click', addExpense);
document.getElementById('calculateBtn').addEventListener('click', function() {
    const budgetLimit = parseFloat(document.getElementById('budgetLimit').value);
    if (budgetLimit) {
        calculateTotal(expenseAmounts, budgetLimit);
    } else {
        alert('Please enter a budget limit.');
    }
});
