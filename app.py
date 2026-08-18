from flask import Flask, jsonify, request, render_template
#Flask=the core app itself, jsonify=converts python data into JSON format for a browser to read
from database import init_db, get_transactions, add_transaction, update_transaction, delete_transaction
#Brings all those functions from database.py into this file as well

app = Flask(__name__)
#this creates the Flask app, like turning the engine on
init_db()
#runs the database automatically when the app starts



@app.route("/transactions", methods=["GET"])
#this is a "decorator", it tells Flask "when someone visits /transactions, run the function below it."
#The methods=["GET"] just means to only do this when the user is asking for data rather than sending it
def transactions():
    data = get_transactions()
    return jsonify(data)

@app.route("/transactions", methods=["POST"])
def create_transaction():
    data = request.get_json()
    add_transaction(
        data["date"],
        data["description"],
        data["amount"],
        data["category"]
    )
    return jsonify({"message": "Transaction added successfully!"})
    #a confirmation message rather than printing all the data

@app.route("/transactions/<int:id>", methods=["PUT"])
    #<int:id> just means "hey this WHOLE NUMBER is the specific transaction to update"
def edit_transaction(id):
    data = request.get_json()
    update_transaction(
        id,
        data["date"],
        data["description"],
        data["amount"],
        data["category"]
    )
    return jsonify({"message": "Transaction updated successfully!"})

@app.route("/transactions/<int:id>", methods=["DELETE"])
def remove_transaction(id):
    delete_transaction(id)
    return jsonify({"message": "Transaction deleted successfully!"})

@app.route("/")
def index():
    return render_template("index.html")

#Notes:
    #Route                    Method              Action
    #/transactions            "GET"               Fetch all transactions
    #/transactions            "POST"              Add new transaction
    #/transactions/<int:id>   "PUT"               Update specific transaction
    #/transactions/<int:id>   "DELETE"            Delete specific transaction


if __name__ == "__main__":
    #starts Flask server
    app.run(debug=True)
    #automatically restart when changes are made