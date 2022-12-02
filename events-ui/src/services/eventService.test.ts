import nock from "nock";

import {createEvent, Event, getEventById, getEvents, updateEvent} from "./eventService";
import axios from "axios";

describe("eventService", () => {
  const baseServerURL: string = "http://localhost:8080";

  beforeEach(() => {
    axios.defaults.adapter = require('axios/lib/adapters/http');
    axios.defaults.baseURL = baseServerURL;
  });

  describe("getEvents", () => {
    it("requests event list from server", async () => {
      nock(baseServerURL)
        .get("/events")
        .reply(200,
          [
            {title: "Michael Scott's Birthday", dateTime: "", location: "Ice Rink", guests: 25},
            {title: "The 5th Annual Dundies", dateTime: "", location: "Chilli's", guests: 42}
          ]
        );

      const events = await getEvents();

      expect(events).toContainEqual({title: "Michael Scott's Birthday", dateTime: "", location: "Ice Rink", guests: 25})
    });

    it('throws error if server fails', async () => {
      nock(baseServerURL)
        .get("/events")
        .reply(500, {});

      await expect(() => getEvents()).rejects.toEqual({"error": "Request failed with status code 500"})
    });
  });

  describe("createEvent", () => {
    const dateTime = new Date();
    it("post the create event request to the server", async () => {
      nock(baseServerURL)
        .post("/events", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+ dateTime.toISOString() +"\",\"location\":\"Ice Rink\",\"guests\":20}")
        .reply(201, {
          id: "generated-id",
          title: "Micheal's Birthday",
          dateTime: "",
          location: "Ice Rink",
          guests: 1
        });

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: 20}
      const response = await createEvent(event);

      expect(response.id).toEqual("generated-id")
      expect(response.title).toEqual("Micheal's Birthday")
    });

    it("throws an error with message if creation fails", async () => {
      nock(baseServerURL)
        .post("/events", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+ dateTime.toISOString() +"\",\"location\":\"Ice Rink\",\"guests\":-10}")
        .reply(400, {
          guests: "must be greater than or equal to 0"
        });

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: -10}

      await expect(() => createEvent(event)).rejects.toEqual({"guests": "must be greater than or equal to 0"})
    });

    it("throws a generic error if creation fails", async () => {
      nock(baseServerURL)
        .post("/events", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+ dateTime.toISOString() +"\",\"location\":\"Ice Rink\",\"guests\":-10}")
        .reply(500, {});

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: -10}

      await expect(() => createEvent(event)).rejects.toEqual({"error": "Request failed with status code 500"})
    });
  });

  describe('getEventById', () => {
    it('requests event by id from server', async () => {
      nock(baseServerURL)
        .get("/events/generated-id")
        .reply(200, {
          id: "generated-id",
          title: "Micheal's Birthday",
          dateTime: "",
          location: "Ice Rink",
          guests: 1
        });

      const response = await getEventById("generated-id");

      expect(response).toEqual({
        id: "generated-id",
        title: "Micheal's Birthday",
        dateTime: "",
        location: "Ice Rink",
        guests: 1
      })
    });

    it('throws error if now found', async () => {
      nock(baseServerURL)
        .get("/events/not-found")
        .reply(404, {});

      await expect(() => getEventById("not-found")).rejects.toEqual({"error": "Request failed with status code 404"})
    });
  });

  describe("updateEvent", () => {
    const dateTime = new Date();
    it("put the update event request to the server", async () => {
      nock(baseServerURL)
        .put("/events/existing-id", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+dateTime.toISOString()+"\",\"location\":\"Ice Rink\",\"guests\":20}")
        .reply(200, {
          id: "existing-id",
          title: "Micheal's Birthday",
          dateTime: "",
          location: "Ice Rink",
          guests: 20
        });

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: 20}
      const response = await updateEvent("existing-id", event);

      expect(response.id).toEqual("existing-id")
      expect(response.title).toEqual("Micheal's Birthday")
    });

    it("throws an error if update fails", async () => {
      nock(baseServerURL)
        .put("/events/existing-id", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+dateTime.toISOString()+"\",\"location\":\"Ice Rink\",\"guests\":-10}")
        .reply(400, {
          guests: "must be greater than or equal to 0"
        });

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: -10}

      await expect(() => updateEvent("existing-id", event)).rejects.toEqual({"guests": "must be greater than or equal to 0"})
    });

    it('throws error if now found', async () => {
      nock(baseServerURL)
        .put("/events/not-found", "{\"title\":\"Michael Scott's Birthday\",\"dateTime\":\""+dateTime.toISOString()+"\",\"location\":\"Ice Rink\",\"guests\":30}")
        .reply(404, {});

      const event: Event = {title: "Michael Scott's Birthday", dateTime: dateTime, location: "Ice Rink", guests: 30}
      await expect(() => updateEvent("not-found", event)).rejects.toEqual({"error": "Request failed with status code 404"})
    });
  });
});