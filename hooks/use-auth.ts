"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

// Define the User type
type User = {
  id: string
  name?: string
  email: string
  avatar?: string
}

// Define the AuthContext type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  confirmSignUp: (email: string, code: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>
  signInWithSocial: (provider: "google" | "apple") => Promise<void>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would be replaced with actual AWS Cognito code
        // For now, we'll check localStorage for demo purposes
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Authentication error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual AWS Cognito code
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: "user-123",
        name: "Demo User",
        email: email,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "Signed in successfully",
        description: "Welcome back to Virtual Pet Sanctuary!",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with social provider
  const signInWithSocial = async (provider: "google" | "apple") => {
    setIsLoading(true)
    try {
      // This would be replaced with actual social auth code
      // For demo purposes, we'll simulate a successful login
      const mockUser = {
        id: `user-${provider}-${Date.now()}`,
        name: provider === "google" ? "Google User" : "Apple User",
        email: `${provider}user@example.com`,
        avatar: "/placeholder.svg?height=40&width=40",
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      toast({
        title: "Signed in successfully",
        description: `Welcome to Virtual Pet Sanctuary via ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      toast({
        variant: "destructive",
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign in failed`,
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual AWS Cognito code
      // For demo purposes, we'll simulate a successful registration

      toast({
        title: "Account created",
        description: "Please check your email for a verification code.",
      })

      router.push("/auth/confirm?email=" + encodeURIComponent(email))
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "Please try again with a different email.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Confirm sign up function
  const confirmSignUp = async (email: string, code: string) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual AWS Cognito code
      // For demo purposes, we'll simulate a successful confirmation

      toast({
        title: "Email verified",
        description: "Your account has been verified. You can now sign in.",
      })

      router.push("/auth/login")
    } catch (error) {
      console.error("Confirmation error:", error)
      toast({
        variant: "destructive",
        title: "Confirmation failed",
        description: "Please check your code and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sign out function
  const signOut = () => {
    // This would be replaced with actual AWS Cognito code
    setUser(null)
    localStorage.removeItem("user")

    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })

    router.push("/")
  }

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual AWS Cognito code

      toast({
        title: "Reset code sent",
        description: "Please check your email for a password reset code.",
      })

      router.push("/auth/reset-password?email=" + encodeURIComponent(email))
    } catch (error) {
      console.error("Forgot password error:", error)
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "Please check your email and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    setIsLoading(true)
    try {
      // This would be replaced with actual AWS Cognito code

      toast({
        title: "Password reset",
        description: "Your password has been reset successfully. You can now sign in.",
      })

      router.push("/auth/login")
    } catch (error) {
      console.error("Reset password error:", error)
      toast({
        variant: "destructive",
        title: "Reset failed",
        description: "Please check your code and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create the auth value object
  const authValue: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    forgotPassword,
    resetPassword,
    signInWithSocial,
  }

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

// Create a hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

