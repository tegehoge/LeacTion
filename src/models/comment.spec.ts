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

test("Sanitize text on create", () => {
  const comment = new Comment("<script></script>", nanoid(), nanoid(8), nanoid());
  expect(comment.text).toStrictEqual("&lt;script&gt;&lt;/script&gt;");
});

test("URL is translated as <a> tag", () => {
  const comment = new Comment("https://example.com/", nanoid(), nanoid(8), nanoid());
  expect(comment.asHTML).toStrictEqual(
    '<a href="https://example.com/" class="link-text" target="_blank" rel="noopener noreferrer">https://example.com/</a>'
  );
});

test("With newline", () => {
  const comment = new Comment("aaa\nbbb  ccc\nddd", nanoid(), nanoid(8), nanoid());
  expect(comment.asHTML).toStrictEqual("aaa<br />bbb&nbsp;&nbsp;ccc<br />ddd");
});

test("Sanitize javascript code", () => {
  const comment = new Comment(
    "<script>javascript:alert('sample');</script>",
    nanoid(),
    nanoid(8),
    nanoid()
  );
  expect(comment.asHTML).toStrictEqual("&lt;script&gt;javascript:alert('sample');&lt;/script&gt;");
});
