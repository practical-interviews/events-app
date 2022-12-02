package com.practical.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.practical.events.dtos.EventResponse;
import com.practical.events.entities.Event;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void save_event_returns200_andEventResponse() throws Exception {
        mockMvc.perform(post("/events")
                .content("{\"title\": \"New Event\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 1 }")
                .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("title").value("New Event"))
                    .andExpect(jsonPath("dateTime").value("2021-01-01T12:00:00"))
                    .andExpect(jsonPath("guests").value(1));
    }

    @Test
    public void save_event_returns400_and_error_when_event_name_is_empty() throws Exception {
        mockMvc.perform(post("/events")
                        .content("{\"title\": \"\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 1 }")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("title").value("must not be empty"));
    }

    @Test
    public void save_event_returns400_and_error_when_guests_are_negative() throws Exception {
        mockMvc.perform(post("/events")
                        .content("{\"title\": \"\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": -1 }")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("guests").value("must be greater than or equal to 0"));
    }

    @Test
    public void save_event_returns400_and_error_when_guests_greater_than_30() throws Exception {
        mockMvc.perform(post("/events")
                        .content("{\"title\": \"\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 74 }")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("guests").value("must be less than or equal to 30"));
    }

    @Test
    public void update_event_returns200_andEventResponse() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/events")
                .content("{\"title\": \"New Event\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 1 }")
                .contentType(MediaType.APPLICATION_JSON)).andReturn();
        EventResponse eventResponse = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), EventResponse.class);

        mockMvc.perform(put("/events/"+eventResponse.id)
                        .content("{\"title\": \"New Title\", \"dateTime\": \"2021-01-02T12:00:00\", \"guests\": 18 }")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("id").value(eventResponse.id))
                .andExpect(jsonPath("title").value("New Title"))
                .andExpect(jsonPath("dateTime").value("2021-01-02T12:00:00"))
                .andExpect(jsonPath("guests").value(18));
    }

    @Test
    public void update_events_with_bad_id_returns404() throws Exception {
        mockMvc.perform(put("/events/not-found")
                        .content("{\"title\": \"New Title\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 18 }")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void get_events_returns200_andEventResponse() throws Exception {
        mockMvc.perform(post("/events")
                .content("{\"title\": \"New Event\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 1 }")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(1))));
    }

    @Test
    public void get_events_with_id_returns200_andEventResponse() throws Exception {
        String result = mockMvc.perform(post("/events")
                .content("{\"title\": \"New Event\", \"dateTime\": \"2021-01-01T12:00:00\", \"guests\": 1 }")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        Event event = objectMapper.readValue(result, Event.class);

        mockMvc.perform(get("/events/{id}", event.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("id").value(event.getId()));
    }

    @Test
    public void get_events_with_bad_id_returns404() throws Exception {
        mockMvc.perform(get("/events/bad-id"))
                .andExpect(status().isNotFound());
    }
}