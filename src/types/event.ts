import type { DOMElement } from "solid-js/jsx-runtime";

export type EventType<T, E extends Event> = E & {
  currentTarget: T;
  target: DOMElement;
};
