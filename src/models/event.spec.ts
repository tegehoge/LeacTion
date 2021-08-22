import { Event } from "./event";
import { nanoid } from "nanoid";
import { Talk } from "./talk";

test("Successful JSON conversion", () => {
  const event = new Event(
    "sample",
    "2021-05-01",
    nanoid(8),
    [new Talk("aaa", "bbb", nanoid())],
    "https://example.com",
    "hashtag",
    true
  );
  const eventString = JSON.stringify(event);
  const result = Event.fromJSON(eventString);

  expect(result).toStrictEqual(event);
});

test("Create from Obj", () => {
  const eventId = nanoid(8);
  const eventObj = {
    id: eventId,
    name: "tegehoge",
    dateOfEvent: "2021-12-31",
    talks: [{ id: nanoid(), title: "てげほげ", speakerName: "てげほげ" }],
    externalUrl: "https://tege.work/",
    hashtag: "tegehoge",
    isArchived: false,
  };
  const event = Event.fromObj(eventObj);
  expect(event.id).toStrictEqual(eventId);
  expect(event.hashtag).toStrictEqual("tegehoge");
});
