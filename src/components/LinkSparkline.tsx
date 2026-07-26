import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useLinkAnalytics } from "@/hooks/use-link-analytics"

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

function formatDayLabel(day: string) {
  return new Date(`${day}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatDayTick(day: string) {
  return new Date(`${day}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

function niceYMax(maxClicks: number) {
  if (maxClicks <= 0) return 10
  return Math.ceil(maxClicks / 10) * 10
}

export function LinkSparkline({ code }: { code: string }) {
  const state = useLinkAnalytics(code)

  if (state.status === "loading") {
    return <div className="h-40 w-full" aria-hidden />
  }

  if (state.status === "error" || state.dailyClicks.every((d) => d.clicks === 0)) {
    return null
  }

  const maxClicks = Math.max(...state.dailyClicks.map((d) => d.clicks))
  const yMax = niceYMax(maxClicks)

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-40 w-full">
      <LineChart data={state.dailyClicks} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={formatDayTick}
        />
        <YAxis
          domain={[0, yMax]}
          tickCount={6}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={32}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              labelFormatter={(_, payload) => formatDayLabel(payload?.[0]?.payload?.day)}
            />
          }
        />
        <Line
          dataKey="clicks"
          type="monotone"
          stroke="var(--color-clicks)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
