"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary" | "destructive" | "ghost"
}

export function Spinner({ size = "md", variant = "default", className, ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const variantClasses = {
    default: "text-primary",
    secondary: "text-secondary",
    destructive: "text-destructive",
    ghost: "text-muted-foreground",
  }

  return (
    <div className={cn("animate-spin", sizeClasses[size], variantClasses[variant], className)} {...props}>
      <Loader2 className="h-full w-full" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

interface CircularLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary" | "destructive" | "ghost"
}

export function CircularLoader({ size = "md", variant = "default", className, ...props }: CircularLoaderProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const variantClasses = {
    default: "text-primary",
    secondary: "text-secondary",
    destructive: "text-destructive",
    ghost: "text-muted-foreground",
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)} {...props}>
      <svg className={cn("animate-spin absolute inset-0", variantClasses[variant])} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  )
}

interface ProgressLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  indeterminate?: boolean
  showValue?: boolean
  variant?: "default" | "secondary" | "destructive" | "ghost"
}

export function ProgressLoader({
  value = 0,
  indeterminate = false,
  showValue = false,
  variant = "default",
  className,
  ...props
}: ProgressLoaderProps) {
  const [progress, setProgress] = React.useState(value)

  React.useEffect(() => {
    if (indeterminate) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + 5
          if (newValue >= 100) {
            return 0
          }
          return newValue
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      setProgress(value)
    }
  }, [indeterminate, value])

  const variantClasses = {
    default: "",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
    ghost: "bg-muted",
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Progress value={progress} className={cn(variantClasses[variant])} />
      {showValue && <p className="text-sm text-muted-foreground text-right">{Math.round(progress)}%</p>}
    </div>
  )
}

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "list" | "table"
  count?: number
}

export function SkeletonLoader({ variant = "default", count = 1, className, ...props }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card":
        return (
          <Card className="w-full">
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-10 bg-muted rounded animate-pulse w-1/4 mt-4" />
            </CardContent>
          </Card>
        )
      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-4 flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )
      case "table":
        return (
          <div className="border rounded-md">
            <div className="h-10 border-b bg-muted/5 flex items-center px-4">
              <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            </div>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-16 border-b last:border-0 flex items-center px-4 space-x-4">
                <div className="h-4 bg-muted rounded animate-pulse w-1/6" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="h-5 bg-muted rounded animate-pulse w-full" />
            ))}
          </div>
        )
    }
  }

  return (
    <div className={cn(className)} {...props}>
      {renderSkeleton()}
    </div>
  )
}

export function LoadingOverlay({
  message = "Loading...",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { message?: string }) {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      <CircularLoader size="lg" />
      {message && <p className="text-lg font-medium mt-4">{message}</p>}
    </div>
  )
}

export function LoadingButton({
  loading = false,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "h-10 py-2 px-4",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}

