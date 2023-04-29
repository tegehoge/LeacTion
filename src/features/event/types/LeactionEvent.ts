import { nanoid } from "nanoid";
import { Account } from "~/features/account/types/Account";

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

/**
 * イベント：開催するイベント情報
 *
 * Event型がビルトインの型として存在するため名称を変更した。
 */
export type LeactionEvent = {
  id: string;
  name: string;
  date: Date;
  url?: string;
  hashTag?: string;
  talks: Talk[];
  administrator: string; // IDのみにして、画面上はAccountを別で取得して表示名を与える方針で行きたい
  collaborators: string[];
  createdAt?: Date;
};

export const generateEventId = () => nanoid(8);

export const createEmptyEvent = (): LeactionEvent => {
  return {
    id: generateEventId(),
    name: "",
    date: new Date(),
    talks: [createEmptyTalk(), createEmptyTalk(), createEmptyTalk()],
    administrator: "",
    collaborators: [],
  };
};
