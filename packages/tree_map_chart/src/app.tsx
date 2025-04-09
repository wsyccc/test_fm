import { createRoot } from "@hulk/common";
import TreeMapChart from "./index.tsx";
import { TreeMapChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <TreeMapChartProvider>
      <TreeMapChart />
    </TreeMapChartProvider>
  );
}