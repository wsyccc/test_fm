import { createRoot } from "@hulk/common";
import Protable from "./index.tsx";
import { ProtableProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ProtableProvider>
      <Protable />
    </ProtableProvider>
  );
}