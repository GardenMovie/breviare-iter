export function Navbar() {
  return (
    <nav className="border-b border-border px-8 py-2 flex justify-center">
      <div className="w-[82%] md:w-[60%]">
        <a
          href="http://localhost:3000/"
          className="text-2xl select-none"
          style={{ fontFamily: "'Alex Brush'" }}
        >
          Breviare
        </a>
      </div>
    </nav>
  )
}
