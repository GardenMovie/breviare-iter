import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between z-50 bg-background/30 backdrop-blur">
      <div className="w-[80%] md:w-[60%] flex items-center justify-between mx-auto">
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
          className="px-2 py-0.5  text-2xl select-none hover:text-blue-500 hover:bg-transparent h-auto"
          style={{ fontFamily: "'Alex Brush'" }}
        >
          Breviare
        </Button>
        {user ? (
          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => (window.location.href = "/registration")}>
            Sign in
          </Button>
        )}
      </div>
    </nav>
  )
}
