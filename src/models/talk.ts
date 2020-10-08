export type TalkId = string;
import { v4 as uuidv4 } from "uuid";

export class Talk {
  id: TalkId; // UUID
  title: string;
  speaker_name: string;

  constructor(title: string, speaker_name: string, id?: string) {
    this.id = id || uuidv4();
    this.title = title;
    this.speaker_name = speaker_name;
  }

  isEmpty() {
    return this.title == "" && this.speaker_name == "";
  }

  static fromObj(obj: TalkResponse): Talk {
    return new Talk(obj.title, obj.speaker_name, obj.id);
  }
}

export type TalkResponse = {
  id: string;
  title: string;
  speaker_name: string;
};

export const emptyTalk = () => new Talk("", "");
