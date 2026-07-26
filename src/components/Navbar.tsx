import { LogIn, LogOut, Link as LinkIcon, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { user, loading, signOut } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/30 backdrop-blur">
      <nav className="flex max-w-6xl mx-auto h-14 py-2.5 px-10 items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          asChild
          className="w-auto px-3 h-full"
          aria-label="Home"
        >
          <a
            href="/"
            className="text-muted-foreground hover:text-primary flex items-center"
            style={{ fontFamily: "'Alex Brush', cursive", fontSize: "1.4rem" }}
            title="Home"
          >
            Breviare
          </a>
        </Button>
        {/* Desktop links */}
        <div className="hidden h-full sm:flex gap-3 text-sm text-muted-foreground">
          {loading ? (
            <Button
              variant="outline"
              size="icon"
              disabled
              aria-label="Loading"
              className="w-auto h-full aspect-square"
            >
              <User className="size-1/2 animate-pulse" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-auto h-full aspect-square"
                  aria-label="Profile"
                >
                  <User className="size-1/2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => window.location.href = "/me"}
                >
                  <User />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}/u/${user.username ?? ""}`
                    )
                  }
                >
                  <LinkIcon />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut()}
                >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="icon"
              aria-label="Sign in"
              title="Sign in"
              className="w-auto h-full aspect-square"
              onClick={() => window.location.href = "/registration"}
            >
              <LogIn className="size-1/2" />
            </Button>
          )}
        </div>
        {/* <ThemeToggle /> */}
      </nav>
    </header>
  )
}
