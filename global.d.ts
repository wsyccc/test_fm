declare const __APP_VERSION__: string;

declare global {
  interface Window {
    chrome?: {
      webview?: {
        postMessage?: (message: any) => void;
        addEventListener?: (event: string, handler: (e: MessageEvent) => void) => void;
        removeEventListener?: (event: string, handler: (e: MessageEvent) => void) => void;
      };
    };
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {};