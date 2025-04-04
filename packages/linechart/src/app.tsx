import { createRoot } from "@hulk/common";
import Linechart from "./index.tsx";
import { LinechartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <LinechartProvider>
      <Linechart />
    </LinechartProvider>
  );
}