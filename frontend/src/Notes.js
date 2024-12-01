import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ name: '', content: '' });

  // Fetch notes from Flask API when the component mounts
  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/notes')
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the notes:', error);
      });
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote({ ...newNote, [name]: value });
  };

  // Handle adding a new note
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:5000/notes', newNote)
      .then((response) => {
        setNotes([...notes, newNote]);
        setNewNote({ name: '', content: '' }); // Clear input fields
      })
      .catch((error) => {
        console.error('There was an error adding the note:', error);
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newNote.name}
          onChange={handleInputChange}
          placeholder="Note Name"
          required
        />
        <textarea
          name="content"
          value={newNote.content}
          onChange={handleInputChange}
          placeholder="Note Content"
          required
        />
        <button type="submit">Add Note</button>
      </form>

      <div>
        <h2>All Notes</h2>
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <h3>{note.name}</h3>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;
