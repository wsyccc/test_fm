import {createRoot} from "react-dom/client";
import {{namePascal}} from "./src";
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