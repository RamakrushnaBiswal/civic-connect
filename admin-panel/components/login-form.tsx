"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Building2 } from "lucide-react"

interface LoginFormProps {
  onLogin: (user: { name: string; role: string }) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      if (email=="admin@gmail.com" && password=="admin123") {
        onLogin({
          name: email.split("@")[0],
          role: "Administrator",
        })
      } else {
        alert("Invalid email or password")
        setEmail("")
        setPassword("")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="font-serif text-2xl">Municipal Admin Portal</CardTitle>
          <CardDescription>
            Sign in with your administrator credentials to access the complaint management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-sm text-muted-foreground text-center">
            <p>username: admin@gmail.com</p>
            <p>password: admin123</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Shield className="mr-2 h-4 w-4" />
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
