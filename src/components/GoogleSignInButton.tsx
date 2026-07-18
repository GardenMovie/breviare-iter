import { useEffect, useRef } from "react"
import { useGoogleIdentityServices } from "@/hooks/useGoogleIdentityServices"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void
}

export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const ready = useGoogleIdentityServices()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready || !containerRef.current || !window.google) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => onCredential(response.credential),
    })
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
      width: 320,
    })
  }, [ready, onCredential])

  return <div ref={containerRef} className="flex justify-center" />
}
