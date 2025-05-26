"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, BookOpen, Mail } from "lucide-react"
import { Navigate } from "react-router-dom"
import { useUser } from "@/hooks/user"

export default function SuccessPage() {
  const { is_has_full_access } = useUser();
  
  if (is_has_full_access) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  const handleGoHome = () => {
    // Переход на главную с перезагрузкой
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Оплата успешно выполнена!</CardTitle>
          <p className="text-lg text-gray-600">
            Спасибо за покупку курса "Генеративный ИИ: Ваша суперсила в жизни и бизнесе"
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Mail className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Проверьте вашу почту</h3>
                <p className="text-blue-800 text-sm">
                  Мы отправили инструкции по доступу к курсу на указанный вами email. Если письмо не пришло, проверьте
                  папку "Спам" или "Промоакции".
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-6 w-6 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Что дальше?</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Изучайте материалы в удобном для вас темпе</li>
                  <li>• Выполняйте практические задания</li>
                  <li>• Получите сертификат после завершения</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm text-center">
              <strong>Важно:</strong> Сохраните это письмо с доступом к курсу. При возникновении вопросов обращайтесь в
              поддержку:
              <span className="font-medium"> support@example.com</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleGoHome} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Вернуться на главную
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
              size="lg"
              onClick={() => (window.location.href = "/")}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Перейти к курсу
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Номер заказа: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Дата покупки:{" "}
              {new Date().toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
