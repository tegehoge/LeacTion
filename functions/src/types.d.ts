type Talk = {
  id: string;
  title: string;
  speaker_name: string;
};
export type EventRequest = {
  id: string;
  name: string;
  date_of_event: string; // YYYY-MM-DD
  talks: Talk[];
  external_url?: string;
};

export type EventRequestWithPassword = EventRequest & EventPasswordRequest;

export type EventPasswordRequest = {
  password: string;
};

export type CommentRequest = {
  id: string;
  text: string;
  user_id_hashed: string;
  posted_at: string; // ISO 8601 format
  eventId: string;
  talkId: string;
  likes: string[];
};

export type CommentResponse = CommentRequest;

export type CommentLikeRequest = {
  user_id_hashed: string;
  remove?: boolean;
};
