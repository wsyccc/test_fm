import { createRoot } from "@hulk/common";
import Text from "./index.tsx";
import { TextProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <TextProvider>
      <Text />
    </TextProvider>
  );
}