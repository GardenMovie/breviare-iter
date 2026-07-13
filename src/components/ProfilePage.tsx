import { Check, Copy, Search } from "lucide-react"
import { useState } from "react"

import { LinkCard } from "@/components/LinkCard"

const PROFILE_LINK = "https://www.linkedin.com/in/dody-gallerani/"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const links = [
  {
    url: "https://github.com/gardenmovie/breviare-iter",
    code: "aZq-Kbn",
    visits: [42, 55, 38, 61, 74, 49, 88],
  },
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    code: "Xtr-mvP",
    visits: [120, 98, 143, 110, 165, 201, 189],
  },
  {
    url: "https://en.wikipedia.org/wiki/URL_shortening",
    code: "wgH-uRl",
    visits: [12, 8, 15, 22, 9, 18, 27],
  },
].map((link) => ({
  url: link.url,
  code: link.code,
  data: DAYS.map((day, i) => ({ day, visits: link.visits[i] })),
}))

export function ProfilePage() {
  const [copied, setCopied] = useState(false)
  const [query, setQuery] = useState("")

  const q = query.trim().toLowerCase()
  const filteredLinks = q
    ? links.filter(
        (link) =>
          link.code.toLowerCase().includes(q) ||
          link.url.toLowerCase().includes(q),
      )
    : links

  const handleCopy = async () => {
    await navigator.clipboard.writeText("gardenmovie")
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto mt-24 mb-12 w-[80%] md:w-[60%] flex flex-col gap-8">
      <header className="flex items-center justify-center md:justify-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-medium text-muted-foreground select-none">
          G
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="font-heading text-xl font-medium">gardenmovie</span>
            <button
              type="button"
              aria-label={copied ? "Copied" : "Copy username"}
              onClick={handleCopy}
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
          <a
            href={PROFILE_LINK}
            target="_blank"
            rel="noreferrer"
            className="truncate text-sm text-muted-foreground hover:text-blue-500"
            title={PROFILE_LINK}
          >
            {PROFILE_LINK.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-4">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search links..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent pl-3 pr-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
              <LinkCard key={link.code} {...link} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No links match &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
