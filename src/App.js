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
      <Content>
        <AddImage>
          <input type="file" onChange={onChange} />
        </AddImage>
        <NoteButton onClick={createNote}>Create Note</NoteButton>
      </Content>
      <div style={{ marginBottom: 30 }}>
        <Heading>Notes</Heading>
        {notes.map((note) => (
          <SubContent key={note.id || note.name}>
            <div>
              {note.image && <img src={note.image} style={{ width: 40 }} />}
            </div>
            <p>{note.name}</p>
            <p>{note.description}</p>

            <NoteButton onClick={() => deleteNote(note)}>
              Delete note
            </NoteButton>
          </SubContent>
        ))}
      </div>
      <Signout>
        <AmplifySignOut />
      </Signout>
    </Container>
  );
}

export default withAuthenticator(App);

const Container = styled.div`
  text-align: center;
  width: 80%;
  margin: 2px auto;
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
  align-items: center;
  justify-content: center;
`;
const SubContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 25px 5px;
  align-self: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 400;
  color: #31465f;
  padding: 5px;
`;

const AddImage = styled.div`
  text-align: center;
  padding-left: 80px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const NoteButton = styled.div`
  box-shadow: 0px 10px 20px rgba(101, 41 255, 0.15);
  border-radius: 30px;
  width: 120px;
  font-size: 1em;
  color: #31465f;
  margin: 0 auto;
  /* margin-top: 50px; */
  /* margin-bottom: 50px; */
  padding: 0.25em 0em 0.4em;
  border: 0.5px solid #31465f;
  border-radius: 3px;
  justify-self: center;
  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px);
    cursor: pointer;
  }
`;
const Signout = styled.button`
  width: 150px;
  overflow: hidden;
  border: none;
`;
