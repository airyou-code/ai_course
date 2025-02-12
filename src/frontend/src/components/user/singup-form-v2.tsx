// // FROM: https://www.shadcndesign.com/pro-blocks/sign-up

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Shield, User, Lock } from "lucide-react"

// export default function SignUp() {
//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">
//         {/* Left side - Features */}
//         <div className="space-y-6 lg:pr-6">
//           <div className="space-y-2">
//             <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
//               <img
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-11%20at%2013.29.22-xdjUmON7zBpxuTTu9qvlhNkpALAWR3.png"
//                 alt="Logo"
//                 className="w-8 h-8"
//               />
//             </div>
//             <h1 className="text-3xl font-bold">Start Your 30-Day Free Trial</h1>
//             <p className="text-muted-foreground">
//               Unlock premium tools to power up your workflow — no credit card required.
//             </p>
//           </div>

//           <div className="space-y-8">
//             <div className="flex gap-4">
//               <User className="w-6 h-6" />
//               <div>
//                 <h3 className="font-semibold">Seamless User Experience</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Streamline your workflow with an intuitive, user-friendly interface designed to boost productivity
//                   from day one.
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Shield className="w-6 h-6" />
//               <div>
//                 <h3 className="font-semibold">Ensure Compliance</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Easily meet industry regulations with automated compliance checks and up-to-date standards.
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-4">
//               <Lock className="w-6 h-6" />
//               <div>
//                 <h3 className="font-semibold">Built-In Security</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Rest easy with enterprise-level encryption and multi-factor authentication, safeguarding your
//                   sensitive information.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right side - Sign up form */}
//         <Card className="border-0 shadow-none lg:border lg:shadow-sm">
//           <CardContent className="space-y-4 pt-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">Name</Label>
//                 <Input id="firstName" placeholder="Name" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input id="lastName" placeholder="Last Name" />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" placeholder="Email" />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" placeholder="Password" />
//               <p className="text-sm text-muted-foreground">Minimum 8 characters.</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input id="confirmPassword" type="password" placeholder="Confirm Password" />
//             </div>

//             <Button className="w-full" size="lg">
//               Sign up
//             </Button>

//             <div className="text-center text-sm">
//               Already have an account?{" "}
//               <Link href="/sign-in" className="text-primary hover:underline">
//                 Sign in
//               </Link>
//             </div>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <Separator />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">OR</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <Button variant="outline" className="w-full">
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
//                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
//                 </svg>
//                 Google
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
//                 </svg>
//                 GitHub
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm5.144 14.5h-10.288c-.472 0-.856-.384-.856-.857v-7.286c0-.473.384-.857.856-.857h10.288c.472 0 .856.384.856.857v7.286c0 .473-.384.857-.856.857zm-5.144-7.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
//                 </svg>
//                 Apple
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

