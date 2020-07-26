import React, { useState, useEffect } from 'react';
// import './App.css';
import styled from 'styled-components';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from './graphql/mutations';

const initialFormState = { name: '', description: '' };

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function onChange(e) {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image;
        }
        return note;
      })
    );
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <Container>
      <Heading>Welcome to My Notes App</Heading>
      <Content>
        <NewInput
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Note name"
          value={formData.name}
        />
        <NewInput
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Note description"
          value={formData.description}
        />
      </Content>
      <input type="file" onChange={onChange} />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            {note.image && <img src={note.image} style={{ width: 40 }} />}
            <button onClick={() => deleteNote(note)}>Delete note</button>
          </div>
        ))}
      </div>
      <AmplifySignOut />
    </Container>
  );
}

export default withAuthenticator(App);

const Container = styled.div`
  text-align: center;
  width: 80%;
  margin: 0px auto;
  background-color: #f5f5f1;
  padding-top: 15px;
`;
const Heading = styled.text`
  color: #31465f;
  height: 200px;
  font-size: 1.4rem;
  font-weight: bold;
`;

const NewInput = styled.input`
  width: 80%;
  margin: 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 5px 0px 5px 5px;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: rgba(49, 70, 95, 0.3);
  }
  :-ms-input-placeholder {
    color: #db7093;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0px 5px;
  align-self: center;
  justify-self: center;
`;
