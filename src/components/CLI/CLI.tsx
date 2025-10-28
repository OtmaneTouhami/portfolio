import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "../../hooks/useAppStore";
import { projects } from "../../data/projects";
import { resume } from "../../data/resume";
import { profile } from "../../data/profile";
import { timeline } from "../../data/timeline";
import { developer } from "../../data/developer-data";
import emailjs from "@emailjs/browser";

type Line = { id: number; text: string };

type PromptMode = null | "dev-contact";

type ContactDraft = {
  name: string;
  email: string;
  message: string;
};

const BOOT_MESSAGE = `Welcome to otmane.dev portfolio CLI!\nType 'portfolio --help' or '-h' to see available commands.\nPress Tab to toggle command suggestions.`;

// Note: legacy static COMMANDS removed; dynamic suggestions are computed contextually.

export default function CLI() {
  const { username, setUsername, aliases, setAlias } = useAppStore((s) => s);
  const setMode = useAppStore((s) => s.setMode);

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const bootedRef = useRef(false);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [promptMode, setPromptMode] = useState<PromptMode>(null);
  const [promptStep, setPromptStep] = useState(0);
  const [promptLabel, setPromptLabel] = useState("");
  const [draft, setDraft] = useState<ContactDraft>({
    name: "",
    email: "",
    message: "",
  });
  const [ctrlDown, setCtrlDown] = useState(false);
  type SuggestionItem = { insertText: string; display: string; desc?: string };
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedSugIdx, setSelectedSugIdx] = useState(0);
  const caretRef = useRef<number>(0);
  const sugListRef = useRef<HTMLDivElement>(null);
  const inputLineRef = useRef<HTMLDivElement>(null);
  const [suggestionsAbove, setSuggestionsAbove] = useState(false);
  const [suggestionsPinned, setSuggestionsPinnedState] = useState(false);
  const suggestionsPinnedRef = useRef(false);
  const setPinned = (value: boolean) => {
    suggestionsPinnedRef.current = value;
    setSuggestionsPinnedState(value);
  };

  useEffect(() => {
    if (!bootedRef.current) {
      bootedRef.current = true;
      typeOut(BOOT_MESSAGE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.ctrlKey) setCtrlDown(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || !e.ctrlKey) setCtrlDown(false);
    };
    const onBlur = () => setCtrlDown(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  const prompt = useMemo(() => `${username}@portfolio:~$ `, [username]);

  function println(text: string) {
    idRef.current += 1;
    setLines((ls) => [...ls, { id: idRef.current, text }]);
  }

  function renderLine(text: string) {
    // Check if line contains prompt marker
    if (text.includes("[[PROMPT]]")) {
      const parts = text.split("[[PROMPT]]");
      const beforePrompt = parts[0];
      const afterPrompt = parts[1] || "";
      const [promptPart, ...rest] = afterPrompt.split("[[/PROMPT]]");
      const afterPromptClose = rest.join("[[/PROMPT]]");

      return (
        <>
          {linkify(beforePrompt)}
          <span className="text-emerald-400">{promptPart}</span>
          {linkify(afterPromptClose)}
        </>
      );
    }
    return linkify(text);
  }

  function linkify(input: string) {
    if (!input) return null;
    // Matches http(s) URLs, root-relative paths, and emails
    const pattern =
      /((https?:\/\/[^\s)]+)|(\/[\w\-./%?#=&]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}))/g;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(input)) !== null) {
      const url = match[0];
      const start = match.index;
      if (start > lastIndex) nodes.push(input.slice(lastIndex, start));

      // Determine href
      const isEmail =
        /@/.test(url) && !url.startsWith("http") && !url.startsWith("/");
      const href = isEmail ? `mailto:${url}` : url;

      nodes.push(
        <a
          key={`${idRef.current}-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!ctrlDown) {
              e.preventDefault();
            }
          }}
          className={
            ctrlDown
              ? "hover:underline hover:text-blue-400 cursor-pointer"
              : "cursor-default"
          }
        >
          {url}
        </a>
      );
      lastIndex = pattern.lastIndex;
    }
    if (lastIndex < input.length) nodes.push(input.slice(lastIndex));
    return <>{nodes}</>;
  }

  // Keep the selected suggestion scrolled into view when navigating a long list
  useEffect(() => {
    const container = sugListRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLDivElement>(
      `[data-idx="${selectedSugIdx}"]`
    );
    if (el) {
      const block =
        selectedSugIdx === 0
          ? "start"
          : selectedSugIdx === suggestions.length - 1
          ? "end"
          : "nearest";
      el.scrollIntoView({ block, inline: "nearest" });
    }
  }, [selectedSugIdx, suggestions.length]);

  function renderSuggestionsDropdown() {
    if (promptMode !== null || !suggestionsPinned || suggestions.length === 0)
      return null;
    if (!inputLineRef.current || !containerRef.current) return null;

    const lineRect = inputLineRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const promptText = promptMode === "dev-contact" ? promptLabel : prompt;
    const beforeCursor = input.slice(0, caretRef.current ?? input.length);
    const cursorOffsetCh = promptText.length + beforeCursor.length;
    const charWidthPx = 7.2; // approximate width per character in monospace text-sm
    let left =
      lineRect.left - containerRect.left + cursorOffsetCh * charWidthPx;
    const maxWidth = 384; // Tailwind w-96
    left = Math.max(0, Math.min(left, containerRect.width - maxWidth));

    const style: React.CSSProperties = {
      left: `${left}px`,
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    };
    if (suggestionsAbove) style.bottom = "calc(100% + 4px)";
    else style.top = "calc(100% + 4px)";

    return (
      <div
        ref={sugListRef}
        className="absolute w-96 max-w-full max-h-64 overflow-auto rounded border border-neutral-700 bg-neutral-800 shadow-2xl z-50"
        style={style}
      >
        {suggestions.map((s, idx) => (
          <div
            key={`${s.display}-${idx}`}
            data-idx={idx}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => acceptSuggestion(s)}
            onMouseEnter={() => setSelectedSugIdx(idx)}
            className={
              "px-3 py-1.5 flex items-center justify-between gap-4 text-xs border-l-2 " +
              (idx === selectedSugIdx
                ? "bg-blue-600/20 border-blue-500 text-neutral-100"
                : "border-transparent text-neutral-300 hover:bg-neutral-700/50")
            }
          >
            <span className="font-mono">{s.display}</span>
            {s.desc && (
              <span className="text-[10px] text-neutral-500 italic">
                {s.desc}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Detect if suggestions should appear above or below based on available space
  useEffect(() => {
    if (
      suggestions.length === 0 ||
      !inputLineRef.current ||
      !containerRef.current
    )
      return;

    const inputRect = inputLineRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const spaceBelow = containerRect.bottom - inputRect.bottom;
    const spaceAbove = inputRect.top - containerRect.top;
    const suggestionsHeight = 256; // max-h-64 = 16rem = 256px

    // Show above if not enough space below and more space above
    setSuggestionsAbove(
      spaceBelow < suggestionsHeight && spaceAbove > spaceBelow
    );
  }, [suggestions.length, input, caretRef.current]);

  function getSuggestions(i: string, caret: number): SuggestionItem[] {
    // Use the substring up to caret for context
    const head = i.slice(0, caret);
    const endedWithSpace = /\s$/.test(head);
    const tokens = tokenize(head);
    const prefix = endedWithSpace ? "" : tokens[tokens.length - 1] || "";
    const lastToken = tokens[tokens.length - 1] || "";
    const add = (insertText: string, display?: string, desc?: string) => ({
      insertText,
      display: display ?? insertText,
      desc,
    });
    const matches = (value: string, query: string) => {
      if (!query) return true;
      return value.toLowerCase().includes(query.toLowerCase());
    };

    // Global fallbacks
    const root = [
      add("portfolio", "portfolio", "main command"),
      add("username-switch ", "username-switch", "change prompt username"),
      add("alias ", "alias", "define or list aliases"),
      add("unalias ", "unalias", "remove alias"),
      add("history", "history", "show history"),
      add("clear", "clear", "clear screen"),
      add("switch gui", "switch gui", "return to GUI"),
      add("exit", "exit", "return to GUI"),
      add("sudo portfolio hack", "sudo portfolio hack", "easter egg"),
    ];

    // If first token isn't "portfolio", suggest it & globals
    if (tokens.length === 0) return root;
    if (tokens[0] !== "portfolio") {
      return root.filter((s) => matches(s.display, prefix));
    }

    // portfolio [sub]
    const subs = [
      add("sections ", "sections", "browse sections"),
      add("projects ", "projects", "project commands"),
      add("resume ", "resume", "download resume"),
      add("contact", "contact", "contact info"),
      add("stack", "stack", "tech stack overview"),
      add("dev ", "dev", "developer tools"),
      add("coffee", "coffee", "just for fun"),
      add("konami", "konami", "???"),
      add("matrix", "matrix", "lines of green"),
      add("fortune", "fortune", "today's vibe"),
      add("roll", "roll", "random project"),
      add("rick", "rick", "never gonna?"),
      add("zen", "zen", "moment of calm"),
      add("haiku", "haiku", "code poetry"),
      add("ping", "ping", "pong included"),
      add("education", "education", "education timeline"),
      add("experience", "experience", "experience timeline"),
      add("--help", "--help", "help"),
      add("-h", "-h", "help"),
    ];

    if (tokens.length === 1) {
      // typing 'portfolio' with/without space
      if (!endedWithSpace) {
        return subs.filter((s) => matches(s.display, prefix));
      }
      return subs;
    }

    const sub = tokens[1];
    const exactSub = subs.find((s) => s.insertText.trim() === sub);
    if (tokens.length === 2 && !endedWithSpace && !exactSub) {
      return subs.filter((s) => matches(s.display, sub));
    }

    const atNewToken = tokens.length === 2 && endedWithSpace;
    const curPrefix = tokens.length === 2 && !endedWithSpace ? prefix : "";

    // sections
    if (sub === "sections") {
      const sectionItems = [
        add("ls", "ls", "list sections"),
        add("about", "about", "bio"),
        add("education", "education", "timeline"),
        add("experience", "experience", "timeline"),
        add("certifications", "certifications", "certs"),
        add("stack", "stack", "tech stack"),
        add("projects", "projects", "project list"),
        add("resume", "resume", "resume files"),
        add("contact", "contact", "contact info"),
      ];
      if (atNewToken) return sectionItems;
      if (!endedWithSpace && tokens.length === 2) {
        return sectionItems.filter((s) => matches(s.display, curPrefix));
      }
      return [];
    }

    // projects
    if (sub === "projects") {
      const third = tokens[2] ?? "";

      // portfolio projects [ls|open|<name>]
      if (tokens.length === 2) {
        if (!endedWithSpace) {
          const firsts = [
            add("ls", "ls", "list projects"),
            add("open ", "open", "open project link"),
            ...projects.map((p) =>
              add(
                p.name.includes(" ") ? `"${p.name}"` : p.name,
                p.name,
                "project"
              )
            ),
          ];
          return firsts.filter((s) => matches(s.display, curPrefix));
        }
        return [
          add("ls", "ls", "list projects"),
          add("open ", "open", "open project link"),
          ...projects.map((p) =>
            add(
              p.name.includes(" ") ? `"${p.name}"` : p.name,
              p.name,
              "project"
            )
          ),
        ];
      }
      if (tokens.length === 3 && !endedWithSpace) {
        if (third !== "open") {
          const opts = [
            add("open ", "open", "open project link"),
            ...projects.map((p) =>
              add(
                p.name.includes(" ") ? `"${p.name}"` : p.name,
                p.name,
                "project"
              )
            ),
          ];
          return opts.filter((s) => matches(s.display, third));
        }
      }
      if (third === "open") {
        // portfolio projects open [index]
        const idxs = projects.map((_, i) =>
          add(String(i + 1), String(i + 1), "index")
        );
        if (tokens.length === 3 && endedWithSpace) {
          return idxs;
        }
        if (tokens.length === 3 && !endedWithSpace) {
          return idxs;
        }
        if (tokens.length === 4) {
          const idxPrefix = endedWithSpace ? "" : lastToken;
          return idxs.filter((s) => matches(s.display, idxPrefix));
        }
        return [];
      }
      return [];
    }

    // resume
    if (sub === "resume") {
      const third = tokens[2] ?? "";
      const thirdPrefix =
        tokens.length >= 3 && !endedWithSpace ? lastToken : "";
      if (tokens.length === 2) {
        return endedWithSpace
          ? [add("-d ", "-d", "download language")]
          : [add("-d ", "-d", "download language")].filter((s) =>
              matches(s.display, curPrefix)
            );
      }
      if (tokens.length === 3 && !endedWithSpace && third !== "-d") {
        return [add("-d ", "-d", "download language")].filter((s) =>
          matches(s.display, thirdPrefix)
        );
      }
      if (tokens.length === 3 && tokens[2] === "-d") {
        const langs = [add("en", "en", "English"), add("fr", "fr", "French")];
        return endedWithSpace
          ? langs
          : langs.filter((s) => matches(s.display, prefix));
      }
      if (tokens.length === 4 && tokens[2] === "-d") {
        const langs = [add("en", "en", "English"), add("fr", "fr", "French")];
        const langPrefix = endedWithSpace ? "" : lastToken;
        return langs.filter((s) => matches(s.display, langPrefix));
      }
      return [];
    }

    // dev
    if (sub === "dev") {
      const opts = [add("contact", "contact", "send a message")];
      if (tokens.length === 2)
        return endedWithSpace
          ? opts
          : opts.filter((s) => matches(s.display, curPrefix));
      if (tokens.length === 3 && !endedWithSpace) {
        return opts.filter((s) => matches(s.display, lastToken));
      }
      return [];
    }

    return [];
  }

  function acceptSuggestion(item?: SuggestionItem) {
    const list = item ? [item] : suggestions;
    const pick = item ?? list[selectedSugIdx];
    if (!pick) return;

    const caret = caretRef.current ?? input.length;
    const head = input.slice(0, caret);
    const tail = input.slice(caret);
    const endedWithSpace = /\s$/.test(head);
    const tokens = tokenize(head);

    let newHead: string;
    if (tokens.length === 0 || endedWithSpace) {
      newHead = head + pick.insertText;
    } else {
      // replace current token (last) with suggestion
      const last = tokens[tokens.length - 1];
      newHead = head.slice(0, head.length - last.length) + pick.insertText;
    }
    const next = newHead + tail;
    setInput(next);
    // move caret to end of inserted text in next tick
    requestAnimationFrame(() => {
      const pos = newHead.length;
      if (inputRef.current) {
        inputRef.current.selectionStart = pos;
        inputRef.current.selectionEnd = pos;
        caretRef.current = pos;
      }
      if (suggestionsPinnedRef.current) {
        const sugs = getSuggestions(next, pos);
        setSuggestions(sugs);
        setSelectedSugIdx((idx) =>
          sugs.length === 0 ? 0 : Math.min(idx, sugs.length - 1)
        );
      } else {
        setSuggestions([]);
      }
    });
  }

  function typeOut(text: string, speed = 5) {
    const parts = text.split("\n");
    let i = 0;
    const emit = () => {
      if (i >= parts.length) return;
      println(parts[i]);
      i += 1;
      if (i < parts.length) setTimeout(emit, speed);
    };
    emit();
  }

  function handleCommand(raw: string) {
    const resolved = resolveAlias(raw.trim());
    if (!resolved) return;

    const [cmd, ...rest] = tokenize(resolved);
    switch (cmd) {
      case "portfolio": {
        const sub = rest[0];
        if (!sub) {
          println("Usage: portfolio <command>");
          println(
            "Try 'portfolio --help' or 'portfolio -h' for more information."
          );
          break;
        }
        if (sub === "--help" || sub === "-h") {
          println(helpText());
        } else if (sub === "sections") {
          const sectionsArg = rest[1];
          if (!sectionsArg) {
            println(
              [
                "Usage:",
                "  portfolio sections ls",
                "  portfolio sections <section-name>",
                "",
                "Try: portfolio sections ls",
              ].join("\n")
            );
          } else if (sectionsArg === "ls") {
            println(sectionsList());
          } else {
            println(renderSection(sectionsArg));
          }
        } else if (sub === "projects") {
          handleProjects(rest.slice(1));
        } else if (sub === "resume") {
          handleResume(rest.slice(1));
        } else if (sub === "contact") {
          println(contactText());
        } else if (sub === "stack") {
          println(formatStack());
        } else if (sub === "education") {
          println(formatTimeline("education"));
        } else if (sub === "experience") {
          println(formatTimeline("experience"));
        } else if (sub === "timeline") {
          println(
            [
              "The timeline has been split into 'education' and 'experience'.",
              "Try:",
              "  portfolio sections education",
              "  portfolio sections experience",
            ].join("\n")
          );
        } else if (sub === "coffee") {
          println(coffeeArt());
          typeOut("\nBrewing... ☕ Done!", 20);
        } else if (sub === "konami") {
          println(konamiEgg());
        } else if (sub === "matrix") {
          typeOut(matrixRain(), 8);
        } else if (sub === "fortune") {
          println(fortuneEgg());
        } else if (sub === "roll") {
          println(rollProject());
        } else if (sub === "rick") {
          println(rickEgg());
        } else if (sub === "zen") {
          println(zenEgg());
        } else if (sub === "haiku") {
          println(haikuEgg());
        } else if (sub === "ping") {
          println(pingEgg());
        } else if (sub === "dev") {
          if (rest[1] === "contact") startDevContact();
          else println("Unknown dev command. Try: portfolio dev contact");
        } else {
          println(`Unknown portfolio command: ${rest.join(" ")}`);
        }
        break;
      }
      case "username-switch": {
        const name = rest.join(" ").replaceAll("'", "").replaceAll('"', "");
        if (name) {
          setUsername(name);
          println(`Username set to ${name}`);
        } else {
          println('Usage: username-switch "<new-name>"');
        }
        break;
      }
      case "alias": {
        if (rest.length === 0) {
          // List all aliases
          const aliasList = Object.entries(aliases);
          if (aliasList.length === 0) {
            println("No aliases defined.");
          } else {
            const output = aliasList.map(([k, v]) => `${k}='${v}'`).join("\n");
            println(output);
          }
          break;
        }
        const joined = rest.join(" ");
        // Support: alias p='portfolio' or alias p=portfolio
        const match = joined.match(/^(\S+)=(.+)$/);
        if (match) {
          const [, a, c] = match;
          // Remove surrounding quotes if present
          const cleanCmd = c.replace(/^['"]|['"]$/g, "");
          setAlias(a, cleanCmd);
          println(`Alias added: ${a}='${cleanCmd}'`);
        } else {
          println(
            "Usage: alias <short>='<command>' or alias <short>=<command>"
          );
        }
        break;
      }
      case "unalias": {
        const aliasName = rest[0];
        if (!aliasName) {
          println("Usage: unalias <alias>");
          break;
        }
        if (aliases[aliasName]) {
          useAppStore.getState().removeAlias(aliasName);
          println(`Alias removed: ${aliasName}`);
        } else {
          println(`Alias not found: ${aliasName}`);
        }
        break;
      }
      case "switch": {
        if (rest[0] === "gui") {
          setMode("gui");
        } else {
          println("Usage: switch gui");
        }
        break;
      }
      case "exit": {
        setMode("gui");
        break;
      }
      case "clear": {
        setLines([]);
        break;
      }
      case "history": {
        if (history.length === 0) {
          println("No command history.");
        } else {
          const output = history
            .slice()
            .reverse()
            .map((cmd, i) => `${String(i + 1).padStart(4)} ${cmd}`)
            .join("\n");
          println(output);
        }
        break;
      }
      case "sudo": {
        if (rest[0] === "portfolio" && rest[1] === "hack") {
          println("sudo: Permission denied. This portfolio is unhackable 😉");
        } else {
          println("sudo: command requires elevated imagination.");
        }
        break;
      }
      default:
        println(`Command not found: ${cmd}`);
    }
  }

  function handleProjects(args: string[]) {
    const sub = args[0];
    if (!sub || sub === "ls") {
      const list = projects
        .map((p, i) => `${String(i + 1).padStart(2, "0")}) ${p.name}`)
        .join("\n");
      println(list || "No projects found.");
      return;
    }
    if (sub === "open") {
      const idx = Number(args[1]);
      if (!idx || idx < 1 || idx > projects.length)
        return println("Usage: portfolio projects open <index>");
      const p = projects[idx - 1];
      const url = p.demo || p.github;
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        println(`Opening ${url} ...`);
      } else println("No link available for this project.");
      return;
    }
    const name = args.join(" ").replaceAll('"', "").replaceAll("'", "").trim();
    const p = projects.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (!p) return println(`Project not found: ${name}`);
    const details = [
      `Name: ${p.name}`,
      `Description: ${p.description}`,
      p.tags?.length ? `Tags: ${p.tags.join(", ")}` : undefined,
      p.github ? `GitHub: ${p.github}` : undefined,
      p.demo ? `Live: ${p.demo}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
    println(details);
  }

  function handleResume(args: string[]) {
    if (args[0] === "-d") {
      const lang = args[1] as keyof typeof resume;
      if (!lang || !resume[lang])
        return println("Usage: portfolio resume -d fr|en");
      const path = resume[lang].path;
      download(path);
      println(`Downloading ${resume[lang].label} ...`);
    } else {
      println("Usage: portfolio resume -d fr|en");
    }
  }

  function download(path: string) {
    const a = document.createElement("a");
    a.href = path;
    a.download = path.split("/").pop() || "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function contactText() {
    const entries = [
      profile.socials.email &&
        `Email: ${profile.socials.email.replace("mailto:", "")}`,
      profile.socials.github && `GitHub: ${profile.socials.github}`,
      profile.socials.linkedin && `LinkedIn: ${profile.socials.linkedin}`,
      profile.socials.x && `X: ${profile.socials.x}`,
      profile.phone && `Phone: ${profile.phone}`,
    ].filter(Boolean) as string[];
    return entries.join("\n");
  }

  function sectionsList() {
    return [
      "Available sections:",
      "  • about",
      "  • education",
      "  • experience",
      "  • certifications",
      "  • stack",
      "  • projects",
      "  • resume",
      "  • contact",
      "",
      "Tip: portfolio sections <section-name>",
    ].join("\n");
  }

  function renderSection(name: string) {
    const key = name.toLowerCase();
    switch (key) {
      case "about":
        return formatSection("About", [profile.bio]);
      case "education":
        return formatTimeline("education");
      case "experience":
        return formatTimeline("experience");
      case "certifications":
        return formatCertifications();
      case "stack":
        return formatStack();
      case "projects":
        return formatProjects();
      case "resume":
        return formatResume();
      case "contact":
        return formatContact();
      default:
        return `Unknown section: ${name}\nTry: portfolio sections ls`;
    }
  }

  function formatSection(title: string, lines: string[]) {
    return [`━━ ${title} ━━`, "", ...lines].join("\n");
  }

  function formatTimeline(kind: "education" | "experience") {
    const items = timeline.filter((t) => t.type === kind);
    const title = kind === "education" ? "Education" : "Experience";
    const lines: string[] = [];

    for (const item of items) {
      const badge = item.type === "education" ? "🎓" : "💼";
      lines.push(`${badge} ${item.title}`);
      lines.push(`  ${item.org}`);
      lines.push(`  ${item.start} - ${item.end}`);
      if (item.description) lines.push(`  ↳ ${item.description}`);
      lines.push("");
    }

    return formatSection(title, lines);
  }

  function formatCertifications() {
    const certs = developer.certifications;
    if (!certs?.length) return "No certifications available.";

    const lines: string[] = [];
    for (const c of certs) {
      const badge = c.verifyUrl ? "✓" : "○";
      lines.push(`${badge} ${c.name}`);
      lines.push(`  Issuer: ${c.issuer}`);
      if (c.verifyUrl) lines.push(`  Verify: ${c.verifyUrl}`);
      else if (c.certificateId) lines.push(`  ID: ${c.certificateId}`);
      lines.push("");
    }

    return formatSection("Certifications", lines);
  }

  function formatStack() {
    const stack = developer.stack;
    if (!stack) return "Tech stack data unavailable.";

    const labelize = (kind: string) => {
      if (!kind) return "";
      if (kind.toLowerCase() === "api") return "API";
      return kind.charAt(0).toUpperCase() + kind.slice(1);
    };

    const lines = [
      "Frontend:",
      ...stack.frontend.map(
        (item) => `  - ${item.name} (${labelize(item.kind)})`
      ),
      "",
      "Backend & Platforms:",
      ...stack.backend.map(
        (item) => `  - ${item.name} (${labelize(item.kind)})`
      ),
    ];

    return formatSection("Tech Stack", lines);
  }

  function formatProjects() {
    const lines = projects.map(
      (p, i) => `${String(i + 1).padStart(2, "0")}. ${p.name}`
    );
    lines.push("");
    lines.push("Tip: portfolio projects <name> for details");
    return formatSection("Projects", lines);
  }

  function formatResume() {
    const lines = [
      "📄 English: " + resume.en.path,
      "📄 French: " + resume.fr.path,
      "",
      "Download: portfolio resume -d en|fr",
    ];
    return formatSection("Resume", lines);
  }

  function formatContact() {
    const lines: string[] = [];
    if (profile.phone) {
      lines.push(`☎  ${profile.phone}`);
    }
    if (profile.socials.email) {
      lines.push(`✉  ${profile.socials.email.replace("mailto:", "")}`);
    }
    if (profile.socials.github) {
      lines.push(`🔗 ${profile.socials.github}`);
    }
    if (profile.socials.linkedin) {
      lines.push(`🔗 ${profile.socials.linkedin}`);
    }
    if (profile.socials.x) {
      lines.push(`🔗 ${profile.socials.x}`);
    }
    return formatSection("Contact", lines);
  }

  function coffeeArt() {
    return [
      "   ( (",
      "    ) )",
      "  ........",
      "  |      |]",
      "  \u2615     |",
      "  `------'",
    ].join("\n");
  }

  function konamiEgg() {
    return [
      "UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A",
      "Easter egg unlocked!",
      "Portfolio shields disengaged... just kidding.",
      "Bonus tip: alias warp='portfolio projects open 1'",
    ].join("\n");
  }

  function matrixRain() {
    return [
      "01010100 01101001 01101101 01100101",
      "| | | | | | | | | | | |",
      "if (code) { craft(); }",
      "keep chasing the green glow...",
    ].join("\n");
  }

  function fortuneEgg() {
    const fortunes = [
      "You deploy, therefore you are.",
      "A pull request today keeps production calm tomorrow.",
      "Your next commit message will be legendary.",
      "Refactor boldly, but cover with tests.",
      "Somewhere, a linter smiles at you.",
    ];
    const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
    return `* ${pick}`;
  }

  function rollProject() {
    if (projects.length === 0) return "No projects available to roll.";
    const pick = projects[Math.floor(Math.random() * projects.length)];
    const details = [
      `[roll] ${pick.name}`,
      pick.description ? `desc: ${pick.description}` : undefined,
      pick.demo
        ? `live: ${pick.demo}`
        : pick.github
        ? `repo: ${pick.github}`
        : undefined,
    ].filter(Boolean);
    return details.join("\n");
  }

  function rickEgg() {
    return [
      "Never gonna give you up.",
      "Never gonna let you down.",
      "Never gonna run around and desert you.",
      "",
      "Synthwave engaged.",
    ].join("\n");
  }

  function zenEgg() {
    return [
      "    .-.",
      "   (   )",
      "    `-'",
      "    /|\\",
      "   /_|_\\",
      "",
      "Calm code, steady mind.",
    ].join("\n");
  }

  function haikuEgg() {
    const haikus = [
      "Compile, run, repeat\nSilent logs watch pipelines flow\nGreen lights greet the dawn",
      "Cursor blinks in wait\nIdeas hum in midnight code\nTests dream of passing",
      "Version bumps again\nChangelog whispers quietly\nShip with confidence",
      "Refactor whispers\nFunctions learn a lighter step\nTech debt takes a bow",
      "Coffee fuels the keys\nTypeScript guards the distant edge\nHumans craft the tale",
    ];
    return haikus[Math.floor(Math.random() * haikus.length)];
  }

  function pingEgg() {
    const latency = Math.floor(20 + Math.random() * 80);
    return `pong: ${latency}ms (loopback to creativity)`;
  }

  function startDevContact() {
    setSuggestions([]);
    setPinned(false);
    setPromptMode("dev-contact");
    setPromptStep(0);
    setPromptLabel("Name: ");
    setDraft({ name: "", email: "", message: "" });
  }

  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async function sendEmail(data: ContactDraft) {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: data.name, email: data.email, message: data.message },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  function resolveAlias(i: string) {
    const [first, ...rest] = i.trim().split(" ");
    if (aliases[first]) return `${aliases[first]} ${rest.join(" ")}`.trim();
    return i;
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Tab toggles suggestions
    if (promptMode === null && e.key === "Tab") {
      e.preventDefault();
      if (suggestionsPinned) {
        setSuggestions([]);
        setPinned(false);
      } else {
        const caret = inputRef.current?.selectionStart ?? input.length;
        const sugs = getSuggestions(input, caret);
        setSuggestions(sugs);
        setSelectedSugIdx(0);
        setPinned(sugs.length > 0);
      }
      return;
    }

    // Suggestion navigation when visible
    if (promptMode === null && suggestionsPinned && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSugIdx((i) =>
          suggestions.length === 0 ? 0 : (i + 1) % suggestions.length
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSugIdx((i) =>
          suggestions.length === 0
            ? 0
            : (i - 1 + suggestions.length) % suggestions.length
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        acceptSuggestion();
        setSuggestions([]);
        setPinned(false);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSuggestions([]);
        setPinned(false);
        return;
      }
    }

    if (e.key === "Enter") {
      setSuggestions([]);
      setPinned(false);
      const value = input.trim();

      if (promptMode === "dev-contact") {
        // In contact mode, show input on same line as prompt
        if (promptStep === 0) {
          if (!value) {
            println("Name cannot be empty. Please enter your name:");
            setInput("");
            setPromptLabel("Name: ");
            return;
          }
          println(`Name: ${value}`);
          setDraft((d) => ({ ...d, name: value }));
          setPromptStep(1);
          setPromptLabel("Email: ");
        } else if (promptStep === 1) {
          if (!value) {
            println("Email cannot be empty. Please enter your email:");
            setInput("");
            setPromptLabel("Email: ");
            return;
          }
          if (!validateEmail(value)) {
            println("Invalid email format. Please enter a valid email:");
            setInput("");
            setPromptLabel("Email: ");
            return;
          }
          println(`Email: ${value}`);
          setDraft((d) => ({ ...d, email: value }));
          setPromptStep(2);
          setPromptLabel("Message: ");
        } else if (promptStep === 2) {
          if (!value) {
            println("Message cannot be empty. Please enter your message:");
            setInput("");
            setPromptLabel("Message: ");
            return;
          }
          println(`Message: ${value}`);
          const finalDraft = { ...draft, message: value };
          println("Sending...");
          const success = await sendEmail(finalDraft);
          if (success) {
            println(
              [
                `From: ${finalDraft.name} <${finalDraft.email}>`,
                `Message: ${finalDraft.message}`,
                "Status: Sent successfully! ✓",
              ].join("\n")
            );
          } else {
            println(
              "Error: Failed to send email. Please check your EmailJS configuration."
            );
          }
          setPromptMode(null);
          setPromptStep(0);
          setPromptLabel("");
        }
        setInput("");
        setHistory((h) => [value, ...h]);
        setHistoryIdx(-1);
        return;
      }

      // Normal command mode
      if (!value) return;
      // Print command with green prompt using special marker
      println(`[[PROMPT]]${prompt}[[/PROMPT]]${value}`);
      setHistory((h) => [value, ...h]);
      setHistoryIdx(-1);
      setInput("");
      handleCommand(value);
    } else if (e.key === "Escape" || (e.ctrlKey && e.key === "c")) {
      // Allow cancelling dev contact mode
      if (promptMode === "dev-contact") {
        println("^C");
        setPromptMode(null);
        setPromptStep(0);
        setPromptLabel("");
        setInput("");
        e.preventDefault();
        return;
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(history.length - 1, historyIdx + 1);
      if (history[nextIdx]) setInput(history[nextIdx]);
      setHistoryIdx(nextIdx);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(-1, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : history[nextIdx]);
    } else if (e.key === "Tab") {
      // handled above when suggestions list is closed/open
      e.preventDefault();
    }
  }

  function helpText() {
    return [
      "Usage: portfolio <command> [options]",
      "",
      "Commands:",
      "  --help, -h                 Show this help",
      "  sections ls                 List available sections",
      "  sections <section-name>     Show a section in ASCII",
      "  projects ls                 List projects",
      '  projects "<name>"           Show project details',
      "  projects open <index>       Open project link",
      "  resume -d fr|en             Download resume (client-side)",
      "  contact                     Show contact details",
      "  stack                       Show tech stack summary",
      "  dev contact                 Simulate sending a message",
      "  coffee                      Brew a terminal coffee",
      "",
      "Sections:",
      "  about  education  experience  certifications  projects  resume  contact",
      "",
      "Global:",
      "  username-switch '<name>'    Change prompt username",
      "  alias [<a>=<cmd>]            Create alias or list all aliases",
      "  unalias <alias>              Remove an alias",
      "  history                      Show command history",
      "  clear                       Clear the screen",
      "  switch gui | exit           Return to GUI",
    ].join("\n");
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-100">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-neutral-400">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          <span className="ml-2">portfolio-cli</span>
        </div>
        <div
          ref={containerRef}
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-auto p-4 font-mono text-sm scrollbar-hide cursor-text relative"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {lines.map((l) => (
            <div key={l.id} className="whitespace-pre-wrap">
              {renderLine(l.text)}
            </div>
          ))}

          <div ref={inputLineRef} className="flex relative">
            {promptMode === "dev-contact" ? (
              <span className="text-emerald-400 select-none">
                {promptLabel}
              </span>
            ) : (
              <span className="text-emerald-400 select-none">{prompt}</span>
            )}
            <input
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => {
                const v = e.target.value;
                setInput(v);
                const caret = e.target.selectionStart ?? v.length;
                caretRef.current = caret;
                if (promptMode === null && suggestionsPinnedRef.current) {
                  const sugs = getSuggestions(v, caret);
                  setSuggestions(sugs);
                  setSelectedSugIdx((idx) =>
                    sugs.length === 0 ? 0 : Math.min(idx, sugs.length - 1)
                  );
                }
              }}
              onKeyDown={onKeyDown}
              onKeyUp={(e) => {
                const pos =
                  (e.currentTarget as HTMLInputElement).selectionStart ??
                  input.length;
                caretRef.current = pos;
              }}
              className="flex-1 bg-transparent outline-none caret-emerald-400 pl-1"
              aria-label="CLI input"
            />

            {renderSuggestionsDropdown()}
          </div>
        </div>
      </div>
    </div>
  );
}

function tokenize(s: string) {
  const tokens: string[] = [];
  let current = "";
  let inQuotes = false;
  let quoteChar = "";
  for (const ch of s) {
    if ((ch === '"' || ch === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = ch;
    } else if (inQuotes && ch === quoteChar) {
      inQuotes = false;
    } else if (!inQuotes && ch === " ") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}
