import { useState } from "react"
import { usePasswordResetConfirm } from "@/hooks/user"
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface ResetPasswordFormValues {
  password: string
  confirmPassword: string
}

export default function ResetPasswordForm() {
  const { t } = useTranslation();
  const { token = "" } = useParams();
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const passwordResetConfirm = usePasswordResetConfirm()

  const validationSchema = Yup.object({
    password: Yup.string().min(8, t("errorPasswordMin")).required(t("errorPasswordRequired")),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], t("errorPasswordsMatch")).required(t("errorConfirmPasswordRequired")),
  })

  const handleSubmit = async (values: ResetPasswordFormValues, { setSubmitting }: FormikHelpers<ResetPasswordFormValues>) => {
    setError(null)
    try {
      await passwordResetConfirm({
        token: token,
        new_password: values.password
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.nonFieldErrors?.[0] || t("resetPassword.error"))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    console.log("token: ", token)
    return <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{t("resetPassword.invalidLink", "Invalid or expired link")}</AlertDescription></Alert>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t("resetPassword.title", "Reset Password")}</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <>
            <Alert className="bg-green-50 text-green-700 border-green-200 mb-4"><CheckCircle2 className="h-4 w-4" /><AlertDescription>{t("resetPassword.success", "Password changed successfully!")}</AlertDescription></Alert>
            <Button asChild className="w-full mt-2">
              <a href="/">{t("resetPassword.toMain", "На главный экран")}</a>
            </Button>
          </>
        ) : (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
                <div className="space-y-2">
                  <Label htmlFor="password">{t("resetPassword.passwordLabel", "New Password")}</Label>
                  <Field as={Input} id="password" name="password" type="password" placeholder={t("resetPassword.passwordPlaceholder", "Enter new password")} />
                  <ErrorMessage name="password" component="div" className="text-sm text-red-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("resetPassword.confirmPasswordLabel", "Repeat Password")}</Label>
                  <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" placeholder={t("resetPassword.confirmPasswordPlaceholder", "Repeat new password")} />
                  <ErrorMessage name="confirmPassword" component="div" className="text-sm text-red-500" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? t("resetPassword.processing", "Processing...") : t("resetPassword.submit", "Change Password")}</Button>
                <div className="mt-2 text-center">
                  <a href="/" className="text-sm text-black underline">{t("resetPassword.toMain", "To main screen")}</a>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </CardContent>
    </Card>
  )
} 