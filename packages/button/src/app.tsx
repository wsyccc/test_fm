import {createRoot} from "react-dom/client";
import Button from "./index.tsx";
import {ButtonProvider} from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ButtonProvider>
      <Button />
    </ButtonProvider>
  );
}