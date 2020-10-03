import { Comment } from "../models/comment";
import { Event, EventId } from "../models/event";

export interface EventRepository {
  save(event: Event): Promise<Event>;

  findById(event_id: EventId): Promise<Event>;
}

export interface CommentRepository {
  save(comment: Comment): Promise<Comment>;

  findAllByEventId(event_id: EventId): Promise<Comment[]>;
}
