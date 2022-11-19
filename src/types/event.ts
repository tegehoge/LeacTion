import type { Talk, TalkResponse } from "~/types/talk";

export type EventId = string;

export type Event = {
  id: EventId;
  name: string;
  dateOfEvent: string; // date
  talks: Talk[];
  externalUrl?: string; // URL
  hashtag?: string;
};

export type EventResponse = {
  id: string;
  name: string;
  dateOfEvent: string;
  talks: TalkResponse[];
  externalUrl?: string;
  hashtag?: string;
  isArchived: boolean;
};
