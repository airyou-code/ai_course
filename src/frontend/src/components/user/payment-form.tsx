/**
 * PaymentForm component with inline CloudPayments PaymentBlocks.
 * Fetches full payment config from API via async/await and initializes form.
 */
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useUserState } from "@/hooks/user"
import { useFetchPaymentsParams } from "@/hooks/payments"

interface PaymentConfig {
  publicId: string;
  description: string;
  amount: number;
  currency: string;
  invoiceId: string;
  accountId: string;
  email: string;
  requireEmail: boolean;
  language: string;
  applePaySupport: boolean;
  googlePaySupport: boolean;
  yandexPaySupport: boolean;
  tinkoffPaySupport: boolean;
  sbpSupport: boolean;
}

export default function PaymentForm() {
  const { user: userData } = useUserState() || { user: { email: "" } }
  const blocksRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const fetchParams = useFetchPaymentsParams()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let blocksApp: any
    let script: HTMLScriptElement

    async function initPayment() {
      try {
        const config: PaymentConfig = await fetchParams()
        if (!blocksRef.current) return

        script = document.createElement("script")
        script.src = "https://widget.cloudpayments.ru/bundles/paymentblocks.js"
        script.async = true
        document.body.appendChild(script)

        script.onload = () => {
          if (window.cp) {
            blocksApp = new window.cp.PaymentBlocks(config, {
              appearance: {
                colors: {
                  primaryButtonColor: "#10c650",
                  primaryButtonTextColor: "#FFFFFF",
                  primaryHoverButtonColor: "#2E71FC",
                  primaryButtonHoverTextColor: "#FFFFFF",
                  activeInputColor: "#0B1E46",
                  inputBackground: "#FFFFFF",
                  inputColor: "#8C949F",
                  inputBorderColor: "#E2E8EF",
                  errorColor: "#EB5757",
                },
                borders: { radius: "8px" },
              },
              components: {
                paymentButton: { text: "Оплатить", fontSize: "16px" },
                paymentForm: { labelFontSize: "16px", activeLabelFontSize: "12px", fontSize: "16px" },
              },
            })
            blocksApp.mount(blocksRef.current)
            blocksApp.on("success", () => window.location.assign("/payment-success"))
          }
        }
      } catch (error) {
        console.error("Failed to initialize payment:", error)
      }
    }

    initPayment()

    return () => {
      if (blocksApp) blocksApp.unmount()
      if (script && document.body.contains(script)) document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="w-full max-w-md mx-auto p-0">
      <div ref={blocksRef} className="mt-6" />
    </div>
  )
}
