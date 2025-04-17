import RegistrationForm from '@/components/user/registration-form'
import Layout from '../../components/layout/Layout'

export default function RegistrationPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
          <RegistrationForm/>
      </div>
    </div>
  )
}