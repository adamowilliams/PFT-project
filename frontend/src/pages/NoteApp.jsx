
import React, { useState, useEffect } from "react";
import Note from "../components/Note"
import "../styles/NoteApp.css";
import apiService from "../services/apiService";

function NoteApp() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    handleGetNotes();
  }, []);

  const handleGetNotes = async () => {
    const response = await apiService.getNotes();
    if (response.status === 200) {
      setNotes(response.data);
    } else {
      alert("Failed to fetch notes");
    }
  };

  const handleDeleteNote = async (id) => {
    const response = await apiService.deleteNote(id);
    if (response.status === 204) {
      alert("Note deleted successfully");
      handleGetNotes();
    } else {
      alert("Failed to delete note");
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    console.log(title, content);
    const response = await apiService.createNote(title, content);
    if (response.status === 201) {
      alert("Note created successfully");
      handleGetNotes();
    } else {
      alert("Failed to create note");
    }
  };

  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map((note) =>
          <Note note={note} onDelete={() => handleDeleteNote(note.id)} key={note.id} />
        )}
      </div>
      <h2>Create a Note</h2>
      <form onSubmit={handleCreateNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          required
          onChange={(e) => setContent(e.target.value)}
          value={content}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );

}
export default NoteApp