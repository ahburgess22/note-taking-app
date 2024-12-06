from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from bson import ObjectId
import uuid
import datetime
import bcrypt
import jwt
from functools import wraps

# Initialize Flask app
app = Flask(__name__)

# Allow CORS for all routes
CORS(app)

# MongoDB URI: Update with local MongoDB URI if necessary (use "mongodb://localhost:27017/Notes" if local)
# Set up the secret key for JWT encoding/decoding
app.config["JWT_SECRET_KEY"] = 'super_secure_and_random_jwt_secret' # change this for production

# MongoDB URI: Update with local MongoDB URI if necessary
app.config["MONGO_URI"] = "mongodb://localhost:27017/Notes"

# Initialize JWT and Bcrypt
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Initialize PyMongo
mongo = PyMongo(app)

# Route to register a user (POST)
@app.route('/register', methods = ['POST'])
def register_user():

    data = request.get_json()

    # Check if the user already exists
    existing_user = mongo.db.Users.find_one({'email': data['email']})
    if existing_user:
        return jsonify(message = "User already exists."), 400
    
    # Hash the user's password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Save the new user to the database
    mongo.db.Users.insert_one({'email': data['email'], 'password': hashed_password})
    return jsonify(message = "User registered successfully!"), 201

# Route to log a user in (POST)
@app.route('/login', methods = ['POST'])
def login_user():

    data = request.get_json()
    print(data['password'])

    # Check if the user exists
    user = mongo.db.Users.find_one({'email': data['email']})
    # print(user)
    if not user:
        print("Email not in database.")
        return jsonify(message = "User not found."), 404

    # Verify the password
    if bcrypt.check_password_hash(user['password'], data['password']):

        # Generate JWT Token
        token = create_access_token(identity = user['email'], expires_delta = datetime.timedelta(hours=1))
        print("Success!")
        return jsonify(message = "Login successful! Token valid for 1 hour.", token = token), 200
    
    else:
        print("Incorrect password")
        return jsonify(message = "Incorrect password."), 400

# Route to get all users (GET)
@app.route('/users', methods = ['GET'])
def get_users():

    users = mongo.db.Users.find() # Retrieve all users from 'Users' collection
    output = []
    for user in users:
        output.append({
            "email": user["email"],
            "password": user["password"]
        })
    return jsonify(output)

# Route to create a new note (POST)
@app.route('/notes', methods=['POST'])
@jwt_required() # Ensure the user is authenticated
def add_note():

    try:
        note_data = request.get_json()  # Try to get JSON from the request
        if not note_data:
            return jsonify(message="No data provided"), 400  # Handle case if no data is provided
        note_id = str(uuid.uuid4())

        note = {
            "id": note_id[0:2], 
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
@jwt_required() # Ensure the user is authenticated
def get_notes():

    notes = mongo.db.Notes.find() # Retrieve all notes from 'Notes' collection
    output = []
    for note in notes:
        output.append({
            "id": note["id"],
            "name": note["name"],
            "content": note["content"]
        })
    return jsonify(output)


# Route to remove oldest note (DELETE)
@app.route('/notes', methods = ['DELETE'])
@jwt_required() # Ensure the user is authenticated
def delete_note():
    
    try:
        notes = list(mongo.db.Notes.find().sort('_id', 1)) # Retrieve all notes in descending order
        if len(notes) > 0:
            note = notes[0]
            mongo.db.Notes.delete_one({'_id': note['_id']}) # Delete oldest note by ID
            return jsonify(message = "Deleted oldest item of list🫡"), 200

        else:
            return jsonify(message = "No notes found🤷"), 404

    except Exception as e:
        return jsonify(message=f"Error: {str(e)}"), 500

# Route to update a note (PUT)
@app.route('/notes/<note_id>', methods = ['PUT'])
@jwt_required() # Ensure the user is authenticated
def update_note(note_id):

    try:

        # Get the data from the request body (new data)
        updated_note = request.get_json() # Assumes client sends JSON data

        # Log the updated data to see what's coming through
        print(f"Updating note with ID: {note_id} with data: {updated_note}")

        # Find the note by its ID and update it
        result = mongo.db.Notes.update_one(
            {'id': note_id}, # Find the note by ID
            {'$set': updated_note} # Update the note with new data
        )
        return jsonify(message = "Note updated successfully!"), 200
        
    except Exception as e:
        return jsonify(message = f"Error: {str(e)}"), 500

# Create a route to update all existing notes with a user-friendly ID
@app.route('/update_notes_ids', methods = ['GET'])
def update_notes_id():

    try:
        notes = mongo.db.Notes.find() # get all notes
        for note in notes:
            if 'id' not in note:

                # Generate a new unique ID and update the note
                note_id = str(uuid.uuid4()) # Generate a unique user-friendly ID
                mongo.db.Notes.update_one(
                    {"_id": note["_id"]}, # Find the note by its _id
                    {"$set": {"id": note_id[0:2]}} # Set the new 'id' field
                )
        return jsonify(message = "All notes updated with user-friendly IDs."), 200
    
    except Exception as e:
        return jsonify(message = f"Error: {str(e)}"), 500

# Run the flask app
if __name__ == '__main__':
    app.run(debug = True)