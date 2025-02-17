"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/forms/submit-button"

export function SignUpWithCredentials() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const form = event.currentTarget
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        router.push("/")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input name="name" placeholder="Enter your name" type="text" required />
      <Input name="email" placeholder="Enter your email" type="email" required />
      <Input name="password" placeholder="Enter your password" type="password" required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <SubmitButton 
        title="Sign Up" 
        pendingTitle="Registering..." 
        size="lg" 
        classNames="rounded-full" 
        isLoading={loading} 
      />
    </form>
  )
}
