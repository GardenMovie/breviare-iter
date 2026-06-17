import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ShortenState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; shortUrl: string }
  | { status: "error"; message: string }

export function ShortenForm() {
  const [url, setUrl] = useState("")
  const [state, setState] = useState<ShortenState>({ status: "idle" })

  const handleSubmit = async () => {
    if (!url) return
    setState({ status: "loading" })
    try {
      const res = await fetch("/api/v1/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Something went wrong")
      setState({ status: "done", shortUrl: data.data.shortUrl })
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Something went wrong" })
    }
  }

  const reset = () => {
    setUrl("")
    setState({ status: "idle" })
  }

  const loading = state.status === "loading"

  return (
    <div className="flex flex-col gap-6">
      {state.status === "done" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 p-4 rounded-lg border border-border bg-muted/40">
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Your short link</span>
            <span className="text-lg font-mono font-medium text-foreground break-all">{state.shortUrl}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigator.clipboard.writeText(state.shortUrl)}
            >
              Copy
            </Button>
            <Button variant="outline" className="flex-1" onClick={reset}>
              Shorten another
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Input
              type="url"
              placeholder="https://example.com/very/long/url/here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="h-14 text-base px-4"
            />
          </div>

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!url || loading}>
            {loading ? "Shortening…" : "Shorten"}
          </Button>
        </div>
      )}
    </div>
  )
}
