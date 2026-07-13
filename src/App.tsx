import { Navbar } from "@/components/Navbar"
import { ShortenForm } from "@/components/ShortenForm"
import { RegistrationComingSoon } from "@/components/RegistrationComingSoon"
import { Tagline } from "@/components/Tagline"
import { UnderConstruction } from "@/components/UnderConstruction"
import { Card, CardContent } from "@/components/ui/card"

export function App() {
  if (import.meta.env.VITE_UNDER_CONSTRUCTION === "true") {
    return <UnderConstruction />
  }

  const isRegistration = window.location.pathname === "/registration"

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        {isRegistration ? (
          <RegistrationComingSoon />
        ) : (
          <div className="w-[80%] md:w-[40%] mb-14 flex flex-col gap-10">
            <Tagline />
            <Card>
              <CardContent>
                <ShortenForm />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
