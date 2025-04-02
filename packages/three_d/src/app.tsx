import { createRoot } from "@hulk/common";
import ThreeD from "./index.tsx";
import { ThreeDProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ThreeDProvider>
      <ThreeD />
    </ThreeDProvider>
  );
}