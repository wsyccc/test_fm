import { createRoot } from "@hulk/common";
import ReportBuilder from "./index.tsx";
import { ReportBuilderProvider } from "./context.ts";

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <ReportBuilderProvider>
      <ReportBuilder yamlText={""} width={"100%"} height={"100%"} />
    </ReportBuilderProvider>
  );
}