import { dndzone as dndZoneDirective, TRIGGERS, SOURCES } from "solid-dnd-directive";
import { Component, For, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import s from "./styles.css";

export const Todo: Component = () => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6
  const dndzone = dndZoneDirective;
  const [items, setItems] = createStore([
    { id: 1, text: "item 1" },
    { id: 2, text: "item 2" },
    { id: 3, text: "item 3" },
  ]);

  const [dragDisabled, setDragDisabled] = createSignal(true);

  function handleConsider(e) {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;
    setItems(newItems);
    setItems(newItems);
    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      setDragDisabled(true);
    }
  }
  function handleFinalize(e) {
    const {
      items: newItems,
      info: { source },
    } = e.detail;
    setItems(newItems);
    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      setDragDisabled(true);
    }
  }
  function startDrag(e) {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    setDragDisabled(false);
  }
  // function handleKeyDown(e) {
  //   console.log("handleKeyDown", e);
  //   if ((e.key === "Enter" || e.key === " ") && dragDisabled()) setDragDisabled(false);
  // }

  return (
    <main>
      <h3>Drag Handles</h3>
      <p>
        Items can be dragged using the grey handles via mouse, touch or keyboard. The text on the
        items can be selected without starting a drag
      </p>
      <hr />
      <section
        use:dndzone={{ items: () => items, dragDisabled }}
        on:consider={handleConsider}
        on:finalize={handleFinalize}
      >
        <For each={items}>
          {(item) => (
            <div class={s.item}>
              <div
                tabindex={dragDisabled() ? 0 : -1}
                aria-label="drag-handle"
                class={s.handle}
                style={dragDisabled() ? "cursor: grab" : "cursor: grabbing"}
                on:mousedown={startDrag}
                on:touchstart={startDrag}
                // on:keydown={handleKeyDown}
              >
                test
              </div>
              <span>
                {item.text} : {Date.now()}
              </span>
            </div>
          )}
        </For>
      </section>
    </main>
  );
};

export default Todo;
