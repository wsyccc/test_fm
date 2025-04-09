import { createRoot } from "@hulk/common";
import CandleStickChart from "./index.tsx";
import { CandleStickChartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <CandleStickChartProvider>
      <CandleStickChart />
    </CandleStickChartProvider>
  );
}