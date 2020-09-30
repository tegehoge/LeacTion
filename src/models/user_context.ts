export class UserContext {
  user_id: string;
  event_id: string | null;
  talk_id: string | null;

  constructor(event_id: string | null = null, talk_id: string | null = null) {
    this.user_id = "sample";
    this.event_id = event_id;
    this.talk_id = talk_id;
  }

  changeTalk(talk_id: string): void {
    this.talk_id = talk_id;
  }
}
