export type Comment = {
  id: string;
  content: string;
  postedBy: string; // account ID
  postedAt: Date;
  eventId: string;
  talkId: string;
  likedBy: string[]; // list of account ID
};
