import { VoidComponent } from "solid-js";
import { Toaster } from "solid-toast";

export const Toast: VoidComponent = () => {
  return <Toaster position="top-right" />;
};
