import {createRoot} from "react-dom/client";
import Button from "./index.tsx";
import {CommonProvider} from "@hulk/common";
import {ButtonPropsInterface} from "@packages/button/src/type.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <CommonProvider<ButtonPropsInterface>>
      <Button title={"Button Demo"}/>
    </CommonProvider>
  );
}