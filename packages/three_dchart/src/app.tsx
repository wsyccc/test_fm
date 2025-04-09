import { createRoot } from "@hulk/common";
import ThreeDChart from "./index.tsx";
import { ThreeDChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ThreeDChartProvider>
      <ThreeDChart />
    </ThreeDChartProvider>
  );
}