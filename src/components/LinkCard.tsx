import { Check, Copy, Trash2 } from "lucide-react"
import { useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

export type LinkCardProps = {
  url: string
  code: string
  data: { day: string; visits: number }[]
}

export function LinkCard({ url, code, data }: LinkCardProps) {
  const total = data.reduce((sum, d) => sum + d.visits, 0)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card className="bg-[linear-gradient(170deg,var(--background)_70%,--theme(--color-zinc-200/40%))]">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <button
              type="button"
              aria-label={copied ? "Copied" : "Copy code"}
              onClick={handleCopy}
              className="group flex shrink-0 items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <code className="font-mono text-base font-semibold">
                /{code}
              </code>
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
            <span className="shrink-0 fontfont-semibold text-muted-foreground">&rarr;</span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="truncate font-semibold text-foreground hover:text-blue-500"
              title={url}
            >
              {url.replace(/^https?:\/\//, "")}
            </a>
          </div>
          <button
            type="button"
            aria-label="Delete link"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-medium text-foreground">Last 7 days</span>
            <span className="text-xs font-medium text-foreground">
              {total.toLocaleString()} visits
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
            >
              <CartesianGrid
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                dy={4}
              />
              <YAxis
                width={28}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--popover-foreground)",
                  fontSize: 14,
                  padding: "2px 8px",
                }}
                labelFormatter={() => ""}
                itemStyle={{
                  color: "var(--popover-foreground)",
                  padding: 0,
                }}
                separator=""
                formatter={(value: number) => [`${value} visits`, ""]}
              />
              <Line
                type="linear"
                dataKey="visits"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
