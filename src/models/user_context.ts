import { v4 as uuidv4 } from "uuid";
import jssha256 from "js-sha256";

type UserId = string;

export class UserContext {
  user_id: UserId;
  user_id_hashed: string;
  comment_order: CommentOrder;

  constructor(user_id?: UserId, comment_order?: CommentOrder) {
    this.user_id = user_id || uuidv4();
    this.user_id_hashed = jssha256.sha256(this.user_id);
    this.comment_order = comment_order || CommentOrder.DescendingTimeOrder;
  }

  changeCommentOrder(comment_order: CommentOrder) {
    this.comment_order = comment_order;
  }
  toJSON(): string {
    return JSON.stringify({
      user_id: this.user_id,
      comment_order: this.comment_order,
    });
  }
  static fromJSON(payload: string): UserContext {
    const data = JSON.parse(payload);
    return new UserContext(data.user_id, data.comment_order);
  }
}

/**
 * コメント表示順指定
 */
const CommentOrder = {
  DescendingTimeOrder: "DescendingTimeOrder",
  AscendingTimeOrder: "AscendingTimeOrder",
  DescendingLikeOrder: "DescendingLikeOrder",
  AscendingLikeOrder: "AscendingLikeOrder",
} as const;

type CommentOrder = typeof CommentOrder[keyof typeof CommentOrder];
