import { createRoot } from "@hulk/common";
import Splitter from "./index.tsx";
import { SplitterProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <SplitterProvider>
      <Splitter />
    </SplitterProvider>
  );
}