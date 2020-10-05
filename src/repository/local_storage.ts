import { Comment, CommentId } from "../models/comment";
import { Event, EventId } from "../models/event";
import { CommentRepository, EventRepository } from "./interface";
import jssha256 from "js-sha256";

export class LocalStorageEventRepository implements EventRepository {
  save(event: Event): Promise<Event> {
    localStorage.setItem(`event-${event.id}`, JSON.stringify(event));
    return Promise.resolve(event);
  }

  findById(event_id: EventId): Promise<Event> {
    const payload = localStorage.getItem(`event-${event_id}`);
    if (payload) {
      return Promise.resolve(Event.fromJSON(payload));
    } else {
      return Promise.reject();
    }
  }

  savePassword(event_id: string, password: string): Promise<boolean> {
    localStorage.setItem(
      `event-${event_id}-password`,
      jssha256.sha256(password)
    );
    return Promise.resolve(true);
  }
  verifyPassword(event_id: string, password: string): Promise<boolean> {
    const password_hashed = localStorage.getItem(`event-${event_id}-password`);
    return Promise.resolve(jssha256.sha256(password) == password_hashed);
  }
}

export class LocalStorageCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    const comments = Comment.fromJSONArray(
      localStorage.getItem("comments") || "[]"
    );
    const replace_index = comments.findIndex((c) => c.id == comment.id);
    if (replace_index < 0) {
      comments.push(comment);
    } else {
      comments[replace_index] = comment;
    }
    localStorage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(comment);
  }

  findAllByEventId(event_id: EventId): Promise<Comment[]> {
    const comments = Comment.fromJSONArray(
      localStorage.getItem("comments") || "[]"
    );
    const target_comments = comments.filter((c) => c.event_id == event_id);
    return Promise.resolve(target_comments);
  }

  saveLike(
    comment_id: CommentId,
    user_id_hashed: string,
    like: boolean
  ): Promise<boolean> {
    const comments = Comment.fromJSONArray(
      localStorage.getItem("comments") || "[]"
    );
    const target_comment = comments.find((c) => c.id == comment_id);
    if (!target_comment) {
      return Promise.reject();
    }
    target_comment.setLike(user_id_hashed, like);
    localStorage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(true);
  }
}