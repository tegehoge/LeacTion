import { FirebaseCommentRepository, FirebaseEventRepository } from "./firebase";
import { CommentRepository, EventRepository } from "./interface";
import { LocalStorageCommentRepository, LocalStorageEventRepository } from "./local_storage";

const isProduction = import.meta.env.PROD;

const eventRepository: EventRepository = isProduction
  ? new FirebaseEventRepository()
  : new LocalStorageEventRepository();

const commentRepository: CommentRepository = isProduction
  ? new FirebaseCommentRepository()
  : new LocalStorageCommentRepository();

export const saveEvent = eventRepository.save;
export const findEventById = eventRepository.findById;
export const verifyEventPassword = eventRepository.verifyPassword;
export const saveComment = commentRepository.save;
export const findAllCommentByEventId = commentRepository.findAllByEventId;
export const saveCommentLike = commentRepository.saveLike;
export const deleteComment = commentRepository.delete;
