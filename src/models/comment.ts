import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

export type CommentId = string;
export class Comment {
  id: CommentId; // UUID
  text: string;
  user_id_hashed: string; // FIXME: user_id のハッシュ値を入れる(なりすまし防止)
  posted_at: Dayjs; // datetime
  eventId: string; // UUID
  talkId: string; // UUID
  likes: string[];

  constructor(
    text: string,
    user_id_hashed: string,
    eventId: string,
    talkId: string,
    id?: string,
    posted_at?: Dayjs,
    likes?: string[]
  ) {
    this.id = id || uuidv4();
    this.text = text;
    this.user_id_hashed = user_id_hashed;
    this.posted_at = posted_at || dayjs();
    this.eventId = eventId;
    this.talkId = talkId;
    this.likes = likes || [];
  }

  /**
   * コメントの投稿先トークを変更する
   * @param talkId トークID
   */
  changeTalk(talkId: string): void {
    this.talkId = talkId;
  }

  static fromJSON(payload: string): Comment {
    const data = JSON.parse(payload) as CommentResponse;
    return new Comment(
      data.text,
      data.user_id_hashed,
      data.eventId,
      data.talkId,
      data.id,
      dayjs(data.posted_at),
      data.likes
    );
  }

  static fromJSONArray(payload: string): Comment[] {
    const data = JSON.parse(payload) as CommentResponse[];
    return data.map(
      (c) =>
        new Comment(
          c.text,
          c.user_id_hashed,
          c.eventId,
          c.talkId,
          c.id,
          dayjs(c.posted_at),
          c.likes
        )
    );
  }

  static fromObj(obj: CommentResponse): Comment {
    return new Comment(
      obj.text,
      obj.user_id_hashed,
      obj.eventId,
      obj.talkId,
      obj.id,
      dayjs(obj.posted_at),
      obj.likes
    );
  }

  isLikedBy(user_id_hashed: string): boolean {
    return this.likes.includes(user_id_hashed);
  }

  setLike(user_id_hashed: string, remove: boolean): void {
    if (!remove && !this.likes.includes(user_id_hashed)) {
      this.likes.push(user_id_hashed);
    } else if (remove && this.likes.includes(user_id_hashed)) {
      this.likes = this.likes.filter((u) => u != user_id_hashed);
    }
  }
}

export type CommentResponse = {
  id: string; // UUID
  text: string;
  user_id_hashed: string; // UUID
  posted_at: string; // datetime
  eventId: string; // UUID
  talkId: string; // UUID
  likes: string[];
};
