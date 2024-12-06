import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ name: '', content: '' });
  const [editingNote, setEditingNote] = useState(null); // state to track which note is being edited

  // Fetch notes from Flask API when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
        window.location.href = '/login'; // Force redirect to login page
    } else {
    axios
      .get('http://127.0.0.1:5000/notes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}`}
      })
      .then((response) => {
        console.log(response.data); // Add a log to inspect the response
        if (Array.isArray(response.data)) {
            setNotes(response.data);
        } else {
            console.error("Expected an array of notes, but got:", response.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the notes:', error);
      });
    }
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
      .post('http://127.0.0.1:5000/notes', newNote, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      })
      .then((response) => {
        setNotes([...notes, response.data]); // Add the new note to the state
        setNewNote({ name: '', content: '' }); // Clear input fields
      })
      .catch((error) => {
        console.error('There was an error adding the note:', error);
      });
  };

  // Handle deleting oldest note
  const handleDelete = () => {
    axios
      .delete('http://127.0.0.1:5000/notes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      })
      .then((response) => {
        // Fetch the updated list of notes after deletion
        axios
          .get('http://127.0.0.1:5000/notes')
          .then((response) => {
            setNotes(response.data); // Update state with the new list
          })
          .catch((error) => {
            console.error('There was an error fetching the updated notes:', error);
          });
      })
      .catch((error) => {
        console.error('There was an error deleting the note:', error);
      });
  };

  // Handle edit button click
  const handleEdit = (id) => {
    setEditingNote(id); // Set the note to be edited
  };

  // Handle input change during edit
  const handleUpdateInputChange = (e, id, field) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, [field]: e.target.value } : note
    );
    setNotes(updatedNotes);
  };

  // Handle save button click
  const handleSave = (id) => {
    const updatedNote = notes.find((note) => note.id === id);
    
    axios
      .put(`http://127.0.0.1:5000/notes/${id}`, updatedNote, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      })
      .then((response) => {
        // Ensure you're logging the response to see what's being returned
        console.log("Updated Note:", response.data); 
        setNotes((prevNotes) => 
          prevNotes.map((note) => 
            note.id === id ? { ...note, ...response.data } : note // Update the specific note
          )
        );
        setEditingNote(null); // Stop editing
      })
      .catch((error) => {
        console.error('Error updating note:', error);
      });
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditingNote(null); // Stop editing
  };

  return (
    <div style={{ textAlign: 'center', padding: '0 100px' }}>
      <h1>Austin's Notetaking App!</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <input
          type="text"
          name="name"
          value={newNote.name}
          onChange={handleInputChange}
          placeholder="Note Name"
          style={{ flex: 1, textAlign: 'center' }}
        />
        <input
          type="text"
          name="content"
          value={newNote.content}
          onChange={handleInputChange}
          placeholder="Note Content"
          style={{ flex: 1, textAlign: 'center' }}
        />
    </form>

    <div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Add Note
        </button>
    </div>

      <button onClick={handleDelete} style={{ marginTop: '10px' }}>
        Delete Oldest Note
      </button>

      <h2>All Notes</h2>
      <div
        style={{
          listStyleType: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {notes.map((note) => (
          <div key={note.id} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            {editingNote === note.id ? (
              <>
                <input
                  type="text"
                  value={note.name}
                  onChange={(e) => handleUpdateInputChange(e, note.id, 'name')}
                />
                <input
                  type="text"
                  value={note.content}
                  onChange={(e) => handleUpdateInputChange(e, note.id, 'content')}
                />
                <button onClick={() => handleSave(note.id)}>Save</button>
                <button onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{note.name}</strong>: {note.content} &nbsp;
                <button onClick={() => handleEdit(note.id)}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
