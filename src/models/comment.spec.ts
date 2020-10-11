import { Comment } from "./comment";
import { v4 as uuidv4 } from "uuid";

test("Successful JSON conversion", () => {
  const comment = new Comment("新しいコメント", uuidv4(), uuidv4(), uuidv4());

  const commentString = JSON.stringify(comment);
  const result = Comment.fromJSON(commentString);

  expect(result).toStrictEqual(comment);
  expect(result.postedAt.isSame(comment.postedAt)).toBeTruthy();
});

test("Successful JSONArray conversion", () => {
  const userId = uuidv4();
  const eventId = uuidv4();
  const talkId = uuidv4();
  const comments = [
    new Comment("新しいコメント", userId, eventId, talkId),
    new Comment("別の新しいコメント", userId, eventId, talkId),
  ];

  const commentsString = JSON.stringify(comments);
  const result = Comment.fromJSONArray(commentsString);

  expect(result).toStrictEqual(comments);
});
