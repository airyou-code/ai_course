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

// Схемы валидации
const profileSchema = Yup.object({
  firstName: Yup.string().required("Имя обязательно"),
  lastName: Yup.string().required("Фамилия обязательна"),
  username: Yup.string().required("Логин обязателен"),
})

const emailSchema = Yup.object({
  email: Yup.string().email("Неверный формат email").required("Email обязателен"),
  verificationCode: Yup.string()
    .length(6, "Код подтверждения должен содержать 6 символов")
    .required("Код подтверждения обязателен"),
})

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Текущий пароль обязателен"),
  newPassword: Yup.string().min(8, "Пароль должен содержать минимум 8 символов").required("Новый пароль обязателен"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Пароли должны совпадать")
    .required("Подтверждение пароля обязательно"),
})

export default function UserProfile() {
  // Состояния для отслеживания режима редактирования
  const { user: userData } = useUserState() || { user: { username: '', email: '' } };
  const changePassword = useChangePassword()
  const changeUserData = useChangeUserData()
  const emailChangeRequest = useEmailChangeRequest()
  const emailChange = useEmailChange()

  const [editingProfile, setEditingProfile] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [showVerificationField, setShowVerificationField] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Состояния для сообщений
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [emailErrors, setEmailErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })
  const [profilErrors, setProfileErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })
  const [passwordErrors, setPasswordErrors] = useState<ErrorsState>({
    fieldErrors: {},
    nonFieldErrors: [],
  })

  // Начальные значения форм
  const initialProfileValues: ProfileFormValues = {
    firstName: userData?.first_name || "Иван",
    lastName: userData?.last_name || "Иванов",
    username: userData?.username || "ivan123",
  }

  const initialEmailValues: EmailFormValues = {
    email: userData?.email || "ivan@example.com",
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
      setProfileErrors({
        fieldErrors: {},
        nonFieldErrors: [],
      })
      // Имитация API запроса
      console.log("Updating profile:", values)
      await changeUserData({
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
      })

      setProfileSuccess("Профиль успешно обновлен")
      setEditingProfile(false)

      // Через 3 секунды скрываем сообщение об успехе
      setTimeout(() => setProfileSuccess(null), 3000)
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setProfileErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRequestEmailCode = async (email: string) => {
    try {
      setEmailErrors({
        fieldErrors: {},
        nonFieldErrors: [],
      })
      // Имитация API запроса
      console.log("Requesting verification code for:", email)
      await emailChangeRequest(email)

      setShowVerificationField(true)
      // Запускаем таймер для повторной отправки кода
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
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setEmailErrors({ fieldErrors, nonFieldErrors });
      console.log(error)
    }
  }

  const handleUpdateEmail = async (
    values: EmailFormValues,
    { setSubmitting, resetForm }: FormikHelpers<EmailFormValues>,
  ) => {
    try {
      setEmailErrors({
        fieldErrors: {},
        nonFieldErrors: [],
      })
      // Имитация API запроса
      console.log("Updating email with verification:", values)
      await emailChange({
        code: values.verificationCode,
      })

      setEmailSuccess("Email успешно обновлен")
      setEditingEmail(false)
      setShowVerificationField(false)
      resetForm({ values: { ...values, verificationCode: "" } })

      // Через 3 секунды скрываем сообщение об успехе
      setTimeout(() => setEmailSuccess(null), 3000)
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setEmailErrors({ fieldErrors, nonFieldErrors });
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
      setPasswordErrors({
        fieldErrors: {},
        nonFieldErrors: [],
      })
      // Имитация API запроса
      console.log("Updating password:", values)
      await changePassword({
        old_password: values.currentPassword,
        new_password: values.newPassword,
      })

      setPasswordSuccess("Пароль успешно обновлен")
      resetForm()

      // Через 3 секунды скрываем сообщение об успехе
      setTimeout(() => setPasswordSuccess(null), 3000)
    } catch (error: any) {
      const { status, fieldErrors, nonFieldErrors }: {
        status: number;
        fieldErrors: Record<string, string[]>;
        nonFieldErrors: string[];
      } = error;
      setPasswordErrors({ fieldErrors, nonFieldErrors });
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
          <CardTitle>Профиль</CardTitle>
          <CardDescription>Основная информация о вашем профиле</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik initialValues={initialProfileValues} validationSchema={profileSchema} onSubmit={handleUpdateProfile}>
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {profilErrors.nonFieldErrors.length > 0 &&
                  profilErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{msg}</AlertDescription>
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
                    <Label htmlFor="firstName">Имя</Label>
                    {!editingProfile && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setEditingProfile(true)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    disabled={!editingProfile}
                  />
                  {errors.firstName && touched.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    disabled={!editingProfile}
                  />
                  {errors.lastName && touched.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Логин</Label>
                  <Input
                    id="username"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    disabled={!editingProfile}
                  />
                  {errors.username && touched.username && <p className="text-sm text-red-500">{errors.username}</p>}
                </div>

                {editingProfile && (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Сохранение..." : "Сохранить"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProfile(false)}>
                      Отмена
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
          <CardTitle>Email</CardTitle>
          <CardDescription>Изменение адреса электронной почты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik initialValues={initialEmailValues} validationSchema={emailSchema} onSubmit={handleUpdateEmail}>
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {emailErrors.nonFieldErrors.length > 0 &&
                  emailErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{msg}</AlertDescription>
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
                    <Label htmlFor="email">Email</Label>
                    {!editingEmail && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => setEditingEmail(true)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    disabled={!editingEmail}
                  />
                  {errors.email && touched.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                {editingEmail && !showVerificationField && (
                  <Button type="button" onClick={() => handleRequestEmailCode(values.email)}>
                    Получить код подтверждения
                  </Button>
                )}

                {showVerificationField && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="verificationCode">Код подтверждения</Label>
                        {countdown > 0 ? (
                          <span className="text-sm text-gray-500">{countdown} сек</span>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRequestEmailCode(values.email)}
                          >
                            Отправить код повторно
                          </Button>
                        )}
                      </div>
                      <Input
                        id="verificationCode"
                        name="verificationCode"
                        value={values.verificationCode}
                        onChange={handleChange}
                        placeholder="Введите код из email"
                      />
                      {errors.verificationCode && touched.verificationCode && (
                        <p className="text-sm text-red-500">{errors.verificationCode}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Сохранение..." : "Сохранить"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingEmail(false)
                          setShowVerificationField(false)
                        }}
                      >
                        Отмена
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
          <CardTitle>Пароль</CardTitle>
          <CardDescription>Изменение пароля для входа в аккаунт</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Formik
            initialValues={initialPasswordValues}
            validationSchema={passwordSchema}
            onSubmit={handleUpdatePassword}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {passwordErrors.nonFieldErrors.length > 0 &&
                  passwordErrors.nonFieldErrors.map((msg, idx) => (
                    <Alert key={idx} variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{msg}</AlertDescription>
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
                  <Label htmlFor="currentPassword">Текущий пароль</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={values.currentPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                    >
                      {showPassword.current ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="text-sm text-red-500">{errors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Новый пароль</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={values.newPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    >
                      {showPassword.new ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && touched.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={values.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Обновление..." : "Обновить пароль"}
                </Button>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
