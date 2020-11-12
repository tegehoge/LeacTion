import dayjs, { Dayjs } from "dayjs";
import { nanoid } from "nanoid";

export type CommentId = string;
export class Comment {
  id: CommentId;
  text: string;
  userIdHashed: string; // userId のハッシュ値を入れる(なりすまし防止)
  postedAt: Dayjs; // datetime
  eventId: string;
  talkId: string;
  likes: string[];

  constructor(
    text: string,
    userIdHashed: string,
    eventId: string,
    talkId: string,
    id?: string,
    postedAt?: Dayjs,
    likes?: string[]
  ) {
    this.id = id || nanoid();
    this.text = text;
    this.userIdHashed = userIdHashed;
    this.postedAt = postedAt || dayjs();
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
      data.userIdHashed,
      data.eventId,
      data.talkId,
      data.id,
      dayjs(data.postedAt),
      data.likes
    );
  }

  static fromJSONArray(payload: string): Comment[] {
    const data = JSON.parse(payload) as CommentResponse[];
    return data.map(
      (c) =>
        new Comment(c.text, c.userIdHashed, c.eventId, c.talkId, c.id, dayjs(c.postedAt), c.likes)
    );
  }

  static fromObj(obj: CommentResponse): Comment {
    return new Comment(
      obj.text,
      obj.userIdHashed,
      obj.eventId,
      obj.talkId,
      obj.id,
      dayjs(obj.postedAt),
      obj.likes
    );
  }

  isLikedBy(userIdHashed: string): boolean {
    return this.likes.includes(userIdHashed);
  }

  setLike(userIdHashed: string, remove: boolean): void {
    if (!remove && !this.likes.includes(userIdHashed)) {
      this.likes.push(userIdHashed);
    } else if (remove && this.likes.includes(userIdHashed)) {
      this.likes = this.likes.filter((u) => u != userIdHashed);
    }
  }
}

export type CommentResponse = {
  id: string;
  text: string;
  userIdHashed: string;
  postedAt: string; // datetime
  eventId: string;
  talkId: string;
  likes: string[];
};
