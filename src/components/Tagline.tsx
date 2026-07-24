import { useAuth } from "@/hooks/use-auth"

export function Tagline() {
  const { user } = useAuth()
  return (
    <div className="flex flex-col gap-2 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        Shorten. Share.{" "}
        {user ? (
          <a href="/u/me" className="text-blue-500 hover:text-blue-500/80">
            Track! </a>)
        :
        (<a href="/registration" className="text-blue-500 hover:text-blue-500/80">
          Track? </a>)
        }
      </h1>
      <p className="text-muted-foreground">
        Turn long links into short ones in seconds.
      </p>
    </div>
  )
}
