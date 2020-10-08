import { Comment, CommentId } from "../models/comment";
import { Event, EventId } from "../models/event";
import { CommentRepository, EventRepository } from "./interface";
import jssha256 from "js-sha256";

const storage = localStorage;

export class LocalStorageEventRepository implements EventRepository {
  save(event: Event, password: string): Promise<Event> {
    const payload = storage.getItem(`event-${event.id}`);
    if (payload) {
      const password_hashed = storage.getItem(`event-${event.id}-password`);
      if (jssha256.sha256(password) == password_hashed) {
        storage.setItem(`event-${event.id}`, JSON.stringify(event));
        return Promise.resolve(event);
      } else {
        return Promise.reject();
      }
    } else {
      storage.setItem(`event-${event.id}`, JSON.stringify(event));
      storage.setItem(`event-${event.id}-password`, jssha256.sha256(password));
      return Promise.resolve(event);
    }
  }

  findById(event_id: EventId): Promise<Event> {
    const payload = storage.getItem(`event-${event_id}`);
    if (payload) {
      return Promise.resolve(Event.fromJSON(payload));
    } else {
      return Promise.reject();
    }
  }

  verifyPassword(event_id: string, password: string): Promise<boolean> {
    const password_hashed = storage.getItem(`event-${event_id}-password`);
    return Promise.resolve(jssha256.sha256(password) == password_hashed);
  }
}

export class LocalStorageCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const replace_index = comments.findIndex((c) => c.id == comment.id);
    if (replace_index < 0) {
      comments.push(comment);
    } else {
      comments[replace_index] = comment;
    }
    storage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(comment);
  }

  findAllByEventId(event_id: EventId): Promise<Comment[]> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const target_comments = comments.filter((c) => c.event_id == event_id);
    return Promise.resolve(target_comments);
  }

  saveLike(
    event_id: EventId,
    comment_id: CommentId,
    user_id_hashed: string,
    remove: boolean
  ): Promise<boolean> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const target_comment = comments.find((c) => c.id == comment_id);
    if (!target_comment) {
      return Promise.reject();
    }
    target_comment.setLike(user_id_hashed, remove);
    storage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(true);
  }
}
