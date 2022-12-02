import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from './App';
import {getEvents} from "./services/eventService";
import userEvent from "@testing-library/user-event";

jest.mock("./services/eventService");

const mockedGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

describe("App", () => {
  it("has a new event button", async () => {
    mockedGetEvents.mockResolvedValue([])
    render(<App/>);
    expect(screen.getByText("New Event")).toBeInTheDocument()
  })

  it("has a event list table", async () => {
    mockedGetEvents.mockResolvedValue([])
    render(<App/>);
    expect(screen.getByRole("table")).toBeInTheDocument()
  })

  it("shows an error if api fails", async () => {
    mockedGetEvents.mockRejectedValue({error: "Network Error"})
    render(<App/>);
    await waitFor(() => {
      expect(screen.getByText(/Network Error/)).toBeInTheDocument();
    });
  })

  describe("New Event", () => {
    it("show the create event dialog", async () => {
      mockedGetEvents.mockResolvedValue([])
      render(<App/>);
      const button = screen.getByText("New Event")
      await userEvent.click(button);

      expect(screen.getByText(/Create Event/)).toBeInTheDocument();
    })
  })
})