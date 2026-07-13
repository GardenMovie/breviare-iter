import { Navbar } from "@/components/Navbar"
import { ProfilePage } from "@/components/ProfilePage"
import { ShortenForm } from "@/components/ShortenForm"
import { SignIn } from "@/components/SignIn"
import { Tagline } from "@/components/Tagline"
import { Card, CardContent } from "@/components/ui/card"

export function App() {
  const isRegistration = window.location.pathname === "/registration"
  const isProfile = window.location.pathname === "/profile"

  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      <Navbar />
      <main
        className={
          isProfile
            ? "flex flex-1 flex-col"
            : "flex flex-1 items-center justify-center"
        }
      >
        {isProfile ? (
          <ProfilePage />
        ) : isRegistration ? (
          <SignIn />
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
