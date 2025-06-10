"use client"

import { useState } from "react"
import { Formik, type FormikHelpers } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useUserState } from "@/hooks/user"
import { useChangePassword, useChangeUserData, useEmailChangeRequest, useEmailChange } from "@/hooks/user"
import { Trans, useTranslation } from "react-i18next"

// Типы для форм
interface ProfileFormValues {
  firstName: string
  lastName: string
  username: string
}

interface EmailFormValues {
  email: string
  verificationCode: string
}

interface PasswordFormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ErrorsState {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

export default function UserProfile() {
  const { t } = useTranslation()
  const { user: userData } = useUserState() || { user: { username: '', email: '' } }
  const changePassword = useChangePassword()
  const changeUserData = useChangeUserData()
  const emailChangeRequest = useEmailChangeRequest()
  const emailChange = useEmailChange()

  // Схемы валидации перенесены внутрь компонента для использования t()
  const profileSchema = Yup.object({
    firstName: Yup.string().required(t("userProfile.errors.firstNameRequired")),
    lastName: Yup.string().required(t("userProfile.errors.lastNameRequired")),
    username: Yup.string().required(t("userProfile.errors.usernameRequired")),
  })

  const emailSchema = Yup.object({
    email: Yup.string().email(t("userProfile.errors.invalidEmail")).required(t("userProfile.errors.emailRequired")),
    verificationCode: Yup.string()
      .length(6, t("userProfile.errors.verificationCodeLength"))
      .required(t("userProfile.errors.verificationCodeRequired")),
  })

  const passwordSchema = Yup.object({
    currentPassword: Yup.string().required(t("userProfile.errors.currentPasswordRequired")),
    newPassword: Yup.string().min(8, t("userProfile.errors.newPasswordMin")).required(t("userProfile.errors.newPasswordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], t("userProfile.errors.passwordsMustMatch"))
      .required(t("userProfile.errors.confirmPasswordRequired")),
  })

  // Состояния для режима редактирования
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [showVerificationField, setShowVerificationField] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Состояния для сообщений об успехе и ошибках
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [emailErrors, setEmailErrors] = useState<ErrorsState>({ fieldErrors: {}, nonFieldErrors: [] })
  const [profileErrors, setProfileErrors] = useState<ErrorsState>({ fieldErrors: {}, nonFieldErrors: [] })
  const [passwordErrors, setPasswordErrors] = useState<ErrorsState>({ fieldErrors: {}, nonFieldErrors: [] })

  // Начальные значения форм (также можно задать в файле переводов)
  const initialProfileValues: ProfileFormValues = {
    firstName: userData?.first_name || t("userProfile.default.firstName"),
    lastName: userData?.last_name || t("userProfile.default.lastName"),
    username: userData?.username || t("userProfile.default.username"),
  }

  const initialEmailValues: EmailFormValues = {
    email: userData?.email || t("userProfile.default.email"),
    verificationCode: "",
  }

  const initialPasswordValues: PasswordFormValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  // Обработчики API
  const handleUpdateProfile = async (
    values: ProfileFormValues,
    { setSubmitting }: FormikHelpers<ProfileFormValues>,
  ) => {
    try {
      setProfileErrors({ fieldErrors: {}, nonFieldErrors: [] })
      console.log("Updating profile:", values)
      await changeUserData({
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
      })
      setProfileSuccess(t("userProfile.profileUpdated"))
      setEditingProfile(false)
      setTimeout(() => setProfileSuccess(null), 3000)
    } catch (error: any) {
      const { fieldErrors, nonFieldErrors } = error
      setProfileErrors({ fieldErrors, nonFieldErrors })
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestEmailCode = async (email: string) => {
    try {
      setEmailErrors({ fieldErrors: {}, nonFieldErrors: [] })
      console.log("Requesting verification code for:", email)
      await emailChangeRequest(email)
      setShowVerificationField(true)
      setCountdown(20)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: any) {
      const { fieldErrors, nonFieldErrors } = error
      setEmailErrors({ fieldErrors, nonFieldErrors })
      console.log(error)
    }
  }

  const handleUpdateEmail = async (
    values: EmailFormValues,
    { setSubmitting, resetForm }: FormikHelpers<EmailFormValues>,
  ) => {
    try {
      setEmailErrors({ fieldErrors: {}, nonFieldErrors: [] })
      console.log("Updating email with verification:", values)
      await emailChange({ code: values.verificationCode })
      setEmailSuccess(t("userProfile.emailUpdated"))
      setEditingEmail(false)
      setShowVerificationField(false)
      resetForm({ values: { ...values, verificationCode: "" } })
      setTimeout(() => setEmailSuccess(null), 3000)
    } catch (error: any) {
      const { fieldErrors, nonFieldErrors } = error
      setEmailErrors({ fieldErrors, nonFieldErrors })
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdatePassword = async (
    values: PasswordFormValues,
    { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>,
  ) => {
    try {
      setPasswordErrors({ fieldErrors: {}, nonFieldErrors: [] })
      console.log("Updating password:", values)
      await changePassword({
        old_password: values.currentPassword,
        new_password: values.newPassword,
      })
      setPasswordSuccess(t("userProfile.passwordUpdated"))
      resetForm()
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (error: any) {
      const { fieldErrors, nonFieldErrors } = error
      setPasswordErrors({ fieldErrors, nonFieldErrors })
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      {/* Форма профиля */}
      <Card>
        <CardHeader>
          <CardTitle>{t("userProfile.profileTitle")}</CardTitle>
          <CardDescription>{t("userProfile.profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik initialValues={initialProfileValues} validationSchema={profileSchema} onSubmit={handleUpdateProfile}>
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {profileErrors.nonFieldErrors.length > 0 &&
                  profileErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{t(msg)}</AlertDescription>
                    </Alert>
                  ))
                }
                {profileSuccess && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{profileSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="firstName">{t("userProfile.firstName")}</Label>
                    {!editingProfile && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setEditingProfile(true)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input id="firstName" name="firstName" value={values.firstName} onChange={handleChange} disabled={!editingProfile} />
                  {errors.firstName && touched.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("userProfile.lastName")}</Label>
                  <Input id="lastName" name="lastName" value={values.lastName} onChange={handleChange} disabled={!editingProfile} />
                  {errors.lastName && touched.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">{t("userProfile.username")}</Label>
                  <Input id="username" name="username" value={values.username} onChange={handleChange} disabled={!editingProfile} />
                  {errors.username && touched.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>
                {editingProfile && (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? t("userProfile.updatingProfile") : t("userProfile.save")}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                      {t("userProfile.cancel")}
                    </Button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Форма изменения email */}
      <Card>
        <CardHeader>
          <CardTitle>{t("userProfile.emailTitle")}</CardTitle>
          <CardDescription>{t("userProfile.emailDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik initialValues={initialEmailValues} validationSchema={emailSchema} onSubmit={handleUpdateEmail}>
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {emailErrors.nonFieldErrors.length > 0 &&
                  emailErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{t(msg)}</AlertDescription>
                    </Alert>
                  ))
                }
                {emailSuccess && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{emailSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email">{t("userProfile.email")}</Label>
                    {!editingEmail && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setEditingEmail(true)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} disabled={!editingEmail} />
                  {errors.email && touched.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                {editingEmail && !showVerificationField && (
                  <Button type="button" onClick={() => handleRequestEmailCode(values.email)}>
                    {t("userProfile.getVerificationCode")}
                  </Button>
                )}
                {showVerificationField && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="verificationCode">{t("userProfile.verificationCode")}</Label>
                        {countdown > 0 ? (
                          <span className="text-sm text-gray-500">{countdown} {t("userProfile.seconds")}</span>
                        ) : (
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRequestEmailCode(values.email)}>
                            {t("userProfile.resendCode")}
                          </Button>
                        )}
                      </div>
                      <Input id="verificationCode" name="verificationCode" value={values.verificationCode} onChange={handleChange} placeholder={t("userProfile.verificationCodePlaceholder")} />
                      {errors.verificationCode && touched.verificationCode && (
                        <p className="text-sm text-red-500">{errors.verificationCode}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t("userProfile.updatingEmail") : t("userProfile.save")}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setEditingEmail(false); setShowVerificationField(false) }}>
                        {t("userProfile.cancel")}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Форма изменения пароля */}
      <Card>
        <CardHeader>
          <CardTitle>{t("userProfile.passwordTitle")}</CardTitle>
          <CardDescription>{t("userProfile.passwordDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik initialValues={initialPasswordValues} validationSchema={passwordSchema} onSubmit={handleUpdatePassword}>
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {passwordErrors.nonFieldErrors.length > 0 &&
                  passwordErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{t(msg)}</AlertDescription>
                    </Alert>
                  ))
                }
                {passwordSuccess && (
                  <Alert className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t("userProfile.currentPassword")}</Label>
                  <div className="relative">
                    <Input id="currentPassword" name="currentPassword" type={showPassword.current ? "text" : "password"} value={values.currentPassword} onChange={handleChange} />
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3" onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}>
                      {showPassword.current ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {errors.currentPassword && touched.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t("userProfile.newPassword")}</Label>
                  <div className="relative">
                    <Input id="newPassword" name="newPassword" type={showPassword.new ? "text" : "password"} value={values.newPassword} onChange={handleChange} />
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
                      {showPassword.new ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {errors.newPassword && touched.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("userProfile.confirmPassword")}</Label>
                  <div className="relative">
                    <Input id="confirmPassword" name="confirmPassword" type={showPassword.confirm ? "text" : "password"} value={values.confirmPassword} onChange={handleChange} />
                    <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
                      {showPassword.confirm ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("userProfile.updatingPassword") : t("userProfile.updatePassword")}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
