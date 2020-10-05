import { Comment, CommentId } from "../models/comment";
import { Event, EventId } from "../models/event";

export interface EventRepository {
  save(event: Event): Promise<Event>;
  findById(event_id: EventId): Promise<Event>;
  savePassword(event_id: string, password: string): Promise<boolean>;
  verifyPassword(event_id: string, password: string): Promise<boolean>;
}

export interface CommentRepository {
  save(comment: Comment): Promise<Comment>;
  findAllByEventId(event_id: EventId): Promise<Comment[]>;
  saveLike(
    comment_id: CommentId,
    user_id_hashed: string,
    like: boolean
  ): Promise<boolean>;
}
