import { Comment, CommentId } from "../models/comment";
import { Event, EventId } from "../models/event";
import { CommentRepository, EventRepository } from "./interface";
import jssha256 from "js-sha256";

const storage = localStorage;

export class LocalStorageEventRepository implements EventRepository {
  save(event: Event, password: string): Promise<Event> {
    const payload = storage.getItem(`event-${event.id}`);
    if (payload) {
      const passwordHashed = storage.getItem(`event-${event.id}-password`);
      if (jssha256.sha256(password) == passwordHashed) {
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

  findById(eventId: EventId): Promise<Event> {
    const payload = storage.getItem(`event-${eventId}`);
    if (payload) {
      return Promise.resolve(Event.fromJSON(payload));
    } else {
      return Promise.reject();
    }
  }

  verifyPassword(eventId: string, password: string): Promise<boolean> {
    const passwordHashed = storage.getItem(`event-${eventId}-password`);
    return Promise.resolve(jssha256.sha256(password) == passwordHashed);
  }
}

export class LocalStorageCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const replaceIndex = comments.findIndex((c) => c.id == comment.id);
    if (replaceIndex < 0) {
      comments.push(comment);
    } else {
      comments[replaceIndex] = comment;
    }
    storage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(comment);
  }

  findAllByEventId(eventId: EventId): Promise<Comment[]> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const targetComments = comments.filter((c) => c.eventId == eventId);
    return Promise.resolve(targetComments);
  }

  saveLike(
    eventId: EventId,
    commentId: CommentId,
    userIdHashed: string,
    remove: boolean
  ): Promise<boolean> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const targetComment = comments.find((c) => c.id == commentId);
    if (!targetComment) {
      return Promise.reject();
    }
    targetComment.setLike(userIdHashed, remove);
    storage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(true);
  }

  delete(eventId: string, commentId: string, userId: string): Promise<boolean> {
    const comments = Comment.fromJSONArray(storage.getItem("comments") || "[]");
    const replaceIndex = comments.findIndex((c) => c.id == commentId);
    if (replaceIndex >= 0 && comments[replaceIndex].userIdHashed === jssha256.sha256(userId)) {
      comments.splice(replaceIndex, 1);
    }
    storage.setItem(`comments`, JSON.stringify(comments));
    return Promise.resolve(true);
  }
}
