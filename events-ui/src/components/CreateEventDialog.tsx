import {createEvent, Event} from "../services/eventService";
import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {ChangeEvent, ChangeEventHandler, FormEventHandler, useState} from "react";

type Errors<T> = {
  [P in keyof T]?: string;
};

type GlobalError<T> = Errors<T> & {error: string};

export function CreateEventDialog(props: { open: boolean, setOpen: (open: boolean) => void }) {
  const [formData, setFormData] = useState<Event>({})
  const [error, setError] = useState<GlobalError<Event>>()

  const submitForm: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    createEvent(formData)
      .then(() => props.setOpen(false))
      .catch(error => setError(error));
  }

  const updateData: ChangeEventHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.id]: e.target.value,});
  };

  return (
    <Dialog open={props.open} onClose={props.setOpen}>
      {error?.error && <Alert onClose={() => setError(undefined)} severity="error">API {error.error}</Alert>}
      <DialogTitle>Create Event</DialogTitle>
      <form onSubmit={submitForm}>
        <DialogContent>
          <TextField autoFocus onChange={updateData} margin="dense" id="title" label="Title" type="text" fullWidth
                     variant="outlined" error={error?.title !== undefined} helperText={error?.title}/>
          <TextField autoFocus onChange={updateData} margin="dense" id="dateTime" label="Date" type="datetime-local"
                     fullWidth variant="outlined" error={error?.dateTime !== undefined} helperText={error?.dateTime} InputLabelProps={{shrink: true}}/>
          <TextField autoFocus onChange={updateData} margin="dense" id="location" label="Location" type="text" fullWidth
                     variant="outlined" error={error?.location !== undefined} helperText={error?.location}/>
          <TextField autoFocus onChange={updateData} margin="dense" id="guests" label="Guests" type="number" fullWidth
                     variant="outlined" error={error?.guests !== undefined} helperText={error?.guests}/>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => props.setOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}