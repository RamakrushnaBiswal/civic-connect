"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { AdminDashboard } from "@/components/admin-dashboard"

const AUTH_KEY = "civic_admin_auth"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.name && parsed?.role) {
          setUser(parsed)
          setIsAuthenticated(true)
        }
      }
    } catch (err) {
      console.error('Failed to restore auth from localStorage', err)
    }
  }, [])

  const handleLogin = (userData: { name: string; role: string }) => {
    setUser(userData)
    setIsAuthenticated(true)
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(userData))
    } catch (err) {
      console.error('Failed to save auth to localStorage', err)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    try {
      localStorage.removeItem(AUTH_KEY)
    } catch (err) {
      console.error('Failed to remove auth from localStorage', err)
    }
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <AdminDashboard user={user} onLogout={handleLogout} />
}
