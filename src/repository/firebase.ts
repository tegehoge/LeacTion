import axios from "axios";

import type { Event } from "~/types/event";

export class FirebaseEventRepository {
  save(event: Event, password: string): Promise<Event> {
    const data = Object.assign({}, event, { password });

    return axios.post("/api/event/", data).then(() => {
      return event;
    });
  }
}
