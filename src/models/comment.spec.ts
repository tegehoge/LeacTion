import { Comment } from "./comment";
import { nanoid } from "nanoid";

test("Successful JSON conversion", () => {
  const comment = new Comment("新しいコメント", nanoid(), nanoid(8), nanoid());

  const commentString = JSON.stringify(comment);
  const result = Comment.fromJSON(commentString);

  expect(result).toStrictEqual(comment);
  expect(result.postedAt.isSame(comment.postedAt)).toBeTruthy();
});

test("Successful JSONArray conversion", () => {
  const userId = nanoid();
  const eventId = nanoid(8);
  const talkId = nanoid();
  const comments = [
    new Comment("新しいコメント", userId, eventId, talkId),
    new Comment("別の新しいコメント", userId, eventId, talkId),
  ];

  const commentsString = JSON.stringify(comments);
  const result = Comment.fromJSONArray(commentsString);

  expect(result).toStrictEqual(comments);
});
