import { Event, EventId } from "../models/event";
import { Comment, CommentId } from "../models/comment";
import { CommentRepository, EventRepository } from "./interface";

export class FirebaseEventRepository implements EventRepository {
  save(event: Event, password: string): Promise<Event> {
    return Promise.reject("Not yet implemented");
  }

  findById(event_id: EventId): Promise<Event> {
    return Promise.reject("Not yet implemented");
  }

  verifyPassword(event_id: string, password: string): Promise<boolean> {
    return Promise.reject("Not yet implemented");
  }
}

export class FirebaseCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    return Promise.reject("Not yet implemented");
  }

  findAllByEventId(event_id: EventId): Promise<Comment[]> {
    return Promise.reject("Not yet implemented");
  }
  saveLike(
    comment_id: CommentId,
    user_id_hashed: string,
    remove: boolean
  ): Promise<boolean> {
    return Promise.reject("Not yet implemented");
  }
}
