import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Memo.css';

const Memo = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [directory, setDirectory] = useState('D:\\task_manager_markdown');
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);

    if (window.ipcRenderer) {
      window.ipcRenderer.on('note-saved', (response) => {
        setSaveStatus(response.success ? 'Note saved successfully!' : 'Failed to save note.');
      });

      // Cleanup listener on component unmount
      return () => {
        window.ipcRenderer.removeAllListeners('note-saved');
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleInputChange = (e) => {
    setCurrentNote(e.target.value);
  };

  const handleDirectoryChange = (e) => {
    setDirectory(e.target.value);
  };

  const saveNote = () => {
    if (editingIndex !== null) {
      const updatedNotes = notes.map((note, index) =>
        index === editingIndex ? currentNote : note
      );
      setNotes(updatedNotes);
      setEditingIndex(null);
    } else {
      setNotes([...notes, currentNote]);
    }

    if (window.ipcRenderer) {
      window.ipcRenderer.send('save-note', { directory, note: currentNote });
    } else {
      console.warn('ipcRenderer is not available. Note not saved to filesystem.');
    }
    
    setCurrentNote('');
  };

  const editNote = (index) => {
    setCurrentNote(notes[index]);
    setEditingIndex(index);
  };

  const deleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="memo-container">
      <h1>Memo</h1>
      <input
        type="text"
        value={directory}
        onChange={handleDirectoryChange}
        placeholder="Enter saving directory"
      />
      <textarea
        value={currentNote}
        onChange={handleInputChange}
        placeholder="Write your note in Markdown..."
      />
      <button onClick={saveNote}>
        {editingIndex !== null ? 'Update Note' : 'Save Note'}
      </button>
      {saveStatus && <p>{saveStatus}</p>}
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note-item">
            <ReactMarkdown>{note}</ReactMarkdown>
            <button onClick={() => editNote(index)}>Edit</button>
            <button onClick={() => deleteNote(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memo;
