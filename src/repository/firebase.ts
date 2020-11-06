import axios from "axios";

import { Event, EventId } from "../models/event";
import { Comment, CommentId, CommentResponse } from "../models/comment";
import { CommentRepository, EventRepository } from "./interface";

export class FirebaseEventRepository implements EventRepository {
  save(event: Event, password: string): Promise<Event> {
    const data = Object.assign({}, event, { password });

    return axios.post("/api/event/", data).then(() => {
      return event;
    });
  }

  findById(eventId: EventId): Promise<Event> {
    return axios.get(`/api/event/${eventId}`).then((res) => {
      return Event.fromObj(res.data);
    });
  }

  verifyPassword(eventId: string, password: string): Promise<boolean> {
    return axios.post(`/api/event/${eventId}/verify`, { password }).then((res) => {
      return res.status == 200;
    });
  }
}

export class FirebaseCommentRepository implements CommentRepository {
  save(comment: Comment): Promise<Comment> {
    return axios.post(`/api/event/${comment.eventId}/comment`, comment).then(() => {
      return comment;
    });
  }

  findAllByEventId(eventId: EventId): Promise<Comment[]> {
    return axios.get(`/api/event/${eventId}/comments`).then((res) => {
      const data = res.data as CommentResponse[];
      return data.map((c) => Comment.fromObj(c));
    });
  }
  saveLike(
    eventId: EventId,
    commentId: CommentId,
    userIdHashed: string,
    remove: boolean
  ): Promise<boolean> {
    const data = { userIdHashed, remove };
    return axios.post(`/api/event/${eventId}/comment/${commentId}/like`, data).then((res) => {
      return res.status == 201;
    });
  }

  delete(eventId: string, commentId: string, userId: string): Promise<boolean> {
    return axios.post(`/api/event/${eventId}/comment/${commentId}/delete`, { userId }).then((res) => {
      return res.status == 200;
    });
  }
}
