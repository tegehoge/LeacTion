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
    talk_id: string,
    id?: string,
    posted_at?: Dayjs
  ) {
    this.id = id || uuidv4();
    this.text = text;
    this.posted_by = user_id;
    this.posted_at = posted_at || dayjs();
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

  static fromJSON(payload: string): Comment {
    const data = JSON.parse(payload) as CommentResponse;
    return new Comment(
      data.text,
      data.posted_by,
      data.event_id,
      data.talk_id,
      data.id,
      dayjs(data.posted_at)
    );
  }

  static fromJSONArray(payload: string): Comment[] {
    const data = JSON.parse(payload) as CommentResponse[];
    return data.map(
      (c) =>
        new Comment(
          c.text,
          c.posted_by,
          c.event_id,
          c.talk_id,
          c.id,
          dayjs(c.posted_at)
        )
    );
  }
}

type CommentResponse = {
  id: string; // UUID
  text: string;
  posted_by: string; // UUID
  posted_at: string; // datetime
  event_id: string; // UUID
  talk_id: string; // UUID
};
