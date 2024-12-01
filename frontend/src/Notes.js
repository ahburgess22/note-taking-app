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
    <div style = {{ textAlign: 'center', padding: '0 100px '}}>
      <h1>Austin's Notetaking App!</h1>
      <form onSubmit={handleSubmit}>
        <div style = {{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input
            type="text"
            name="name"
            value={newNote.name}
            onChange={handleInputChange}
            placeholder="Note Name"
            required
            style = {{ flex: 1, textAlign: 'center' }}
            />
            <input
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
            placeholder="Note Content"
            required
            style = {{ flex: 1, textAlign: 'center' }}
            />
        </div>
        <button type="submit" style = {{ marginTop: '10px'}}>
            Add Note
        </button>
      </form>

      <div>
        <h2>All Notes</h2>
        <ul style = {{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {notes.map((note, index) => (
            <li key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <strong>{note.name}:</strong>&nbsp; <span> { note.content}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notes;
