import dayjs, { Dayjs } from "dayjs";
import { Talk, TalkResponse } from "./talk";
import { v4 as uuidv4 } from "uuid";

export type EventId = string;

export class Event {
  id: EventId; // UUID
  name: string;
  date_of_event: Dayjs; // date
  created_by: string; // UUID
  talks: Talk[];
  external_url?: string; // URL

  constructor(
    name: string,
    date_of_event: Dayjs,
    user_id: string,
    id?: EventId,
    talks?: Talk[]
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.date_of_event = date_of_event;
    this.created_by = user_id;
    this.talks = talks || [];
  }

  setExternalUrl(url: string) {
    this.external_url = url;
  }

  removeExternalUrl() {
    this.external_url = undefined;
  }

  static fromJSON(payload: string): Event {
    const data = JSON.parse(payload) as EventResponse;
    return new Event(
      data.name,
      dayjs(data.date_of_event),
      data.created_by,
      data.id,
      data.talks as Talk[]
    );
  }
}

type EventResponse = {
  id: string; // UUID
  name: string;
  date_of_event: string; // date
  created_by: string; // UUID
  talks: TalkResponse[];
  external_url?: string; // URL
};
