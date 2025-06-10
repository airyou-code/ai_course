"use client"

import { Button } from "@/components/ui/button"
import ROUTES from "@/config/routes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Home, ShoppingCart, Star, Clock, Award } from "lucide-react"
import { useFetchProductData } from "@/hooks/payments"
import { Skeleton } from "@/components/ui/skeleton";


export default function AccessDeniedPage() {
  const { data: productData, isLoading, isError } = useFetchProductData();
  const handleGoHome = () => {
    // Переход на главную с перезагрузкой
    window.location.href = "/"
  }

  const handleBuyAccess = () => {
    // Переход на страницу оплаты
    window.location.href = ROUTES.PAYMENT;
  }

  return (
    <div>
      <Card className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Lock className="h-12 w-12 text-gray-600 dark:text-gray-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Доступ закрыт</CardTitle>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Этот контент доступен только в полной версии курса "Генеративный ИИ: Ваша суперсила в жизни и бизнесе"
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              Что вы получите с полным доступом:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">4 подробных урока</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">По генеративному ИИ</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Пожизненный доступ</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">К материалам и обновлениям</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Практические задания</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">И готовые шаблоны</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-sm font-medium">Сертификат</p>
                  <p className="text-gray-600 dark:text-gray-400 text-xs">О прохождении курса</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black dark:bg-white text-white dark:text-black rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">
              {isLoading ? <Skeleton className="h-12 w-40" /> : `₽${productData.price.toLocaleString()}`}
            </h3>
            <p className="text-gray-300 dark:text-gray-700 mb-4">Единоразовый платеж • Пожизненный доступ</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400 dark:text-gray-600">
              <span>✓ Без подписки</span>
              <span>•</span>
              <span>✓ Мгновенный доступ</span>
              <span>•</span>
              <span>✓ 30 дней гарантии</span>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 text-sm text-center">
              <strong>Специальное предложение:</strong> Получите полный доступ ко всем материалам курса и начните
              изучение уже сегодня!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleBuyAccess}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Купить полный доступ
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={handleGoHome}
            >
              <Home className="mr-2 h-5 w-5" />
              Вернуться на главную
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Остались вопросы? Напишите нам на{" "}
              <a
                href="mailto:support@example.com"
                className="text-gray-700 dark:text-gray-300 hover:underline font-medium"
              >
                support@example.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
