import RegistrationForm from '@/components/user/registration-form'
import { Navigate } from 'react-router-dom'
import { useUserState } from '@/hooks/user'

export default function RegistrationPage() {
  const { hasFetched, loggedIn } = useUserState();
  
  if (loggedIn) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-8">
      <div className="flex w-full flex-col gap-6">
          <RegistrationForm/>
      </div>
    </div>
  )
}