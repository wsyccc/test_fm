import { createRoot } from "@hulk/common";
import {{namePascal}} from "./index.tsx";
import { {{namePascal}}Provider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <{{namePascal}}Provider>
      <{{namePascal}} />
    </{{namePascal}}Provider>
  );
}