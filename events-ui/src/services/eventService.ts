import axios, {AxiosError} from "axios";

export type Event = {
  id?: string,
  title?: string,
  dateTime?: Date,
  location?: string,
  guests?: number
};

export const getEvents = (): Promise<Event[]> => {
  return axios.get<Event[]>("/events")
    .then(response => {return response.data;})
    .catch((exception: AxiosError<any>) => {
      throw {"error": exception.message}
    });
}

export const createEvent = (event: Event): Promise<Event> => {
  return axios.post("/events", event)
    .then(response => response.data)
    .catch((exception: AxiosError<any>) => {
      if (exception.response?.status === 400) {
        throw exception.response?.data;
      }
      throw {"error": exception.message}
    });
}

export const getEventById = (id: string): Promise<Event> => {
  return axios.get<Event>("/events/" + id)
    .then(response => response.data)
    .catch((exception: AxiosError<any>) => {
      throw {"error": exception.message}
    });
}

export const updateEvent = (id: string, event: Event): Promise<Event> => {
  return axios.put<Event>("/events/" + id, event)
    .then(response => response.data)
    .catch((exception: AxiosError<any>) => {
      if (exception.response?.status === 400) {
        throw exception.response?.data;
      }
      throw {"error": exception.message}
    });
}
