import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <AuthForm type="login" />
    </main>
  );
}
