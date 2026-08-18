const API_URL = "http://127.0.0.1:5000"
//Just naming the page URL so it's easier to repeat

function addTransaction() {
    const description = document.getElementById("description").value
    const amount = document.getElementById("amount").value
    const date = document.getElementById("date").value
    const category = document.getElementById("category").value
    /* This simply grabs the user's input values and assigns them a variable
        so, again, it's easier to reuse in the code.
        --'document' just means the specific webpage being used,
        --'.getElementById("")' points JS to the correlating physical input BOX,
        --'.value' tells JS to grab what's inside that input box--the actual value. */

    if (!description || !amount || !date || !category) {
        //Verify that all fields are filled in
        //"if (!description..." translates to "if description is empty"        
        alert("Please fill in all fields!")
        /*If any inputs are missing, this message pops up
            and 'return' stops the addTransaction() from going any further.*/
        return
    }

    //Now the actual doing of stuff
    fetch(`${API_URL}/transactions`, {
        //Important to remember that 'fetch' does NOT only mean retrieve
        method: "POST",
        //specify to JS that this is to POST, not GET (if method not included it is default GET)
        headers: {
            /*NOT the same as the table headers, totally different thing.
                Just how you tell Flask how the data is to be interpreted (annoying).*/
            "Content-Type": "application/json"
            //"Hey, Flask, the stuff inside this POST request is in JSON format btw."
        },
        body: JSON.stringify({
            //Puts data into JSON format so Flask can handle it
            description: description,
            amount: parseFloat(amount),
            date: date,
            category: category
            /*Much like a python dictionary, these work as key-value pairs
                so the first 'key' isn't actually the variable that's being used
                in the 'value' slot. Two different things.*/
        })
    })
    .then(response => response.json())
    //"Only once Flask responds, unpack the JSON parts"
    .then(() => {
        /* ( )"I don't care what came back after the previous request"
            => "Just run this code now." */
        document.getElementById("description").value = ""
        document.getElementById("amount").value = ""
        document.getElementById("date").value = ""
        document.getElementById("category").value = ""
        //Clears the input boxes so the form can easily be used again
        loadTransactions()
        loadChart()
    })
}

function loadTransactions() {
    //To manage the list dynamically
    fetch(`${API_URL}/transactions`)
    //no 'methods' specification == default 'GET' request
        .then(response => response.json())
        //Formatting the response data from JSON into JavaScript data
        .then(transactions => {
            const list = document.getElementById("transaction-list")
            list.innerHTML = ""
            //makes 'transactions' into a list of all the transaction rows
            /*list.innerHTML part just clears the list before refilling it 
                to prevent duplicates every time the data gets reloaded.*/
            transactions.forEach(transaction => {
                const row = document.createElement("tr")
                //creates a new <tr> table row IN MEMORY--not yet on the page (?)

                /*BELOW: fills that row with cells, using the [index#] for each
                    specific one. [0] is the id, [1] is the date, and so on.
                        Also, that additional $ is there on purpose to make it show '$0.00'*/
                row.innerHTML = `
                    <td>${transaction[1]}</td>
                    <td>${transaction[2]}</td>
                    <td>$${transaction[3]}</td>
                    <td>${transaction[4]}</td>
                    <td>
                        <button class="edit-btn" onclick="editTransaction(${transaction[0]}, '${transaction[1]}', '${transaction[2]}', ${transaction[3]}, '${transaction[4]}')">Edit</button>
                        <button class="delete-btn" onclick="deleteTransaction(${transaction[0]})">Delete</button>
                    </td>
                `
                /*The delete button is coded in the JavaScript file because the delete
                    button should not exist without any transaction entries. So, you need
                    to use JavaScript to DYNAMICALLY adjust the webpage as data changes.*/
                list.appendChild(row)
                //NOW that new <tr> table row gets put onto the page inside the <tbody>
            })
        })
}

