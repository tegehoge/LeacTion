import { Comment } from "./comment";
import { v4 as uuidv4 } from "uuid";

test("Successful JSON conversion", () => {
  const comment = new Comment("新しいコメント", uuidv4(), uuidv4(), uuidv4());

  const commentString = JSON.stringify(comment);
  const result = Comment.fromJSON(commentString);

  expect(result).toStrictEqual(comment);
  expect(result.posted_at.isSame(comment.posted_at)).toBeTruthy();
});

test("Successful JSONArray conversion", () => {
  const user_id = uuidv4();
  const eventId = uuidv4();
  const talkId = uuidv4();
  const comments = [
    new Comment("新しいコメント", user_id, eventId, talkId),
    new Comment("別の新しいコメント", user_id, eventId, talkId),
  ];

  const commentsString = JSON.stringify(comments);
  const result = Comment.fromJSONArray(commentsString);

  expect(result).toStrictEqual(comments);
});
