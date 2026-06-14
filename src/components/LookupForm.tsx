import { useState, useRef, type KeyboardEvent, type ClipboardEvent } from "react"
import { Button } from "@/components/ui/button"

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }

function CodeInput({
  values,
  onChange,
  disabled,
}: {
  values: string[]
  onChange: (values: string[]) => void
  disabled?: boolean
}) {
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))

  const focusNext = (i: number) => { if (i < 5) refs[i + 1].current?.focus() }
  const focusPrev = (i: number) => { if (i > 0) refs[i - 1].current?.focus() }

  const handleChange = (index: number, val: string) => {
    const char = val.replace(/[^a-zA-Z0-9]/g, "").slice(-1)
    const next = [...values]
    next[index] = char
    onChange(next)
    if (char) focusNext(index)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index]) focusPrev(index)
    else if (e.key === "ArrowLeft") focusPrev(index)
    else if (e.key === "ArrowRight") focusNext(index)
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)
    const next = ["", "", "", "", "", ""]
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i]
    onChange(next)
    refs[Math.min(pasted.length, 5)].current?.focus()
  }

  const cell = (index: number) => (
    <input
      key={index}
      ref={refs[index]}
      value={values[index]}
      maxLength={1}
      disabled={disabled}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      onPaste={handlePaste}
      className="w-12 h-14 text-center text-xl font-mono font-medium border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
    />
  )

  return (
    <div className="flex items-center gap-2">
      {cell(0)}{cell(1)}{cell(2)}
      <span className="text-muted-foreground text-2xl font-light select-none">-</span>
      {cell(3)}{cell(4)}{cell(5)}
    </div>
  )
}

export function LookupForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [state] = useState<LookupState>({ status: "idle" })

  const filled = code.every((c) => c !== "")

  const handleGo = () => {
    if (!filled) return
    window.location.href = `/${code.join("")}`
  }

  const loading = state.status === "loading"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">Go to a link</h2>
        <p className="text-sm text-muted-foreground">
          Enter a six-character code to be redirected to the original URL.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Short code</label>
        <CodeInput values={code} onChange={setCode} disabled={loading} />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button size="lg" className="w-full" onClick={handleGo} disabled={!filled || loading}>
        {loading ? "Looking up…" : "Go"}
      </Button>
    </div>
  )
}
