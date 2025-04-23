import { LoginForm } from "@/components/user/login-form";
import { Navigate } from "react-router-dom";
import Layout from '../../components/layout/Layout'
import { useUserState } from "@/hooks/user";

export default function AuthPage() {
  const { hasFetched, loggedIn } = useUserState();

  if (loggedIn) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
          <LoginForm/>
      </div>
    </div>
  )
}

