import { SignUpForm } from "@/components/auth/sign-up-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}
