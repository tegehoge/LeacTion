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
   * @param event_id イベントID
   */
  findById(event_id: EventId): Promise<Event>;

  /**
   * パスワードの一致のみ確認する
   * @param event_id イベントID
   * @param password 管理用パスワード
   */
  verifyPassword(event_id: string, password: string): Promise<boolean>;
}

export interface CommentRepository {
  /**
   * コメントを保存する
   * @param comment コメント
   */
  save(comment: Comment): Promise<Comment>;

  /**
   * イベント内のコメントをすべて取得する
   * @param event_id イベントID
   */
  findAllByEventId(event_id: EventId): Promise<Comment[]>;

  /**
   * ユーザーのlikeの状態を保存する
   * @param comment_id コメントID
   * @param user_id_hashed ハッシュ化したユーザーID
   * @param like likeしたかどうか
   */
  saveLike(
    comment_id: CommentId,
    user_id_hashed: string,
    like: boolean
  ): Promise<boolean>;
}
