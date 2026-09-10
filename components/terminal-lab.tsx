"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { getCv } from "@/lib/cv"
import "@xterm/xterm/css/xterm.css"
import "@/app/terminal.css"

const cv = getCv("en")

type Action = { kind: "print"; lines: string[] } | { kind: "navigate"; href: string } | { kind: "clear" }

const FILES: Record<string, () => string[]> = {
  "about.txt": () => [...cv.about, "", cv.lookingFor],
  "skills.txt": () => [
    "Technical:",
    ...cv.skills.technical.map((s) => `  - ${s.text}`),
    "",
    "Professional:",
    ...cv.skills.professional.map((s) => `  - ${s}`),
  ],
  "experience.txt": () =>
    cv.experience.flatMap((e) => [`${e.title} (${e.period}) — ${e.org}`, ...e.bullets.map((b) => `  - ${b}`), ""]),
  "education.txt": () => cv.education.map((e) => `${e.degree} — ${e.org} (${e.period})`),
  "contact.txt": () => [cv.footer.email, cv.footer.github, cv.footer.linkedin],
}

const HELP_LINES = [
  "ls                 list what's here",
  "cat <file>         print a file (about.txt, skills.txt, experience.txt, education.txt, contact.txt)",
  "cd projects        open the projects page",
  "cd site            open the full site (same as exit)",
  "whoami",
  "pwd",
  "history",
  "clear",
]

function runCommand(cmd: string, history: string[]): Action {
  const raw = cmd.trim()
  const c = raw.toLowerCase()
  const [word, ...rest] = c.split(/\s+/)
  const arg = rest.join(" ")

  // Bare section names still work as a quiet convenience alias.
  const bareFileAlias: Record<string, string> = {
    about: "about.txt",
    skills: "skills.txt",
    experience: "experience.txt",
    education: "education.txt",
    contact: "contact.txt",
  }

  switch (word) {
    case undefined:
    case "":
      return { kind: "print", lines: [] }
    case "help":
      return { kind: "print", lines: [`Available commands:`, ...HELP_LINES.map((x) => `  ${x}`)] }
    case "whoami":
      return { kind: "print", lines: [`${cv.name} — ${cv.title}`, cv.tagline] }
    case "pwd":
      return { kind: "print", lines: ["/home/guest/eiplsoma"] }
    case "ls":
      return { kind: "print", lines: [Object.keys(FILES).join("  "), "projects/  site/"] }
    case "history":
      return { kind: "print", lines: history.map((h, i) => `  ${i + 1}  ${h}`) }
    case "cat": {
      if (!Object.hasOwn(FILES, arg)) {
        return { kind: "print", lines: [`cat: ${arg || "(missing operand)"}: No such file`] }
      }
      return { kind: "print", lines: FILES[arg]() }
    }
    case "cd": {
      if (arg === "projects") return { kind: "navigate", href: "/projects" }
      if (arg === "site" || arg === "..") return { kind: "navigate", href: "/site" }
      return { kind: "print", lines: [`cd: ${arg || "(missing operand)"}: No such directory`] }
    }
    case "projects":
      return { kind: "navigate", href: "/projects" }
    case "concept":
      return { kind: "navigate", href: "/concept" }
    case "site":
    case "exit":
      return { kind: "navigate", href: "/site" }
    case "clear":
      return { kind: "clear" }
    case "sudo":
      return { kind: "print", lines: ["Permission denied: you're not root here either."] }
    case "ping":
      return { kind: "print", lines: ["pong"] }
    case "abracadabra":
      return { kind: "print", lines: ["Nothing happens. You're not a wizard, Harry."] }
    case "hello":
      if (arg === "world") {
        return { kind: "print", lines: ["Hello, World!"] }
      }
      return { kind: "print", lines: ["Hi."] }
    case "418":
      return { kind: "print", lines: ["I'm a teapot."] }
    case "bug":
      return {
        kind: "print",
        lines: ["First bug ever found: an actual moth, stuck in a relay of the Harvard Mark II (1947, Grace Hopper's team). That's where \"debugging\" comes from."],
      }
    case ":q":
    case ":wq":
      return { kind: "print", lines: ["This isn't vim. (There is no escape.)"] }
    case "hack":
      if (arg === "nasa") {
        return { kind: "print", lines: ["Access granted. (Please don't sue me, NASA.)"] }
      }
      return { kind: "print", lines: [`command not found: ${c} (try "help")`] }
    case "rm":
      return { kind: "print", lines: ["Nice try. Nothing to delete on a static export."] }
    case "sl":
      return {
        kind: "print",
        lines: ["    ====        ________                ___________", "_D _|  |_______/        \\__I_I_____===__|_________|", " |(_)---  |   H\\________/ |   |        =|___ ___|", " /     |  |   H  |  |     |   |         ||_| |_||", "|      |  |   H  |__--------------------| [___] |", "| ________|___H__/__|_____/[][]~\\___/[][]      |", "|/ |   |-----------I_____I [][] []  D   |=======|__", "", "(you meant \"ls\")"],
      }
    default:
      if (Object.hasOwn(bareFileAlias, word)) {
        return { kind: "print", lines: FILES[bareFileAlias[word]]() }
      }
      return { kind: "print", lines: [`command not found: ${c} (try "help")`] }
  }
}

