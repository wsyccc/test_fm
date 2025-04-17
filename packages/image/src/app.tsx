import { createRoot } from "@hulk/common";
import Image from "./index.tsx";
import { ImageProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ImageProvider>
      <Image />
    </ImageProvider>
  );
}