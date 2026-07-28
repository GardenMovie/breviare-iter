import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { fetchMyLinks, type LinkAnalytics } from "@/lib/links"

type LinksState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; links: LinkAnalytics[] }

export function useLinks() {
  const { accessToken } = useAuth()
  const [state, setState] = useState<LinksState>({ status: "loading" })

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    setState({ status: "loading" })
    fetchMyLinks(accessToken)
      .then((links) => {
        if (!cancelled) setState({ status: "done", links })
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
  }, [accessToken])

  const removeLink = (code: string) => {
    setState((current) =>
      current.status === "done"
        ? { ...current, links: current.links.filter((link) => link.code !== code) }
        : current
    )
  }

  return { ...state, removeLink }
}
