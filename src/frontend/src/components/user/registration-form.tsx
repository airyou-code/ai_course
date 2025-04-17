"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useRegisterRequest, useRegister } from "@/hooks/user"

// Types for our form values
interface EmailVerificationValues {
  email: string
}

interface RegistrationValues extends EmailVerificationValues {
  name: string
  username: string
  password: string
  confirmPassword: string
  verificationCode: string
}

// Validation schemas
const emailVerificationSchema = Yup.object({
  email: Yup.string().email("Неверный формат email").required("Email обязателен"),
})

const registrationSchema = Yup.object({
  name: Yup.string().required("Имя обязательно"),
  username: Yup.string().required("Логин обязателен"),
  email: Yup.string().email("Неверный формат email").required("Email обязателен"),
  password: Yup.string().min(8, "Пароль должен содержать минимум 8 символов").required("Пароль обязателен"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли должны совпадать")
    .required("Подтверждение пароля обязательно"),
  verificationCode: Yup.string()
    .length(6, "Код подтверждения должен содержать 6 символов")
    .required("Код подтверждения обязателен"),
})

export default function RegistrationForm() {
  const navigate = useNavigate()
  const registerRequest = useRegisterRequest()
  const register = useRegister()

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCount) => prevCount - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  // Функция для запуска таймера
  const startCountdown = () => {
    setCountdown(20) // 20 секунд
  }

  // Функция возвращения к первому шагу
  const handleBackToFirstStep = () => {
    setStep(1)
    setIsCodeSent(false)
  }

  // Первый шаг – запрос кода подтверждения
  const handleRequestCode = async (
    values: EmailVerificationValues,
    { setSubmitting }: FormikHelpers<EmailVerificationValues>,
  ) => {
    try {
      setError(null)
      console.log("Requesting verification code for:", values.email)
      await registerRequest(values.email)

      setEmail(values.email)
      setIsCodeSent(true)
      setStep(2)
      startCountdown()
    } catch (err) {
      if (err === "403 Forbidden")
        setError("Слижком частые попытки запросить код подтверждения. Пожалуйста, попробуйте позже.")
      else if (err === "400 Bad Request")
        setError("Пользователь с таким email уже зарегистрирован.")
      else
        setError("Ошибка при отправке кода подтверждения. Пожалуйста, попробуйте снова.")
    } finally {
      setSubmitting(false)
    }
  }

  // Второй шаг – завершение регистрации
  const handleRegister = async (values: RegistrationValues, { setSubmitting }: FormikHelpers<RegistrationValues>) => {
    try {
      setError(null)
      await register({
          email: values.email,
          username: values.username,
          code: values.verificationCode,
          password: values.password,
          first_name: values.name,
          last_name: values.name.split(" ")[1] || "",
      })
      window.location.href = '/';
      console.log("Registration successful!")
    } catch (err) {
      setError("Ошибка при регистрации. Пожалуйста, проверьте данные и попробуйте снова.")
    } finally {
      setSubmitting(false)
    }
  }

  // Request new verification code
  const handleResendCode = async () => {
    try {
      setError(null)
      // Placeholder for API call to resend verification code
      console.log("Resending verification code to:", email)
      startCountdown()

      await registerRequest(email)

      setIsCodeSent(true)
      startCountdown()
    } catch (err) {
      setCountdown(3)
      if (err === "403 Forbidden")
        setError("Слижком частые попытки запросить код подтверждения. Пожалуйста, попробуйте позже.")
      else if (err === "400 Bad Request")
        setError("Пользователь с таким email уже зарегистрирован.")
      else
        setError("Ошибка при повторной отправке кода. Пожалуйста, попробуйте снова.")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>
          {step === 1
            ? "Введите ваш email для получения кода подтверждения"
            : "Заполните данные для завершения регистрации"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 ? (
          <Formik
            key="step1"
            initialValues={{ email: email || "" }}
            validationSchema={emailVerificationSchema}
            onSubmit={handleRequestCode}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Отправка..." : "Получить код подтверждения"}
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => {setStep(2)}}>
                  {"У меня уже есть код подтверждения"}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            key="step2"
            initialValues={{
              name: "",
              username: "",
              email: email || "",
              password: "",
              confirmPassword: "",
              verificationCode: "",
            }}
            enableReinitialize={true}
            validationSchema={registrationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Field as={Input} id="name" name="name" placeholder="Иван Иванов" required />
                  <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Логин</Label>
                  <Field as={Input} id="username" name="username" placeholder="IvanIvanov" required />
                  <ErrorMessage name="username" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field as={Input} id="email" name="email" type="email" disabled={Boolean(email)} />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
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
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                  <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder="Подтвердите пароль" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="verificationCode">Код подтверждения</Label>
                    <div className="flex items-center">
                      {countdown > 0 && <span className="text-sm text-gray-500 mr-2">{countdown} сек</span>}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={countdown > 0}
                        className={`text-sm ${
                          countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Отправить код повторно
                      </button>
                    </div>
                  </div>
                  <Field as={Input} id="verificationCode" name="verificationCode" placeholder="A1B2C3" />
                  <ErrorMessage name="verificationCode" component="div" className="text-sm text-red-500" />
                </div>
                {isCodeSent && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span>Код подтверждения отправлен на ваш email</span>
                  </div>
                )}
                <div className="flex gap-4 w-full">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleBackToFirstStep}>
                    Назад
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {step === 1 ? 
          <p className="text-sm text-gray-500">
            Уже есть аккаунт?
            <a href="/auth" className="underline underline-offset-4">
              Войдите
            </a>
          </p>
        : <p className="text-sm text-gray-500">
          Шаг 2 из 2: Завершение регистрации
        </p>
        }
      </CardFooter>
    </Card>
  )
}
