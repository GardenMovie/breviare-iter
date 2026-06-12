import { Navbar } from "@/components/Navbar"
import { ShortenForm } from "@/components/ShortenForm"
import { LookupForm } from "@/components/LookupForm"

export function App() {
  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="w-[80%] md:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-14">
          <ShortenForm />
          <div className="md:border-l md:border-border md:pl-16">
            <LookupForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
