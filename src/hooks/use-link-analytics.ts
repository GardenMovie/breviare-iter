import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { fetchLinkAnalytics, type DailyClicks } from "@/lib/links"

type AnalyticsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; dailyClicks: DailyClicks[] }

export function useLinkAnalytics(code: string) {
  const { accessToken } = useAuth()
  const [state, setState] = useState<AnalyticsState>({ status: "loading" })

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setState({ status: "loading" })
    fetchLinkAnalytics(code, accessToken)
      .then((dailyClicks) => {
        if (!cancelled) setState({ status: "done", dailyClicks })
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Something went wrong",
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [accessToken, code])

  return state
}
