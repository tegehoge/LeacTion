import { nanoid } from "nanoid";

/**
 * トーク：発表枠
 */
export type Talk = {
  id: string;
  speakerName: string;
  title: string;
};

export const generateTalkId = () => nanoid();

export const createEmptyTalk = (): Talk => {
  return {
    id: generateTalkId(),
    speakerName: "",
    title: "",
  };
};

export const nonEmptyTalk = (talk: Talk) => {
  return !(talk.speakerName.length === 0 && talk.title.length === 0);
};

/**
 * イベント：開催するイベント情報
 *
 * Event型がビルトインの型として存在するため名称を変更した。
 */
export type Event = {
  id: string;
  name: string;
  date: Date;
  url?: string;
  hashTag?: string;
  talks: Talk[];
  createdBy: string; // IDのみにして、画面上はAccountを別で取得して表示名を与える方針で行きたい
  managers: string[];
  managerRequests: string[];
  createdAt?: Date;
};

export const generateEventId = () => nanoid(8);

export const createEmptyEvent = (): Event => {
  return {
    id: generateEventId(),
    name: "",
    date: new Date(),
    talks: [createEmptyTalk(), createEmptyTalk(), createEmptyTalk()],
    createdBy: "",
    managers: [],
    managerRequests: [],
  };
};

export const trimEvent = (event: Event): Event => {
  return {
    id: event.id,
    name: event.name.trim(),
    date: event.date,
    url: event.url?.trim() || undefined,
    hashTag: event.hashTag?.trim() || undefined,
    talks: event.talks
      .map((talk) => {
        return { id: talk.id, speakerName: talk.speakerName.trim(), title: talk.title.trim() };
      })
      .filter(nonEmptyTalk),
    createdBy: event.createdBy,
    managers: event.managers,
    managerRequests: event.managerRequests,
  };
};
