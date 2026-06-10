import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function CodeInput() {
  const [values, setValues] = useState(["", "", "", "", "", ""])
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const focusNext = (index: number) => {
    if (index < 5) refs[index + 1].current?.focus()
  }

  const focusPrev = (index: number) => {
    if (index > 0) refs[index - 1].current?.focus()
  }

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase()
    const next = [...values]
    next[index] = char
    setValues(next)
    if (char) focusNext(index)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index]) {
      focusPrev(index)
    } else if (e.key === "ArrowLeft") {
      focusPrev(index)
    } else if (e.key === "ArrowRight") {
      focusNext(index)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 6)
      .toUpperCase()
    const next = ["", "", "", "", "", ""]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    setValues(next)
    const lastFilled = Math.min(pasted.length, 5)
    refs[lastFilled].current?.focus()
  }

  const cell = (index: number) => (
    <input
      key={index}
      ref={refs[index]}
      value={values[index]}
      maxLength={1}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      onPaste={handlePaste}
      className="w-12 h-14 text-center text-xl font-mono font-medium border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow uppercase"
    />
  )

  return (
    <div className="flex items-center gap-2">
      {cell(0)}
      {cell(1)}
      {cell(2)}
      <span className="text-muted-foreground text-2xl font-light select-none">-</span>
      {cell(3)}
      {cell(4)}
      {cell(5)}
    </div>
  )
}

export function App() {
  const [url, setUrl] = useState("")

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-border px-8 py-4">
        <span className="text-lg font-semibold tracking-tight">breviare</span>
      </nav>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-lg flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">Shorten a URL</h2>
            <p className="text-sm text-muted-foreground">
              Paste a long link and pick a custom code, or leave it blank for a random one.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* URL input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Long URL</label>
              <Input
                type="url"
                placeholder="https://example.com/very/long/url/here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* Code input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Short code{" "}
                <span className="text-muted-foreground font-normal">— optional</span>
              </label>
              <CodeInput />
            </div>

            <Button size="lg" className="w-full">
              Shorten
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
