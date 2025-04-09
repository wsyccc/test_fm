import { createRoot } from "@hulk/common";
import OtherCharts from "./index.tsx";
import { OtherChartsProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <OtherChartsProvider>
      <OtherCharts />
    </OtherChartsProvider>
  );
}