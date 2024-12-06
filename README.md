# note-taking-app
A simple and secure note-taking web app built with React (frontend) and Flask (backend). The app allows users to register, log in, and securely access their notes. Only authenticated users can view or add notes.

## Features
- User Authentication: Secure login and registration.
- Protected Routes: Only authenticated users can access the notes page.
- Responsive UI: Optimized for desktop and mobile usage.
- JWT Authentication: Secure user sessions with JSON Web Tokens (JWT).
- CRUD Operations on Notes: Add, edit, and delete notes for authenticated users.

## Tech Stack
- Frontend: React.js
- Backend: Flask, Flask-JWT-Extended
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
  
## Installation
#### Prerequisites
- Node.js (v14 or later)
- Python 3.x
- MongoDB (local or cloud setup)

  
## Frontend Setup
###### Clone the repository:
  
👉👉👉 git clone https://github.com/yourusername/note-taking-app.git 👈👈👈

👉👉👉 cd note-taking-app/frontend 👈👈👈

###### Install dependencies:
  
👉👉👉 npm install 👈👈👈

###### Start the React development server:
  
👉👉👉 npm start 👈👈👈

###### The app will be available at http://localhost:3000.

## Backend Setup
##### Go to the backend directory:

👉👉👉 cd ../backend

##### Install dependencies (ensure you have a virtual environment activated):

👉👉👉 pip install -r requirements.txt

##### Set up MongoDB (local or cloud) and update the Mongo URI in app.py.

##### Start the Flask server:

👉👉👉  python app.py

##### The backend will be available at http://localhost:5000.

## Database Setup
Set up your MongoDB instance (either local or on a cloud service like MongoDB Atlas).
Make sure you update the connection URI in the backend's app.py.

## Usage
When you first visit the app, you'll be prompted to log in or register.
After a successful login, you'll be redirected to your notes page.
Users can add, edit, or delete their notes.

## Screenshots
<img width="1792" alt="Screenshot 2024-12-05 at 9 57 56 PM" src="https://github.com/user-attachments/assets/e4d9b148-ecd7-4739-b1de-027b1d0478f0">
<img width="1792" alt="Screenshot 2024-12-05 at 9 59 02 PM" src="https://github.com/user-attachments/assets/b8f47225-1cf1-47e2-bbc7-0d2807e99b2c">

## Acknowledgements
- React and Flask for the web development framework.
- MongoDB for the database.
