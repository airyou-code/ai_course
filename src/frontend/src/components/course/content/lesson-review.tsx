"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useCreateUserReview } from "@/hooks/user"

interface ErrorsState {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}


// Mock API call
const submitToBackend = async (values: { interestingRating: number; usefulRating: number; comment: string }) => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      console.log("Submitted to backend:", values)
      resolve(values)
    }, 1500)
  })
}

// Validation schema
const ratingSchema = Yup.object().shape({
  interestingRating: Yup.number().min(1, "Оценка обязательна").required("Оценка обязательна"),
  usefulRating: Yup.number().min(1, "Оценка обязательна").required("Оценка обязательна"),
  comment: Yup.string(),
})

export default function LessonReview({ lessonUUId }: { lessonUUId: string }) {
  const createUserReview  = useCreateUserReview()

  const { toast } = useToast()
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [hoveredInterestingRating, setHoveredInterestingRating] = useState<number>(0)
  const [hoveredUsefulRating, setHoveredUsefulRating] = useState<number>(0)

  const [reviewErrors, setReviewErrors] = useState<ErrorsState>({ fieldErrors: {}, nonFieldErrors: [] })

  const handleSubmit = async (
    values: { interestingRating: number; usefulRating: number; comment: string },
    { setSubmitting }: any,
  ) => {
    try {
      setReviewErrors({ fieldErrors: {}, nonFieldErrors: [] })
      await createUserReview({
        interesting: values.interestingRating,
        useful: values.usefulRating,
        text: values.comment || "",
        lesson: lessonUUId,
      })

      setSubmitted(true)
      toast({
        title: "Отзыв отправлен",
        description: "Спасибо за вашу оценку курса!",
      })
    } catch (error: any) {
      const { fieldErrors, nonFieldErrors } = error
      setReviewErrors({ fieldErrors, nonFieldErrors })
      const fieldErrorMessages = Object.keys(fieldErrors)
        .map(key => `${key}: ${fieldErrors[key].join(", ")}`)
        .join("; ");
      
      // Собираем общие ошибки
      const nonFieldErrorMessages = nonFieldErrors.join("; ");

      if (fieldErrorMessages) {
        toast({
          variant: "destructive",
          title: "Errors in fields",
          description: fieldErrorMessages,
        });
      }

      if (nonFieldErrorMessages) {
        toast({
          variant: "destructive",
          title: "General Errors",
          description: nonFieldErrorMessages,
        });
      }
      console.log(error)
      setSubmitted(false)
    }
  }

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto border-2 border-black p-8">
        <h2 className="text-2xl font-normal mb-2">Спасибо за вашу оценку!</h2>
        <p>Ваш отзыв очень важен для нас.</p>
      </div>
    )
  }


  return (
    <Formik
      initialValues={{ interestingRating: 0, usefulRating: 0, comment: "" }}
      validationSchema={ratingSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting, errors, touched }) => (
        <Form>
          <div className="w-full max-w-2xl mx-auto border-2 border-black p-8">
            <h2 className="text-2xl font-normal mb-1">Это конец этого урока.</h2>
            <p className="text-2xl font-normal mb-8">Пожалуйста, оцените ее, чтобы продолжить</p>

            {/* Rating Sections - Stacked on mobile, side by side on larger screens */}
            <div className="flex flex-col md:flex-row md:space-x-12 md:justify-between mb-6">
              {/* Interesting Rating */}
              <div className="mb-6 md:mb-0 md:flex-1">
                <p className="mb-2">Интересный</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`interesting-${star}`}
                      size={32}
                      className={`cursor-pointer ${
                        star <= (hoveredInterestingRating || values.interestingRating)
                          ? "fill-black text-black"
                          : "text-black"
                      }`}
                      onClick={() => setFieldValue("interestingRating", star)}
                      onMouseEnter={() => setHoveredInterestingRating(star)}
                      onMouseLeave={() => setHoveredInterestingRating(0)}
                    />
                  ))}
                </div>
                {errors.interestingRating && (
                  <div className="text-red-500 text-sm mt-1">{errors.interestingRating}</div>
                )}
              </div>

              {/* Useful Rating */}
              <div className="md:flex-1">
                <p className="mb-2">Полезный</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`useful-${star}`}
                      size={32}
                      className={`cursor-pointer ${
                        star <= (hoveredUsefulRating || values.usefulRating) ? "fill-black text-black" : "text-black"
                      }`}
                      onClick={() => setFieldValue("usefulRating", star)}
                      onMouseEnter={() => setHoveredUsefulRating(star)}
                      onMouseLeave={() => setHoveredUsefulRating(0)}
                    />
                  ))}
                </div>
                {errors.usefulRating && (
                  <div className="text-red-500 text-sm mt-1">{errors.usefulRating}</div>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-8">
              <div className="border-b border-gray-300">
                <Field
                  name="comment"
                  className="w-full py-2 focus:outline-none bg-transparent"
                  placeholder="Комментарий (необязательно)"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <p className="text-sm text-gray-600 mb-4">Оценка глав с использованием звезд обязательна.</p>
              <button
                type="submit"
                className="w-full py-2 px-4 border-2 border-black bg-white hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 inline animate-spin" />
                    Отправка...
                  </>
                ) : (
                  "Отправить отзыв"
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
