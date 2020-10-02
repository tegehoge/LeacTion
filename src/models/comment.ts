import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

export class Comment {
  id: string; // UUID
  text: string;
  posted_by: string; // UUID
  posted_at: Dayjs; // datetime
  event_id: string; // UUID
  talk_id: string; // UUID

  constructor(
    text: string,
    user_id: string,
    event_id: string,
    talk_id: string
  ) {
    this.id = uuidv4();
    this.text = text;
    this.posted_by = user_id;
    this.posted_at = dayjs();
    this.event_id = event_id;
    this.talk_id = talk_id;
  }

  /**
   * コメントの投稿先トークを変更する
   * @param talk_id トークID
   */
  changeTalk(talk_id: string) {
    this.talk_id = talk_id;
  }
}
