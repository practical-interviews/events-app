package com.practical.events;

import com.practical.events.dtos.EventRequest;
import com.practical.events.dtos.EventResponse;
import com.practical.events.entities.Event;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static java.util.stream.Collectors.toList;


@RestController
@CrossOrigin
@Validated
public class EventController {

    private EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping("/events")
    public ResponseEntity<EventResponse> addEvent(@Valid @RequestBody EventRequest eventRequest) {
        Event event = eventService.saveEvent(eventRequest.toEvent());
        return new ResponseEntity<>(new EventResponse(event), HttpStatus.OK);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable String id, @Valid @RequestBody EventRequest updateRequest) {
        EventResponse event = eventService.getEvent(id)
                .map(existingEvent -> update(existingEvent, updateRequest))
                .map(eventService::saveEvent)
                .map(EventResponse::new)
                .orElseThrow();
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    private Event update(Event event, EventRequest updateRequest) {
        event.setTitle(updateRequest.getTitle());
        event.setDateTime(updateRequest.getDateTime());
        event.setGuests(updateRequest.getGuests());
        event.setLocation(updateRequest.getLocation());
        return event;
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getEvents() {
        List<EventResponse> response = eventService.getAllEvents()
                .stream()
                .map(EventResponse::new)
                .collect(toList());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable String id) {
        EventResponse event = eventService.getEvent(id)
                .map(EventResponse::new)
                .orElseThrow();
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
