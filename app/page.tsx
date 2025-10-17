"use client"

import { useEffect, useState } from "react"
import LoginForm from "@/components/login-form"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedSeller = localStorage.getItem("seller")
    if (storedSeller) {
      setSeller(JSON.parse(storedSeller))
    }
    setLoading(false)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!seller) {
    return <LoginForm onLoginSuccess={setSeller} />
  }

  return <Dashboard seller={seller} onLogout={() => setSeller(null)} />
}
