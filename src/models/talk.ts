export class Talk {
  id: string; // UUID
  title: string;
  speaker_name: string;

  constructor(title: string, speaker_name: string) {
    this.id = "sample";
    this.title = title;
    this.speaker_name = speaker_name;
  }
}
