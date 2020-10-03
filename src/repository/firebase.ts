import { Event, EventId } from "../models/event";
import { Comment } from "../models/comment";
import { CommentRepository, EventRepository } from "./interface";

export class FirebaseEventRepository implements EventRepository {
  save(event: Event): Promise<Event> {
    return Promise.reject("Not yet implemented");
  }

  findById(event_id: EventId): Promise<Event> {
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
}
