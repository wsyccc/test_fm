import { createRoot } from "@hulk/common";
import DynamicBarchart from "./index.tsx";
import { DynamicBarchartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <DynamicBarchartProvider>
      <DynamicBarchart />
    </DynamicBarchartProvider>
  );
}