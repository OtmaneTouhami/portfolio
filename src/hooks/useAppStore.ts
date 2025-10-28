import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "gui" | "cli";

type AliasMap = Record<string, string>;

type AppState = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;

  username: string;
  setUsername: (name: string) => void;

  aliases: AliasMap;
  setAlias: (alias: string, command: string) => void;
  removeAlias: (alias: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: "gui",
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "gui" ? "cli" : "gui" }),

      username: "guest",
      setUsername: (name) => set({ username: name }),

      aliases: {},
      setAlias: (alias, command) =>
        set({ aliases: { ...get().aliases, [alias]: command } }),
      removeAlias: (alias) => {
        const next = { ...get().aliases };
        delete next[alias];
        set({ aliases: next });
      },
    }),
    { name: "portfolio-app-store" }
  )
);
