import {CreateEventDialog} from "./CreateEventDialog";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {createEvent,} from "../services/eventService";

jest.mock("../services/eventService");

const mockCreateEvent = createEvent as jest.MockedFunction<typeof createEvent>;

describe("CreateEventDialog", () => {
  it("has required fields", async () => {
    const setOpen = jest.fn();
    render(<CreateEventDialog open setOpen={setOpen}/>);

    expect(await screen.findByLabelText("Title")).toBeInTheDocument();
    expect(await screen.findByLabelText("Date")).toBeInTheDocument();
    expect(await screen.findByLabelText("Location")).toBeInTheDocument();
    expect(await screen.findByLabelText("Guests")).toBeInTheDocument();
    expect(await screen.findByText("Cancel")).toBeInTheDocument();
    expect(await screen.findByText("Create")).toBeInTheDocument();
  })

  describe("Cancel Button", () => {
    it("Closes Create Dialog", () => {
      const setOpen = jest.fn();
      render(<CreateEventDialog open setOpen={setOpen}/>);

      userEvent.click(screen.getByText("Cancel"));
      expect(setOpen).toHaveBeenCalledWith(false);
    })
  })

  describe("Create Button", () => {
    it("Calls create event and closes dialog when successful", async () => {
      const setOpen = jest.fn();
      render(<CreateEventDialog open setOpen={setOpen}/>);
      mockCreateEvent.mockResolvedValue({});

      userEvent.type(await screen.findByLabelText("Title"), "event-1")
      userEvent.type(await screen.findByLabelText("Location"), "room 1")
      userEvent.type(await screen.findByLabelText("Guests"), "1")

      userEvent.click(screen.getByText("Create"));
      expect(mockCreateEvent).toHaveBeenCalledWith({title: "event-1", location: "room 1", guests: "1"})
      await waitFor(() => expect(setOpen).toHaveBeenCalledWith(false))
    })

    it("Calls create event and shows error if fails", async () => {
      const setOpen = jest.fn();
      render(<CreateEventDialog open setOpen={setOpen}/>);
      mockCreateEvent.mockRejectedValue({
        title: "title-error",
        dateTime: "date-error",
        location: "location-error",
        guests: "guests-error"
      });
      userEvent.click(screen.getByText("Create"));
      expect(mockCreateEvent).toHaveBeenCalled();

      await waitFor(() => expect(screen.queryByText(/title-error/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/date-error/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/location-error/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/guests-error/i)).toBeInTheDocument());
    })

    it("Calls create shows global error", async () => {
      const setOpen = jest.fn();
      render(<CreateEventDialog open setOpen={setOpen}/>);
      mockCreateEvent.mockRejectedValue({error: "global-error"});
      userEvent.click(screen.getByText("Create"));
      expect(mockCreateEvent).toHaveBeenCalled();

      await waitFor(() => expect(screen.queryByText(/global-error/i)).toBeInTheDocument());
    })
  })
})