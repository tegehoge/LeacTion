import { Talk, TalkResponse } from "./talk";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export type EventId = string;

export class Event {
  id: EventId; // UUID
  name: string;
  dateOfEvent: string; // date
  talks: Talk[];
  externalUrl?: string; // URL

  constructor(
    name: string,
    dateOfEvent: string,
    id?: EventId,
    talks?: Talk[],
    externalUrl?: string
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.dateOfEvent = dateOfEvent;
    this.talks = talks || [];
    this.externalUrl = externalUrl;
  }

  setExternalUrl(url: string): void {
    this.externalUrl = url;
  }

  removeExternalUrl(): void {
    this.externalUrl = undefined;
  }

  static fromJSON(payload: string): Event {
    const data = JSON.parse(payload) as EventResponse;
    return new Event(data.name, data.dateOfEvent, data.id, data.talks as Talk[], data.externalUrl);
  }

  static fromObj(obj: EventResponse): Event {
    return new Event(
      obj.name,
      obj.dateOfEvent,
      obj.id,
      obj.talks.map((talk) => Talk.fromObj(talk)),
      obj.externalUrl
    );
  }

  isValid(): boolean {
    return this.name.length > 0 && this.talks.some((talk) => !talk.isEmpty());
  }

  isValidFuture(): boolean {
    return this.isValid() && dayjs(this.dateOfEvent) >= dayjs().startOf("day");
  }
}

type EventResponse = {
  id: string; // UUID
  name: string;
  dateOfEvent: string; // date
  talks: TalkResponse[];
  externalUrl?: string; // URL
};

export const emptyEvent = (): Event => new Event("", dayjs().format("YYYY-MM-DD"));
