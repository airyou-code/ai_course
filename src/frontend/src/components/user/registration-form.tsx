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
import { set } from "date-fns"
import { Trans, useTranslation } from 'react-i18next'
import { setCookie } from "@/utils/cookie"
import { LANGUAGE } from "@/config/cookies"

// Types for our form values
interface EmailVerificationValues {
  email: string
}

interface RegistrationValues extends EmailVerificationValues {
  // name: string
  // username: string
  password: string
  confirmPassword: string
  verificationCode: string
}

interface ErrorsState {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

export default function RegistrationForm() {
  const { t } = useTranslation();
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const registerRequest = useRegisterRequest()
  const register = useRegister()

  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })

  // Создаем схемы валидации внутри компонента с использованием t
  const emailVerificationSchema = Yup.object({
    email: Yup.string()
      .email(t("errorEmailFormat"))
      .required(t("errorEmailRequired")),
  })

  const registrationSchema = Yup.object({
    email: Yup.string()
      .email(t("errorEmailFormat"))
      .required(t("errorEmailRequired")),
    password: Yup.string()
      .min(8, t("errorPasswordMin"))
      .required(t("errorPasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("errorPasswordsMatch"))
      .required(t("errorConfirmPasswordRequired")),
    verificationCode: Yup.string()
      .length(6, t("errorCodeLength"))
      .required(t("errorCodeRequired")),
  })

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

  const resetErrors = () => {
    setErrors({
      fieldErrors: {},
      nonFieldErrors: [],
    });
  };

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
      resetErrors();
      console.log(t("registration.requestCode", { email: values.email }))
      await registerRequest(values.email)

      setEmail(values.email)
      setIsCodeSent(true)
      setStep(2)
      startCountdown()
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  // Второй шаг – завершение регистрации
  const handleRegister = async (values: RegistrationValues, { setSubmitting }: FormikHelpers<RegistrationValues>) => {
    try {
      resetErrors();
      await register({
          email: values.email,
          username: values.email,
          code: values.verificationCode,
          password: values.password,
          first_name: "",
          last_name: ""
      })
      window.location.href = '/';
      console.log(t("registration.success"))
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  // Request new verification code
  const handleResendCode = async () => {
    try {
      resetErrors();
      console.log(t("registration.resendCode", { email }))
      startCountdown()

      await registerRequest(email)

      setIsCodeSent(true)
      startCountdown()
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("registration.title")}</CardTitle>
        <CardDescription>
          {step === 1
            ? t("registration.step1Description")
            : t("registration.step2Description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errors.nonFieldErrors.length > 0 &&
          errors.nonFieldErrors.map((msg, idx) => (
            <Alert key={idx} variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{msg}</AlertDescription>
            </Alert>
          ))
        }

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
                  <Label htmlFor="email">{t("registration.emailLabel")}</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("registration.emailPlaceholder")}
                  />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("registration.sending") : t("registration.getCode")}
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => {setStep(2)}}>
                  {t("registration.alreadyHaveCode")}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            key="step2"
            initialValues={{
              // name: "",
              // username: "",
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
                  <Label htmlFor="email">{t("registration.emailLabel")}</Label>
                  <Field as={Input} id="email" name="email" type="email" disabled={Boolean(email)} />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t("registration.passwordLabel")}</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={t("registration.passwordPlaceholder")}
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
                  <Label htmlFor="confirmPassword">{t("registration.confirmPasswordLabel")}</Label>
                  <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder={t("registration.confirmPasswordPlaceholder")} />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="verificationCode">{t("registration.verificationCodeLabel")}</Label>
                    <div className="flex items-center">
                      {countdown > 0 && <span className="text-sm text-gray-500 mr-2">{countdown} {t("registration.seconds")}</span>}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={countdown > 0}
                        className={`text-sm ${
                          countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {t("registration.resendCode")}
                      </button>
                    </div>
                  </div>
                  <Field as={Input} id="verificationCode" name="verificationCode" placeholder={t("registration.verificationCodePlaceholder")} />
                  <ErrorMessage name="verificationCode" component="div" className="text-sm text-red-500" />
                </div>
                {isCodeSent && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span>{t("registration.codeSent")}</span>
                  </div>
                )}
                <div className="flex gap-4 w-full">
                  <Button type="button" variant="outline" className="flex-1" onClick={handleBackToFirstStep}>
                    {t("registration.back")}
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? t("registration.registering") : t("registration.register")}
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
            <Trans i18nKey="registration.alreadyAccount">
              Уже есть аккаунт?
              <a href="/auth" className="underline underline-offset-4">Войдите</a>
            </Trans>
          </p>
        : <p className="text-sm text-gray-500">
          {t("registration.step2Footer")}
        </p>
        }
      </CardFooter>
      <div className="flex justify-center mb-4 space-x-2">
        <Button
          variant={i18n.language === "ru" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            i18n.changeLanguage("ru");
            setCookie(LANGUAGE, "ru", 365);
          }}
          className="w-12"
        >
          RU
        </Button>
        <Button
          variant={i18n.language === "en" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            i18n.changeLanguage("en");
            setCookie(LANGUAGE, "en", 365);
          }}
          className="w-12"
        >
          EN
        </Button>
      </div>
    </Card>
  )
}
