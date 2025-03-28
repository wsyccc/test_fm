import {createRoot} from "react-dom/client";
import {{namePascal}} from "./src";
import {CommonProvider} from "@hulk/common";
import {ButtonPropsInterface} from "@packages/button/src/type.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<{{namePascal}} title={ "{{namePascal}} Demo" } />);
}