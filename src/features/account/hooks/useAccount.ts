import { createMemo, createSignal } from "solid-js";

export type Account = {
  uid: string;
  displayName: string;
};

export const useAccount = (account: Account) => {
  const [displayName, setDisplayName] = createSignal<string>(account.displayName);
  const newAccount = createMemo<Account>(() => {
    return { uid: account.uid, displayName: displayName() };
  });
  return { account: newAccount, setDisplayName: setDisplayName };
};
