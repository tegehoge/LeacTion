type Talk = {
  id: string;
  title: string;
  speakerName: string;
};
export type EventRequest = {
  id: string;
  name: string;
  dateOfEvent: string; // YYYY-MM-DD
  talks: Talk[];
  externalUrl?: string;
};

export type EventRequestWithPassword = EventRequest & EventPasswordRequest;

export type EventPasswordRequest = {
  password: string;
};

export type CommentRequest = {
  id: string;
  text: string;
  userIdHashed: string;
  postedAt: string; // ISO 8601 format
  eventId: string;
  talkId: string;
  likes: string[];
};

export type CommentResponse = CommentRequest;

export type CommentLikeRequest = {
  userIdHashed: string;
  remove?: boolean;
};

export type CommentDeleteRequest = {
  userId: string;
};
