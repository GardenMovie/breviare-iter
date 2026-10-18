import { ArrowUpRight, BarChart2, Database, Globe, KeyRound, Link2, Server, ShieldCheck } from "lucide-react"

export function About() {
  return (
    <div className="w-[90%] md:w-[60%] max-w-3xl mx-auto py-10 space-y-9 self-start">
      {/* Hero */}
      <div className="space-y-3 border-b pb-6">
        <h1 className="text-6xl leading-none flex items-baseline gap-2">
          <span className="text-4xl">What is</span>
          <span
            className="text-blue-500"
            style={{ fontFamily: "'Alex Brush', cursive" }}
          >
            Breviare
          </span>
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          A URL shortener. Turn a long link into a short one in seconds, no account
          required, or sign in to claim a username, track clicks and manage your links.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The name comes from Latin: <span className="italic">breviare</span>, to shorten.
        </p>
      </div>

      {/* What you can do */}
      <div className="space-y-4 pl-4 border-l-2 border-emerald-400 dark:border-emerald-600">
        <h2 className="text-2xl font-semibold tracking-tight">What you can do</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <Link2 className="size-4 mt-0.5 shrink-0 text-lime-500" />
            <div>
              <p className="text-sm font-medium">Shorten</p>
              <p className="text-sm text-muted-foreground">
                Paste a link on the landing page and copy the short version. No sign-up.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <ArrowUpRight className="size-4 mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Claim a username</p>
              <p className="text-sm text-muted-foreground">
                Sign in with Google and pick a username. It doubles as your vanity link,{" "}
                <span className="font-mono">/u/&lt;username&gt;</span>.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <BarChart2 className="size-4 mt-0.5 shrink-0 text-cyan-500" />
            <div>
              <p className="text-sm font-medium">Track clicks</p>
              <p className="text-sm text-muted-foreground">
                Your profile lists every link with a 7-day click sparkline.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <ShieldCheck className="size-4 mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-sm font-medium">Stay in control</p>
              <p className="text-sm text-muted-foreground">
                Delete any of your links whenever you like, with a confirmation first.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="space-y-3 pl-4 border-l-2 border-rose-400 dark:border-rose-600">
        <h2 className="text-2xl font-semibold tracking-tight">Keeping links safe</h2>
        <p className="text-muted-foreground leading-relaxed">
          Every submitted URL goes through a chain of checks before a short link is created:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
          <li>Only allowed schemes are accepted.</li>
          <li>Links pointing back at Breviare itself are rejected, so nobody can build a redirect loop.</li>
          <li>Known-bad domains are caught by a local blocklist.</li>
          <li>Whatever remains is checked against Google Safe Browsing. If that service is unreachable the check fails open, so an outage there never stops people from shortening links.</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Requests are also rate limited per IP, and short codes skip look-alike characters
          (<span className="font-mono">0 O 1 l I</span>) so they're easy to read and type.
        </p>
      </div>

      {/* Analytics */}
      <div className="space-y-3 pl-4 border-l-2 border-amber-400 dark:border-amber-600">
        <h2 className="text-2xl font-semibold tracking-tight">How clicks are counted</h2>
        <p className="text-muted-foreground leading-relaxed">
          Each click is recorded as it happens, then a nightly job rolls them up into daily totals.
          The sparklines on your profile read from those totals, so loading a week of history stays fast.
        </p>
      </div>

      {/* Stack */}
      <div className="space-y-4 pl-4 border-l-2 border-cyan-400 dark:border-cyan-600">
        <h2 className="text-2xl font-semibold tracking-tight">Stack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <Globe className="size-4 mt-0.5 shrink-0 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Frontend</p>
              <p className="text-sm text-muted-foreground">
                React 19, TypeScript, Vite, Tailwind CSS and shadcn/ui, with Recharts for the sparklines. Hosted on Vercel.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <Server className="size-4 mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-sm font-medium">Backend</p>
              <p className="text-sm text-muted-foreground">
                Spring Boot 3 on Java 21, with Spring Security and JPA. Handles links, auth, redirects and analytics.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <Database className="size-4 mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Database</p>
              <p className="text-sm text-muted-foreground">
                Postgres, with Flyway migrations tracking every schema change.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/40">
            <KeyRound className="size-4 mt-0.5 shrink-0 text-lime-500" />
            <div>
              <p className="text-sm font-medium">Auth</p>
              <p className="text-sm text-muted-foreground">
                Google sign-in, short-lived JWT access tokens and a refresh token in an httpOnly cookie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment */}
      <div className="space-y-3 pl-4 border-l-2 border-lime-400 dark:border-lime-600">
        <h2 className="text-2xl font-semibold tracking-tight">Deployment</h2>
        <p className="text-muted-foreground leading-relaxed">
          The backend runs as a systemd service on EC2. A GitHub Actions pipeline backs up the
          running JAR, ships the new one, and polls a health endpoint. If the check fails, it rolls
          back to the previous version automatically.
        </p>
      </div>

      {/* Why I built it */}
      <div className="space-y-3 pl-4 border-l-2 border-violet-400 dark:border-violet-600">
        <h2 className="text-2xl font-semibold tracking-tight">Why I built it</h2>
        <p className="text-muted-foreground leading-relaxed">
          I'd heard that a link shortener is the two-sum of system design, the classic first problem everyone
          meets. That was enough to get me to build one.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          I didn't want to stop at the basic version, though, so I added accounts and click analytics for a
          little flavor.
        </p>
      </div>

      {/* LinkedIn */}
      <div className="space-y-3 pl-4 border-l-2 border-blue-400 dark:border-blue-600">
        <h2 className="text-2xl font-semibold tracking-tight">More on this</h2>
        <p className="text-muted-foreground leading-relaxed">
          Want to learn more about the decisions behind this project? I posted about it on LinkedIn.
        </p>
        <a
          href="https://www.linkedin.com/in/dody-gallerani"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:underline underline-offset-2"
        >
          <Link2 className="size-4" />
          Find me on LinkedIn
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
