import { FirebaseCommentRepository, FirebaseEventRepository } from "./firebase";
import { CommentRepository, EventRepository } from "./interface";
import { LocalStorageCommentRepository, LocalStorageEventRepository } from "./local_storage";

const eventRepository: EventRepository =
  process.env.NODE_ENV == "production"
    ? new FirebaseEventRepository()
    : new LocalStorageEventRepository();

const commentRepository: CommentRepository =
  process.env.NODE_ENV == "production"
    ? new FirebaseCommentRepository()
    : new LocalStorageCommentRepository();

export const saveEvent = eventRepository.save;
export const findEventById = eventRepository.findById;
export const verifyEventPassword = eventRepository.verifyPassword;
export const saveComment = commentRepository.save;
export const findAllCommentByEventId = commentRepository.findAllByEventId;
export const saveCommentLike = commentRepository.saveLike;
