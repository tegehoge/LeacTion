import { emptyTalk, Talk, TalkResponse } from "./talk";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export type EventId = string;

export class Event {
  id: EventId;
  name: string;
  dateOfEvent: string; // date
  talks: Talk[];
  externalUrl?: string; // URL
  hashtag?: string;

  constructor(
    name: string,
    dateOfEvent: string,
    id?: EventId,
    talks?: Talk[],
    externalUrl?: string,
    hashtag?: string
  ) {
    this.id = id || nanoid(8);
    this.name = name;
    this.dateOfEvent = dateOfEvent;
    this.talks = talks || [];
    this.externalUrl = externalUrl;
    this.hashtag = hashtag;
  }

  setExternalUrl(url: string): void {
    this.externalUrl = url;
  }

  removeExternalUrl(): void {
    this.externalUrl = undefined;
  }

  insertEmptyTalkAt(index?: number) {
    if (index === undefined) {
      this.talks.push(emptyTalk());
    } else {
      this.talks.splice(index, 0, emptyTalk());
    }
  }

  static fromJSON(payload: string): Event {
    const data = JSON.parse(payload) as EventResponse;
    return new Event(
      data.name,
      data.dateOfEvent,
      data.id,
      data.talks.map((talk) => Talk.fromObj(talk)),
      data.externalUrl,
      data.hashtag
    );
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

export type EventResponse = {
  id: string;
  name: string;
  dateOfEvent: string; // date
  talks: TalkResponse[];
  externalUrl?: string; // URL
  hashtag?: string;
};

export const emptyEvent = (): Event => new Event("", dayjs().format("YYYY-MM-DD"));
