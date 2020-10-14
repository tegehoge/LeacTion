import { Comment, CommentId } from "../models/comment";
import { Event, EventId } from "../models/event";

export interface EventRepository {
  /**
   * 存在しないイベントはパスワードを保存する。
   * 存在しているイベントの場合はパスワードが一致しないと失敗する。
   * @param event イベント
   * @param password 管理用パスワード
   */
  save(event: Event, password: string): Promise<Event>;

  /**
   * イベントを検索する
   * @param eventIdイベントID
   */
  findById(eventId: EventId): Promise<Event>;

  /**
   * パスワードの一致のみ確認する
   * @param eventIdイベントID
   * @param password 管理用パスワード
   */
  verifyPassword(eventId: string, password: string): Promise<boolean>;
}

export interface CommentRepository {
  /**
   * コメントを保存する
   * @param comment コメント
   */
  save(comment: Comment): Promise<Comment>;

  /**
   * イベント内のコメントをすべて取得する
   * @param eventIdイベントID
   */
  findAllByEventId(eventId: EventId): Promise<Comment[]>;

  /**
   * ユーザーのlikeの状態を保存する
   * @param commentId コメントID
   * @param userIdHashed ハッシュ化したユーザーID
   * @param remove likeを削除する場合 true
   */
  saveLike(
    eventId: EventId,
    commentId: CommentId,
    userIdHashed: string,
    remove: boolean
  ): Promise<boolean>;
}
