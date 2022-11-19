import type { Event } from "~/types/event";

export interface EventRepository {
  /**
   * 存在しないイベントはパスワードを保存する。
   * 存在しているイベントの場合はパスワードが一致しないと失敗する。
   * @param event イベント
   * @param password 管理用パスワード
   */
  save(event: Event, password: string): Promise<Event>;
}
