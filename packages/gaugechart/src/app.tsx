import { createRoot } from "@hulk/common";
import Gaugechart from "./index.tsx";
import { GaugechartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <GaugechartProvider>
      <Gaugechart />
    </GaugechartProvider>
  );
}