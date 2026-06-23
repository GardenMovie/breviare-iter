import { useEffect, useState } from "react"

const SCRIPT_SRC = "https://accounts.google.com/gsi/client"

let loadPromise: Promise<void> | null = null

function loadGoogleIdentityServices(): Promise<void> {
  if (loadPromise) return loadPromise
  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"))
    document.head.appendChild(script)
  })
  return loadPromise
}

export function useGoogleIdentityServices() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadGoogleIdentityServices()
      .then(() => setReady(true))
      .catch(() => setReady(false))
  }, [])

  return ready
}
