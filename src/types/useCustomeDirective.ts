// @ts-nocheck
import type { Accessor } from "solid-js";
// import { JSX } from "solid-js/h/jsx-runtime";

export class ConsiderEvent extends CustomEvent {
  type: "Consider";
  detail: {
    items: any;
    info: any;
  };
}

export class FinalizeEvent extends CustomEvent {
  type: "Finalize";
  detail: {
    items: any;
    info: any;
  };
}

export class MouseDownEvent extends MouseEvent {
  type: "MouseDown";
}

export class TouchStartEvent extends MouseEvent {
  type: "TouchStart";
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      dndzone: {
        items: () => { id: number; memberName: string; title: string }[];
        dragDisabled: Accessor<boolean>;
        dropTargetStyle: JSX.HTMLAttributes<HTMLDivElement>;
      };
    }
    interface CustomEvents {
      consider: ConsiderEvent;
      finalize: FinalizeEvent;
      mousedown: MouseDownEvent;
      touchstart: TouchStartEvent;
    }
  }
}
