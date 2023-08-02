// Variables to store the transactions and balance
let transactions = [];

// Function to update the income, expense, and balance
function updateBalance() {
    // Step 1: Calculate the total income by filtering transactions with positive amounts,
    // and then reducing them by adding each amount to the total starting from 0.
    const income = transactions
        .filter(transaction => transaction.amount >= 0) //transaction has two properties: description, amount, and inflow
        .reduce((total, transaction) => total + transaction.amount, 0);
    /*
    const numbers = [1, -2, 3, -4, 5];
    const positiveNumbers = numbers.filter(num => num > 0);
    console.log(positiveNumbers); // Output: [1, 3, 5]
    */

    /*
    const numbers = [1, 2, 3, 4, 5];
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(sum); // Output: 15 (1 + 2 + 3 + 4 + 5)
    */

    // Step 2: Calculate the total expense by filtering transactions with negative amounts,
    // taking the absolute value of each negative amount, and then reducing them by adding
    // each absolute amount to the total starting from 0.
    const expense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

    // Step 3: Calculate the balance by subtracting the total expense from the total income.
    const balance = income - expense;

    // Step 4: Update the income, expense, and balance on the HTML by setting the text content
    // of the corresponding elements with the calculated values. The toFixed(2) method is used to
    // round the numbers to 2 decimal places to display currency format.
    document.getElementById('income').textContent = `$${income.toFixed(2)}`;
    document.getElementById('expense').textContent = `$${expense.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
    /*
    The toFixed() method is used to format a number with a fixed number of decimal places. In this case, the toFixed(2) will ensure that the
    income value is rounded to two decimal places.
    */
}

// Function to add a new transaction
function addTransaction(e) {
    /*
    when the "Add transaction" button is clicked, the addTransaction function is the event listener function associated with the form's submit
    event. The event object, conventionally represented as e or event, is automatically passed to this function when the event occurs.
    */

    e.preventDefault();
    /*
    When the "Add transaction" button is clicked, the form will attempt to submit the data to the server, which could cause a page reload or
    navigation.
    Here we use the e.preventDefault() to prevent the default form submission behavior and handle the form data manually within the addTransaction
    function.
    */

    const description = document.getElementById('text').value.trim();
    /*
    The trim() method is a built-in JavaScript method that removes any leading and trailing white spaces from a string. This ensures that any
    extra spaces that the user might have accidentally entered are removed.
    */

    const amount = parseFloat(document.getElementById('amount').value);
    /*
    The parseFloat() function is used to convert the value obtained from the input field to a floating-point number. It parses the string value
    and returns a floating-point number. This is necessary because the value property of an input field always returns a string, even if the user
    enters a number.
    */

    if (description === '' || isNaN(amount)) {
        document.getElementById('error_msg').textContent = 'Please enter a valid description and amount.';
        return;
    }
    /*
    description === '': This condition checks if the description variable is an empty string. An empty description indicates that the user has not
    entered any text in the description field.
    isNaN(amount): This condition checks if the amount variable is not a valid number. The isNaN() function returns true if the argument is not
    a number or cannot be converted to a number.
    */

    // Determine whether it's an inflow (+amount) or outflow (-amount)
    const inflow = amount >= 0;
    /*
    This is a comparison expression that checks if the value of amount is greater than or equal to zero. If the amount is greater than or equal
    to zero, the expression evaluates to true, indicating an inflow. If the amount is negative, the expression evaluates to false, indicating an
    outflow.
    */

    const transaction = { description, amount, inflow };
    transactions.push(transaction);
    // To append the transaction object to the end of the transactions array that we created in the beginning

    // Update the transactions list
    updateTransactions();

    // Update the income, expense, and balance
    updateBalance();

    // Save the updated transactions to local storage
    saveTransactionsToLocalStorage();

    // Clear the input fields
    document.getElementById('text').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('error_msg').textContent = '';
    // To reset the input fields (description and amount) and clear any error message displayed after the user adds a new transaction
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    /*
    The splice() method is an array method in JavaScript used to add or remove elements from an array.
    The splice() method will start removing elements from this index.
    The second argument of the splice() method represents the number of elements to be removed starting from the specified index. In this case, it
    is set to 1, which means only one element will be removed from the transactions array at the specified index.
    */

    // Update the transactions list
    updateTransactions();

    // Update the income, expense, and balance
    updateBalance();

    // Save the updated transactions to local storage
    saveTransactionsToLocalStorage();
}

// Function to update the transactions list
function updateTransactions() {
    const list = document.getElementById('list');
    list.innerHTML = '';

    transactions.forEach((transaction, index) => {
        /*
        To iterate over each transaction object in the transactions array. For each transaction, the loop executes the code inside the curly braces
        */

        const listItem = document.createElement('li');

        // Use backticks to dynamically create the HTML content for each list item
        listItem.innerHTML = `
        <span class="${transaction.inflow ? 'plus' : 'minus'}">${transaction.description} ($${transaction.amount.toFixed(2)})</span>
        <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
    `;

    /*
    The <span class="${transaction.inflow ? 'plus' : 'minus'}"> is a conditional operator used in a template literal to conditionally apply the CSS class to the <span>
    element based on the value of transaction.inflow. If transaction.inflow is true, it applies the class 'plus', and if transaction.inflow is
    false, it applies the class 'minus'.
    */

    /*
    The ${transaction.description} ($${transaction.amount.toFixed(2)}) displays the description and amount of the transaction. The
    transaction.description displays the description of the transaction, and transaction.amount.toFixed(2) displays the amount with two
    decimal places as a currency value.
    */

    //Then create the button the deletes the element with the index of the list item it is on

    list.appendChild(listItem);
    });
}

// Function to save transactions to local storage
function saveTransactionsToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to load transactions from local storage
function loadTransactionsFromLocalStorage() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
        /*
        This if statement checks if there is any data retrieved from the local storage. If there is data it means that transactions have been
        previously saved in the local storage.
        */
        transactions = JSON.parse(storedTransactions);
        /*
        If there are stored transactions, this line parses the string representation of the array (stored in storedTransactions) back into a
        JavaScript array format using JSON.parse()
        */
        updateTransactions();
        updateBalance();
    }

}

// Event listener to add a new transaction
document.getElementById('form').addEventListener('submit', addTransaction);

// Load transactions from local storage when the page loads
window.addEventListener('load', loadTransactionsFromLocalStorage);