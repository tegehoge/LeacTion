import dayjs, { Dayjs } from "dayjs";
import { nanoid } from "nanoid";
import xssFilters from "xss-filters";

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
    this.text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

  get asHTML(): string {
    const target = this.text.replace(/ /g, "&nbsp;");
    const matches = target.matchAll(/https?:\/\/([\w-]+\.)+[\w:-]+(\/[\w ./?%&=~-]*)?/g);
    let cursor = 0;
    let result = "";
    for (const match of matches) {
      const urlForAttr = xssFilters.uriInDoubleQuotedAttr(match[0]);
      const urlForHtml = xssFilters.uriInHTMLData(match[0]);
      result += target.slice(cursor, match.index || cursor);
      result += `<a href="${urlForAttr}" class="link-text" target="_blank" rel="noopener noreferrer">${urlForHtml}</a>`;
      cursor = (match.index || cursor) + match[0].length;
    }
    result += target.slice(cursor);
    return result.replace(/\r\n|\r|\n/g, "<br />");
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
