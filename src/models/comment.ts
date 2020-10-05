import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";

export type CommentId = string;
export class Comment {
  id: CommentId; // UUID
  text: string;
  user_id_hashed: string; // FIXME: user_id のハッシュ値を入れる(なりすまし防止)
  posted_at: Dayjs; // datetime
  event_id: string; // UUID
  talk_id: string; // UUID
  likes: string[];

  constructor(
    text: string,
    user_id_hashed: string,
    event_id: string,
    talk_id: string,
    id?: string,
    posted_at?: Dayjs,
    likes?: string[]
  ) {
    this.id = id || uuidv4();
    this.text = text;
    this.user_id_hashed = user_id_hashed;
    this.posted_at = posted_at || dayjs();
    this.event_id = event_id;
    this.talk_id = talk_id;
    this.likes = likes || [];
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
      data.user_id_hashed,
      data.event_id,
      data.talk_id,
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
          c.event_id,
          c.talk_id,
          c.id,
          dayjs(c.posted_at),
          c.likes
        )
    );
  }

  isLikedBy(user_id_hashed: string): boolean {
    return this.likes.includes(user_id_hashed);
  }

  setLike(user_id_hashed: string, like: boolean): void {
    if (like && !this.likes.includes(user_id_hashed)) {
      this.likes.push(user_id_hashed);
    } else if (!like && this.likes.includes(user_id_hashed)) {
      this.likes = this.likes.filter((u) => u != user_id_hashed);
    }
  }
}

type CommentResponse = {
  id: string; // UUID
  text: string;
  user_id_hashed: string; // UUID
  posted_at: string; // datetime
  event_id: string; // UUID
  talk_id: string; // UUID
  likes: string[];
};
