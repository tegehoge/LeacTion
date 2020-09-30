import { Talk } from "./talk";
import { UserContext } from "./user_context";

export class Event {
  id: string; // UUID
  name: string;
  date_of_event: string; // date
  created_by: string; // UUID
  talks: Array<Talk>;
  external_url?: string; // URL

  constructor(name: string, date_of_event: string, context: UserContext) {
    this.id = "sample";
    this.name = name;
    this.date_of_event = date_of_event;
    this.created_by = context.user_id;
    this.talks = [];
  }

  setExternalUrl(url: string) {
    this.external_url = url;
  }

  removeExternalUrl() {
    this.external_url = undefined;
  }
}
