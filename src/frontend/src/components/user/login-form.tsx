import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLogin, useFetchUserData } from "@/hooks/user"

// Схема валидации, аналогичная старому коду (заменяем email -> username)
const validationSchema = Yup.object().shape({
  username: Yup.string().required("This field is required!"),
  password: Yup.string().required("This field is required!"),
})

interface LoginFormValues {
  username: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const fetchUserData = useFetchUserData()

  // State из старой логики
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  // Старый хендлер логина
  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setSubmitting(true)
    setMessage("")
    setLoading(true)

    try {
      // Вызов авторизации
      await login({
        username: values.username,
        password: values.password,
      })
      // Получение данных пользователя
      await fetchUserData()

      // Редирект после успешного логина
      const redirectTo = (location.state as any)?.from?.pathname || "/"
      navigate(redirectTo)
    } catch (error) {
      let resMessage
      if (axios.isAxiosError(error)) {
        resMessage =
          error.response?.data?.message ||
          error.message ||
          error.toString()
      } else {
        resMessage = String(error)
      }
      setMessage(resMessage)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your username below to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <Formik<LoginFormValues>
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form>
                <div className="flex flex-col gap-6">
                  {/* Username */}
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Field
                      as={Input}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      required
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Processing..." : "Login"}
                  </Button>

                  {/* Error Message */}
                  {message && (
                    <div className="mt-4 text-sm text-red-500">
                      <p>{message}</p>
                    </div>
                  )}

                  {/* Alternative Auth */}
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
