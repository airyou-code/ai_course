import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Trans, useTranslation } from 'react-i18next'
import { usePasswordResetRequest } from "@/hooks/user"

// TODO: импортировать хуки для forgot password, когда появятся
// import { useForgotPasswordRequest, useForgotPasswordConfirm } from "@/hooks/user"

interface EmailStepValues {
  email: string
}

interface ResetStepValues extends EmailStepValues {
  code: string
  password: string
  confirmPassword: string
}

interface ErrorsState {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

export default function ForgotPasswordForm() {
  const { t } = useTranslation();
  const passwordResetRequest = usePasswordResetRequest();
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })

  // Валидация
  const emailSchema = Yup.object({
    email: Yup.string().email(t("errorEmailFormat")).required(t("errorEmailRequired")),
  })
  const resetSchema = Yup.object({
    email: Yup.string().email(t("errorEmailFormat")).required(t("errorEmailRequired")),
    code: Yup.string().length(6, t("errorCodeLength")).required(t("errorCodeRequired")),
    password: Yup.string().min(8, t("errorPasswordMin")).required(t("errorPasswordRequired")),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], t("errorPasswordsMatch")).required(t("errorConfirmPasswordRequired")),
  })

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => { if (timer) clearInterval(timer) }
  }, [countdown])

  const startCountdown = () => setCountdown(20)
  const resetErrors = () => setErrors({ fieldErrors: {}, nonFieldErrors: [] })
  const handleBack = () => { setStep(1); setIsCodeSent(false) }

  const handleRequestCode = async (values: EmailStepValues, { setSubmitting }: FormikHelpers<EmailStepValues>) => {
    try {
      resetErrors()
      await passwordResetRequest(values.email)
      setEmail(values.email)
      setIsCodeSent(true)
      setStep(2)
      startCountdown()
    } catch (error: any) {
      setErrors(error)
    } finally {
      setSubmitting(false)
    }
  }

  // TODO: заменить на реальный API вызов
  const handleReset = async (values: ResetStepValues, { setSubmitting }: FormikHelpers<ResetStepValues>) => {
    try {
      resetErrors()
      // await useForgotPasswordConfirm({ ...values })
      setStep(1)
      setIsCodeSent(false)
      setEmail("")
      // window.location.href = '/auth';
    } catch (error: any) {
      setErrors({ fieldErrors: {}, nonFieldErrors: [t("forgot.errorReset")] })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("forgot.title", "Восстановление пароля")}</CardTitle>
        <CardDescription>
          {step === 1
            ? t("forgot.step1Description", "Введите email для восстановления пароля")
            : t("forgot.step2Description", "Письмо с инструкцией отправлено на email")}
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
            validationSchema={emailSchema}
            onSubmit={handleRequestCode}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("forgot.emailLabel", "Email")}</Label>
                  <Field as={Input} id="email" name="email" type="email" placeholder={t("forgot.emailPlaceholder", "Введите email")} />
                  <ErrorMessage name="email" component="div" className="text-sm text-red-500" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("forgot.sending", "Отправка...") : t("forgot.getCode", "Получить код")}
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Alert className="bg-green-50 text-green-700 border-green-200 mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{t("forgot.sentMessage", "Письмо с инструкцией отправлено на email")}</AlertDescription>
            </Alert>
            <Button asChild className="w-full">
              <a href="/">{t("forgot.toMain", "На главный экран")}</a>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          <Trans i18nKey="forgot.remembered">Вспомнили пароль? <a href="/auth" className="underline underline-offset-4">Войти</a></Trans>
        </p>
      </CardFooter>
    </Card>
  )
} 