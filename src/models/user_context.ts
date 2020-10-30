import { nanoid } from "nanoid";
import jssha256 from "js-sha256";

type UserId = string;

export class UserContext {
  userId: UserId;
  userIdHashed: string;
  commentOrder: CommentOrder;

  constructor(userId?: UserId, commentOrder?: CommentOrder) {
    this.userId = userId || nanoid();
    this.userIdHashed = jssha256.sha256(this.userId);
    this.commentOrder = commentOrder || CommentOrder.DescendingTimeOrder;
  }

  changeCommentOrder(commentOrder: CommentOrder): void {
    this.commentOrder = commentOrder;
  }
  toJSON(): string {
    return JSON.stringify({
      userId: this.userId,
      commentOrder: this.commentOrder,
    });
  }
  static fromJSON(payload: string): UserContext {
    const data = JSON.parse(payload);
    return new UserContext(data.userId, data.commentOrder);
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
