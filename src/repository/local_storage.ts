import { Comment } from "../models/comment";
import { Event, EventId } from "../models/event";
import { CommentRepository, EventRepository } from "./interface";

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
}

export class LocalStorageCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    const comments = Comment.fromJSONArray(
      localStorage.getItem("comments") || "[]"
    );
    comments.push(comment);
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
}
