import { FirebaseCommentRepository, FirebaseEventRepository } from "./firebase";
import { CommentRepository, EventRepository } from "./interface";
import { LocalStorageCommentRepository, LocalStorageEventRepository } from "./local_storage";
import { firestore } from "../client/firebase";

const canUseFirestore = firestore != null;

const eventRepository: EventRepository = canUseFirestore
  ? new FirebaseEventRepository()
  : new LocalStorageEventRepository();

const commentRepository: CommentRepository = canUseFirestore
  ? new FirebaseCommentRepository()
  : new LocalStorageCommentRepository();

export const saveEvent = eventRepository.save;
export const findEventById = eventRepository.findById;
export const verifyEventPassword = eventRepository.verifyPassword;
export const archiveEvent = eventRepository.archiveEvent;
export const saveComment = commentRepository.save;
export const findAllCommentByEventId = commentRepository.findAllByEventId;
export const saveCommentLike = commentRepository.saveLike;
export const deleteComment = commentRepository.delete;
