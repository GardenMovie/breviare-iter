export function UnderConstruction() {
  return (
    <div className="min-h-svh bg-background text-foreground flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div
        className="text-6xl select-none"
        style={{ fontFamily: "'Alex Brush'" }}
      >
        Breviare
      </div>
      <div className="text-5xl">🚧</div>
      <h1 className="text-2xl font-semibold">work in progress</h1>
      <p className="text-muted-foreground ">
        Midterms have not been kind to me, check back in a few days
      </p>
    </div>
  )
}