const PROMPT = "\x1b[32mguest@eiplsoma\x1b[0m:~$ "

export function TerminalLab() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Terminal | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const term = new Terminal({
      fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      fontSize: 14.5,
      cursorBlink: true,
      convertEol: true,
      theme: {
        background: "#0b0d0f",
        foreground: "#d4f5d4",
        cursor: "#5fbf7a",
        red: "#ff5b69",
        brightRed: "#ff8080",
        green: "#5fbf7a",
      },
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    term.open(containerRef.current)
    fitAddon.fit()
    term.focus()
    termRef.current = term

    let line = ""
    const history: string[] = []
    let historyIndex = -1

    function writePrompt() {
      term.write(PROMPT)
    }

    function redrawLine(newLine: string) {
      // clear current line content after the prompt, then rewrite
      term.write("\r\x1b[K")
      term.write(PROMPT + newLine)
      line = newLine
    }

    function handleCommand(cmd: string) {
      const action = runCommand(cmd, history)

      if (action.kind === "clear") {
        term.clear()
        return
      }
      if (action.kind === "navigate") {
        term.writeln(`\x1b[90m→ ${action.href}\x1b[0m`)
        router.push(action.href)
        return
      }
      for (const l of action.lines) {
        if (l.startsWith("command not found")) {
          term.writeln(`\x1b[31m${l}\x1b[0m`)
        } else {
          term.writeln(l)
        }
      }
    }

    term.writeln(`\x1b[90m${cv.name} — ${cv.title}\x1b[0m`)
    term.writeln(`Type "help" to see what this thing can do, or "site" to skip straight to the full site.`)
    writePrompt()

    const dataListener = term.onData((data) => {
      if (data === "\r") {
        term.write("\r\n")
        if (line.trim()) {
          history.push(line)
        }
        historyIndex = history.length
        handleCommand(line)
        line = ""
        writePrompt()
      } else if (data === "\x7f") {
        if (line.length > 0) {
          line = line.slice(0, -1)
          term.write("\b \b")
        }
      } else if (data === "\x1b[A") {
        if (historyIndex > 0) {
          historyIndex -= 1
          redrawLine(history[historyIndex] ?? "")
        }
      } else if (data === "\x1b[B") {
        if (historyIndex < history.length - 1) {
          historyIndex += 1
          redrawLine(history[historyIndex] ?? "")
        } else {
          historyIndex = history.length
          redrawLine("")
        }
      } else if (data >= " " && data !== "\x7f") {
        line += data
        term.write(data)
      }
    })

    const handleResize = () => fitAddon.fit()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      dataListener.dispose()
      term.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="term-page">
      <a href="/site" className="term-skip">
        Skip to full site →
      </a>
      <a href="/concept" className="term-concept-link">
        Try the concept dashboard →
      </a>
      <div ref={containerRef} className="term-xterm" />
    </div>
  )
}
