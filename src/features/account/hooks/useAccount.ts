import { createMemo, createSignal } from "solid-js";
import { Account } from "../types/Account";

/**
 * 現在のアカウント情報とdisplayNameを更新する関数を提供するフック
 * @param account Account
 * @returns hooks
 */
export const useAccount = (account: Account) => {
  const [displayName, setDisplayName] = createSignal<string>(account.displayName);
  const newAccount = createMemo<Account>(() => {
    return { uid: account.uid, displayName: displayName() };
  });
  return { account: newAccount, setDisplayName: setDisplayName };
};
