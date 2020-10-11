import { Talk, TalkResponse } from "./talk";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export type EventId = string;

export class Event {
  id: EventId; // UUID
  name: string;
  date_of_event: string; // date
  talks: Talk[];
  external_url?: string; // URL

  constructor(
    name: string,
    date_of_event: string,
    id?: EventId,
    talks?: Talk[],
    external_url?: string
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.date_of_event = date_of_event;
    this.talks = talks || [];
    this.external_url = external_url;
  }

  setExternalUrl(url: string): void {
    this.external_url = url;
  }

  removeExternalUrl(): void {
    this.external_url = undefined;
  }

  static fromJSON(payload: string): Event {
    const data = JSON.parse(payload) as EventResponse;
    return new Event(
      data.name,
      data.date_of_event,
      data.id,
      data.talks as Talk[],
      data.external_url
    );
  }

  static fromObj(obj: EventResponse): Event {
    return new Event(
      obj.name,
      obj.date_of_event,
      obj.id,
      obj.talks.map((talk) => Talk.fromObj(talk)),
      obj.external_url
    );
  }

  isValid(): boolean {
    return this.name.length > 0 && this.talks.some((talk) => !talk.isEmpty());
  }

  isValidFuture(): boolean {
    return this.isValid() && dayjs(this.date_of_event) >= dayjs().startOf("day");
  }
}

type EventResponse = {
  id: string; // UUID
  name: string;
  date_of_event: string; // date
  talks: TalkResponse[];
  external_url?: string; // URL
};

export const emptyEvent = (): Event => new Event("", dayjs().format("YYYY-MM-DD"));
