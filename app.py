from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Allow CORS for all routes
CORS(app)

# MongoDB URI: Update with local MongoDB URI if necessary (use "mongodb://localhost:27017/Notes" if local)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Notes"

# Initialize PyMongo
mongo = PyMongo(app)

# Route to create a new note (POST)
@app.route('/notes', methods=['POST'])
def add_note():
    try:
        note_data = request.get_json()  # Try to get JSON from the request
        if not note_data:
            return jsonify(message="No data provided"), 400  # Handle case if no data is provided

        note = {
            "name": note_data.get('name', ''),
            "content": note_data.get('content', '')
        }

        # Debug: Print the note data to the console
        print(note)

        # Insert the note into the database
        mongo.db.Notes.insert_one(note)

        return jsonify(message="Note added successfully"), 201
    except Exception as e:
        return jsonify(message=f"Error: {str(e)}"), 500


# Route to get all notes (GET)
@app.route('/notes', methods = ['GET'])
def get_notes():

    notes = mongo.db.Notes.find() # Retrieve all notes from 'Notes' collection
    output = []
    for note in notes:
        output.append({
            "name": note["name"],
            "content": note["content"]
        })
    return jsonify(output)

# Run the flask app
if __name__ == '__main__':
    app.run(debug = True)