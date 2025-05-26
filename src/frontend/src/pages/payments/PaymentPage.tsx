import React, { useState } from 'react';
import { useNavigate, Navigate } from "react-router-dom";
import LayoutShadcn from '@/components/layout/LayoutShadcn';
import PaymentForm from '@/components/user/payment-form';
import { useFetchProductData } from "@/hooks/payments";
import { useUser } from "@/hooks/user";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const courseData = {
  id: "gen-ai-course-full",
  name: "Генеративный ИИ: Ваша суперсила в жизни и бизнесе",
  description: "Полный курс по использованию генеративного ИИ для повышения продуктивности в работе и жизни",
  price: 4990,
  currency: "RUB",
};

export default function PaymentPage() {
  const { is_has_full_access } = useUser();
    
    if (is_has_full_access) {
      return <Navigate to={{ pathname: "/" }} />;
    }

  const navigate = useNavigate();
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const { data: productData, isLoading, isError } = useFetchProductData();

  const handleApplyPromoCode = () => {
    console.log("Применение промокода:", promoCode);
    if (promoCode.toLowerCase() === "discount10") {
      setDiscount(courseData.price * 0.1);
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === "save20") {
      setDiscount(courseData.price * 0.2);
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
    }
  };

  const finalPrice = courseData.price - discount;

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Левая колонка - информация о курсе */}
        <div className="bg-slate-900 text-white p-8 flex flex-col">
          <div className="max-w-lg mx-auto w-full">
            <div className="mb-8">
              <Button variant="ghost" className="text-white hover:bg-slate-800 p-0" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
            </div>

            <div className="flex-1">
              <div className="mb-8">
                <h1 className="text-sm text-slate-400 mb-2">Покупка курса</h1>
                <h2 className="text-5xl font-bold mb-2">
                  {isLoading ? <Skeleton className="h-12 w-40" /> : `₽${finalPrice.toLocaleString()}`}
                </h2>
                <p className="text-slate-400">Единоразовый платеж</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isLoading ? <Skeleton className="h-6 w-48" /> : productData.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {isLoading ? <Skeleton className="h-4 w-full" /> : productData.description}
                  </p>
                  <p className="text-slate-400 text-sm mb-6">Пожизненный доступ</p>

                  {/* Что включено в курс */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">
                      {isLoading ? <Skeleton className="h-5 w-32" /> : "Что включено в курс:"}
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {[...Array(5)].map((_, idx) => (
                        <li key={idx} className="flex items-start">
                          {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                          ) : (
                            <>
                              <Check className="text-green-400 mr-3 mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span className="text-slate-300">{[
                                "4 подробных урока по генеративному ИИ",
                                "Практические задания и примеры",
                                "Шаблоны и промпты для работы",
                                "Пожизненный доступ к материалам",
                                "Сертификат о прохождении"
                              ][idx]}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="flex justify-between text-xl font-semibold">
                  <span>Итого к оплате</span>
                  <span>
                    {isLoading ? <Skeleton className="h-5 w-20" /> : `₽${finalPrice.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Правая колонка - место для формы оплаты */}
        <div className="bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-lg mx-auto">
            <PaymentForm />
          </div>
        </div>
      </div>
    </div>
  );
}