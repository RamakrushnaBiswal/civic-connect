"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const handleLogin = (userData: { name: string; role: string }) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}
