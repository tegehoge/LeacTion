import { FirebaseCommentRepository, FirebaseEventRepository } from "./firebase";
import { CommentRepository, EventRepository } from "./interface";
import {
  LocalStorageCommentRepository,
  LocalStorageEventRepository,
} from "./local_storage";

const event_repository: EventRepository =
  process.env.NODE_ENV == "production"
    ? new FirebaseEventRepository()
    : new LocalStorageEventRepository();

const comment_repository: CommentRepository =
  process.env.NODE_ENV == "production"
    ? new FirebaseCommentRepository()
    : new LocalStorageCommentRepository();

export const saveEvent = event_repository.save;
export const findEventById = event_repository.findById;
export const saveEventPassword = event_repository.savePassword;
export const verifyEventPassword = event_repository.verifyPassword;
export const saveComment = comment_repository.save;
export const findAllCommentByEventId = comment_repository.findAllByEventId;
export const saveCommentLike = comment_repository.saveLike;