function deleteTransaction(id) {
/*this function needs an id # to work, which refers back to your delete button
    in your loadTransactions() function. That button was coded to hold a specific entry id#,
    which then lands here to fulfill your parameter.*/
    fetch(`${API_URL}/transactions/${id}`, {
    /*Builds the url dynamically, so if you're deleting entry 3, it shows as
        "'URL'/transactions/3" */
        method: "DELETE"
        /*With the DELETE method, you don't need headers or body, because you're
            not sending any data, just pointing at a specific entry by its id # */
    })
    .then(response => response.json())
    .then(() => {
        loadTransactions()
        //Reads updated list from Flask and loads it fresh so the user can see it.
        loadChart()
    })
}

function editTransaction(id, date, description, amount, category) {
    const row = document.querySelector(`button[onclick="editTransaction(${id}, '${date}', '${description}', ${amount}, '${category}')"]`).closest("tr")
    /*This specifically points to the HTML structure where the DYNAMICALLY added 'Edit Button'
        is located. This then allows JavaScript to know where in the HTML structure
        to temporarily change the format of that specific table row.*/
    /*Also, querySelector is just a repeat of the Edit button call from loadTransactions(),
        it is not another instance of actually calling for it.*/
    /*All the data--like the id, date, description, etc.--has already been collected
        the moment the button was clicked. This line is not HANDLING data, it's just locating 
        a specific place on the HTML structure.*/
    row.innerHTML = `
        <td><input type="date" id="edit-date" value="${date}"></td>
        <td><input type="text" id="edit-description" value="${description}"></td>
        <td><input type="number" id="edit-amount" value="${amount}"></td>
        <td><input type="text" id="edit-category" value="${category}"></td>
        <td>
            <button class="save-btn" onclick="saveTransaction(${id})">Save</button>
            <button class="cancel-btn" onclick="loadTransactions()">Cancel</button>
        </td>
    `
    /*This resembles the form section of the HTML file because that's exactly what it is.
        JavaScript is temporarily changing the appearance of the specific <tr> so that
        it replicates the appearance of the form section.*/
    /*It places input boxes where the cells are and prefills them with the CURRENT values
        the database has stored for that <tr> id, letting the user type directly in
        the one they want to change.*/
    /*It also temporarily swaps out the Edit and Delete buttons for Save and Cancel buttons.
        The Save button calls for saveTransaction() onclick,
        and the Cancel button calls for loadTransactions() onclick--which just puts everything
        back to normal, erasing the temporary formatting changes.*/
}

function saveTransaction(id) {
    const date = document.getElementById("edit-date").value
    const description = document.getElementById("edit-description").value
    const amount = document.getElementById("edit-amount").value
    const category = document.getElementById("edit-category").value

    if (!description || !amount || !date || !category) {
        alert("Please fill in all fields!")
        return
    }

    fetch(`${API_URL}/transactions/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            date: date,
            description: description,
            amount: parseFloat(amount),
            category: category
        })
    })
    .then(response => response.json())
    .then(() => {
        loadTransactions()
        loadChart()
    })
}

let spendingChart = null

function loadChart() {
    fetch(`${API_URL}/transactions`)
        .then(response => response.json())
        .then(transactions => {
            const categoryTotals = {}

            transactions.forEach(transaction => {
                const category = transaction[4]
                const amount = transaction[3]

                if (categoryTotals[category]) {
                    categoryTotals[category] += amount
                } else {
                    categoryTotals[category] = amount
                }
            })

            const labels = Object.keys(categoryTotals)
            const data = Object.values(categoryTotals)

            if (spendingChart) {
                spendingChart.destroy()
            }

            const ctx = document.getElementById("spending-chart")
            spendingChart = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: ["#271733", "#9a7aac", "#695872", "#c4a8d6", "#4a3a5c"]
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: "#000000"
                            }
                        }
                    }
                }
            })
        })
}

loadTransactions()
//call immediately so the transactions appear right away
loadChart()