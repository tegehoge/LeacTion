import { UserContext } from "./user_context";

export class Comment {
  id: string; // UUID
  text: string;
  posted_by: string; // UUID
  posted_at: string; // datetime
  event_id: string; // UUID
  talk_id: string; // UUID

  constructor(text: string, context: UserContext) {
    this.id = "sample";
    this.text = text;
    this.posted_by = context.user_id;
    this.posted_at = "2020-10-10T19:34:58.453+0900";
    this.event_id = context.event_id;
    this.talk_id = context.talk_id;
  }

  /**
   * コメントの投稿先トークを変更する
   * @param talk_id トークID
   */
  changeTalk(talk_id: string) {
    this.talk_id = talk_id;
  }
}
