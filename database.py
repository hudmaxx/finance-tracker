import sqlite3

def init_db():
    #To connect to the database (creates file if it doesn't exist)
    conn = sqlite3.connect("finance_tracker.db")
    cursor = conn.cursor()

    #Create transactions table
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS transactions (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       date TEXT NOT NULL,
                       description TEXT NOT NULL,
                       amount REAL NOT NULL,
                       category TEXT NOT NULL
                   )
                   """)
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

#CRUD
    #Create: add new transaction
    #Read: retrieve transactoins to display
    #Update: edit an existing transaction
    #Delete: remove a transaction

#Create: add new transaction
def add_transaction(date, description, amount, category):
    conn = sqlite3.connect("finance_tracker.db")
    cursor = conn.cursor()

    cursor.execute("""
                   INSERT INTO transactions (date, description, amount, category)
                   VALUES (?, ?, ?, ?)
                   """, (date, description, amount, category))
                    #"Insert a new row, filling these 4 columns with these 4 values."
                    #"""here are your instructions""", this is what you fill into the ?s
                    #The ?s are just placeholders that SQLite uses called 'parameterized queries"
                        #But, unlike Python, the ?s get assigned their values based on the order the information is given to them
    conn.commit()
    conn.close()
    print(f"Transaction added: {description} - ${amount}")

#Read: retrieve transactions to display
def get_transactions():
    conn = sqlite3.connect("finance_tracker.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM transactions")
    #"get everything from the transaction table" (* means "all columns)
    transactions = cursor.fetchall()
    #grabs all the results and hands them to Python as a list

    conn.close()
    return transactions

#Update: edit an existing transaction
def update_transaction(id, date, description, amount, category):
    conn = sqlite3.connect("finance_tracker.db")
    cursor = conn.cursor()

    cursor.execute("""
                   UPDATE transactions
                   SET date = ?, description = ?, amount = ?, category = ?
                   WHERE id = ?
                   """, (date, description, amount, category, id))
                    #"I want to modify something in the table. Here are the columns I want to change and their ?s. Only change if the ids match."
                    #The id comes last here even though it's the first parameter in the function.
                    #That's because it matches the order of the ?s in the instructions — and the WHERE id = ? comes last in the instruction.
    conn.commit()
    conn.close()
    print(f"Transaction {id} updated successfully!")

#Delete: remove a transaction
def delete_transaction(id):
    conn = sqlite3.connect("finance_tracker.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM transactions WHERE id = ?", (id,))
    #That comma after id is not a typo!!!
    #When you're passing just one value as a tuple in Python, you need that trailing comma,
    #otherwise Python won't recognize it as a tuple at all (annoying)

    conn.commit()
    conn.close()
    print(f"Transaction {id} deleted successfully!")