import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

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
  email: Yup.string().email("Неверный формат email").required("Email обязателен"),
  password: Yup.string().required("This field is required!"),
})

interface LoginFormValues {
  email: string
  password: string
}

interface ErrorsState {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const fetchUserData = useFetchUserData()

  // State из старой логики
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [profilErrors, setProfileErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })

  // Старый хендлер логина
  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setSubmitting(true)
    setProfileErrors({
      fieldErrors: {},
      nonFieldErrors: [],
    })
    setLoading(true)

    try {
      // Вызов авторизации
      await login({
        email: values.email,
        password: values.password,
      })
      // Получение данных пользователя
      await fetchUserData()

      // Редирект после успешного логина
      const redirectTo = (location.state as any)?.from?.pathname || "/"
      navigate(redirectTo)
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setProfileErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    } finally {
      setLoading(false)
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <Trans i18nKey="login.login">
              Login
            </Trans>
          </CardTitle>
          <CardDescription>
            <Trans i18nKey="login.description">
              Enter your username below to login.
            </Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik<LoginFormValues>
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {() => (
              <Form>
                <div className="flex flex-col gap-6">
                  {/* Email */}
                  <div className="grid gap-2">
                    <Label htmlFor="username">
                      <Trans i18nKey="login.email">
                        Email
                      </Trans>
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('login.emailPlaceholder', "Enter your email")}
                      required
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">
                        <Trans i18nKey="login.password">
                        Password
                        </Trans>
                      </Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        <Trans i18nKey="login.forgotPassword">
                        Forgot Password?
                        </Trans>
                      </a>
                    </div>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t('login.passwordPlaceholder', "Enter your password")}
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

                  {/* Error Message */}
                  {profilErrors.nonFieldErrors.length > 0 &&
                    profilErrors.nonFieldErrors.map((msg, idx) => (
                      <Alert key={idx} variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{msg}</AlertDescription>
                      </Alert>
                    ))
                  }

                  {/* Submit */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ?
                      <Trans i18nKey="login.processing">
                        Processing...
                      </Trans>
                      : 
                      <Trans i18nKey="login.login">
                      Login
                      </Trans>
                    }
                  </Button>

                  {/* Alternative Auth */}
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  <Trans i18nKey="login.noAccount">
                    Don&apos;t have an account?{" "}
                    <a href="/register" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </Trans>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
