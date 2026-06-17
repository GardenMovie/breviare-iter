import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-center z-50 bg-background/30 backdrop-blur">
      <div className="w-[80%] md:w-[60%]">
        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
          className="px-2 py-0.5  text-2xl select-none hover:text-blue-500 hover:bg-transparent h-auto"
          style={{ fontFamily: "'Alex Brush'" }}
        >
          Breviare
        </Button>
      </div>
    </nav>
  )
}
