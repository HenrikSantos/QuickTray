/// <reference types="vite/client" />

interface Window {
  api: {
    invoke: (channel: string, ...args: unknown[]) => Promise<any>;
    on: (channel: string, listener: (...args: any[]) => void) => () => void;
  };
}
