export type TalkId = string;
import { v4 as uuidv4 } from "uuid";

export class Talk {
  id: TalkId; // UUID
  title: string;
  speakerName: string;

  constructor(title: string, speakerName: string, id?: string) {
    this.id = id || uuidv4();
    this.title = title;
    this.speakerName = speakerName;
  }

  isEmpty(): boolean {
    return this.title == "" && this.speakerName == "";
  }

  static fromObj(obj: TalkResponse): Talk {
    return new Talk(obj.title, obj.speakerName, obj.id);
  }
}

export type TalkResponse = {
  id: string;
  title: string;
  speakerName: string;
};

export const emptyTalk = (): Talk => new Talk("", "");
