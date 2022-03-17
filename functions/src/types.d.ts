type Talk = {
  id: string;
  title: string;
  speakerName: string;
};
export type Event = {
  id: string;
  name: string;
  dateOfEvent: string; // YYYY-MM-DD
  talks: Talk[];
  externalUrl?: string;
  hashtag?: string;
  isArchived?: boolean;
};

export type EventRequest = Event;

export type EventRequestWithPassword = EventRequest & EventPasswordRequest;

export type EventPasswordRequest = {
  password: string;
};

export type Comment = {
  id: string;
  text: string;
  userIdHashed: string;
  postedAt: string; // ISO 8601 format
  eventId: string;
  talkId: string;
  likes: string[];
};

export type CommentRequest = Comment;
export type CommentResponse = Comment;

export type CommentLikeRequest = {
  userIdHashed: string;
  remove?: boolean;
};

export type CommentDeleteRequest = {
  userId: string;
};

export type Comments = Comment[];
