import { createRoot } from "@hulk/common";
import ScatterChart from "./index.tsx";
import { ScatterChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ScatterChartProvider>
      <ScatterChart />
    </ScatterChartProvider>
  );
}