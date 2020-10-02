import dayjs, { Dayjs } from "dayjs";
import { Talk } from "./talk";
import { v4 as uuidv4 } from "uuid";

export type EventId = string;

export class Event {
  id: EventId; // UUID
  name: string;
  date_of_event: Dayjs; // date
  created_by: string; // UUID
  talks: Array<Talk>;
  external_url?: string; // URL

  constructor(name: string, date_of_event: Dayjs, user_id: string) {
    this.id = uuidv4();
    this.name = name;
    this.date_of_event = date_of_event;
    this.created_by = user_id;
    this.talks = [];
  }

  setExternalUrl(url: string) {
    this.external_url = url;
  }

  removeExternalUrl() {
    this.external_url = undefined;
  }
}
