import { Card, CardContent } from "@/components/ui/card"

export function RegistrationComingSoon() {
  return (
    <div className="w-[90%] md:w-[40%] mb-14 flex flex-col gap-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Accounts are coming soon</h1>
        <p className="text-muted-foreground">
          Registration and link tracking aren't available yet. Check back later.
        </p>
      </div>
      <Card className="p-6">
        <CardContent className="text-center text-sm text-muted-foreground">
          In the meantime, you can still shorten links from the homepage.
        </CardContent>
      </Card>
    </div>
  )
}
