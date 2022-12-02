import React, {useEffect, useState} from 'react';
import './App.css';
import {Alert, Button, Container} from "@mui/material";
import {EventList} from "./components/EventList";
import {Event, getEvents} from "./services/eventService";
import {CreateEventDialog} from "./components/CreateEventDialog";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080';

function App() {
  const [error, setError] = useState<string>()
  const [createDialog, setCreateDialog] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[]>([]);

  const openCreateDialog = () => setCreateDialog(true);

  useEffect(() => {
    getEvents()
      .then(events => setEvents(events))
      .catch(error => error.error ? setError(error.error) : console.log("unknown error"));
  }, [createDialog])

  return (
    <Container>
      {error && <Alert onClose={() => setError(undefined)} severity="error">API {error}</Alert>}
      <Button variant="contained" onClick={openCreateDialog} sx={{mt: 2, mb: 2}}>New Event</Button>
      <CreateEventDialog open={createDialog} setOpen={setCreateDialog}/>
      <EventList events={events}/>
    </Container>
  );
}

export default App;
