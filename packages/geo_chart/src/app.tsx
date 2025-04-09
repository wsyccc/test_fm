import { createRoot } from "@hulk/common";
import GeoChart from "./index.tsx";
import { GeoChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <GeoChartProvider>
      <GeoChart />
    </GeoChartProvider>
  );
}