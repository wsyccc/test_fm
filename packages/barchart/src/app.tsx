import { createRoot } from "@hulk/common";
import Barchart from "./index.tsx";
import { BarchartProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <BarchartProvider>
      <Barchart />
    </BarchartProvider>
  );
}