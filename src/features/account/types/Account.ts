/**
 * アプリケーション内でGoogleアカウントと紐付けて管理するAccount。
 * UIDはFirebase Authで発行されるものだが、
 * displayNameは初期値としてGoogleアカウントから取得し、ユーザー自身で更新できる。
 */
export type Account = {
  uid: string;
  displayName: string;
};
