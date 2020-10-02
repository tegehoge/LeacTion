export type TalkId = string;
import { v4 as uuidv4 } from "uuid";

export class Talk {
  id: TalkId; // UUID
  title: string;
  speaker_name: string;

  constructor(title: string, speaker_name: string) {
    this.id = uuidv4();
    this.title = title;
    this.speaker_name = speaker_name;
  }
}
