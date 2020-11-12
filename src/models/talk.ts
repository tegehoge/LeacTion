import { nanoid } from "nanoid";

export type TalkId = string;

export class Talk {
  id: TalkId;
  title: string;
  speakerName: string;

  constructor(title: string, speakerName: string, id?: string) {
    this.id = id || nanoid();
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
