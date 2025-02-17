"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { SubmitButton } from "@/components/forms/submit-button"
import { loginWithCredentials } from "@/app/api/auth/login"

export function LoginWithCredentials() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const form = event.currentTarget
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value

    const result = await loginWithCredentials(email, password)

    if (result?.error) {
      setError(result.error)
    } else {
      router.push("/")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input name="email" placeholder="Enter your email" type="email" required />
      <Input name="password" placeholder="Enter your password" type="password" required />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <SubmitButton 
        title="Log in" 
        pendingTitle="Logging in..." 
        size="lg" 
        classNames="rounded-full" 
        isLoading={loading} 
      />
    </form>
  )
}
