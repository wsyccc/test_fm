import { createRoot } from "@hulk/common";
import SunburstChart from "./index.tsx";
import { SunburstChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <SunburstChartProvider>
      <SunburstChart />
    </SunburstChartProvider>
  );
}