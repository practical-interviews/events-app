import {Event, updateEvent} from "../services/eventService";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import React, {ChangeEvent, ChangeEventHandler, useState} from "react";

const EventRow = (props: { event: Event }) => {
  const [formData, setFormData] = useState<Event>(props.event)

  const submitForm = () => {
    if (props.event.id) {
      updateEvent(props.event!.id, formData)
        .catch((error) => console.log(error))
    }
  }

  const updateData: ChangeEventHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.id]: e.target.value,});
  };

  return (
    <TableRow sx={{"&:last-child td, &:last-child th": {border: 0}}}>
      <TableCell><TextField onChange={updateData} margin="dense" id="title" label="Title" type="text"
                            defaultValue={props.event.title}/></TableCell>
      <TableCell><TextField onChange={updateData} margin="dense" id="dateTime" label="Date/Time" type="datetime-local"
                            defaultValue={props.event.dateTime}/></TableCell>
      <TableCell><TextField onChange={updateData} margin="dense" id="location" label="Location" type="text"
                            defaultValue={props.event.location}/></TableCell>
      <TableCell><TextField onChange={updateData} margin="dense" id="guests" label="Guests" type="number"
                            defaultValue={props.event.guests}/></TableCell>
      <TableCell><Button id="update" onClick={submitForm} variant="outlined">Update</Button></TableCell>
    </TableRow>
  );
}

export const EventList = (props: { events: Event[] }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Event</TableCell>
            <TableCell>Date/Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Guests</TableCell>
            <TableCell>Update</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.events.map(event => <EventRow event={event} key={event.id}/>)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}