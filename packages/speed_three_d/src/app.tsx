import { createRoot } from "@hulk/common";
import SpeedThreeD from "./index.tsx";
import { SpeedThreeDProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <SpeedThreeDProvider>
      <SpeedThreeD />
    </SpeedThreeDProvider>
  );
}