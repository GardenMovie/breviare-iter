import { About } from "@/components/About"
import { Navbar } from "@/components/Navbar"
import { Profile } from "@/components/Profile"
import { ShortenForm } from "@/components/ShortenForm"
import { SignIn } from "@/components/SignIn"
import { Tagline } from "@/components/Tagline"
import { UnderConstruction } from "@/components/UnderConstruction"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function App() {
  const { user, loading } = useAuth()

  if (import.meta.env.VITE_UNDER_CONSTRUCTION === "true") {
    return <UnderConstruction />
  }

  const pathname = window.location.pathname
  const isRegistration = pathname === "/registration"
  const isProfile = pathname === "/me"
  const isAbout = pathname === "/about"

  const renderMain = () => {
    if (isAbout) return <About />

    if (isRegistration) return <SignIn />

    if (isProfile) {
      if (loading) return null
      if (!user) {
        window.location.href = "/registration"
        return null
      }
      return <Profile />
    }

    return (
      <div className="w-[80%] md:w-[40%] mb-14 flex flex-col gap-10">
        <Tagline />
        <Card>
          <CardContent>
            <ShortenForm />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col pt-14">
      <Navbar />
      <main className="flex flex-1 items-center justify-center py-6">{renderMain()}</main>
    </div>
  )
}

export default App
