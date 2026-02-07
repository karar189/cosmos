import { WithAuthProvider } from '@/components/layouts/AuthLayout';

export default function AuthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WithAuthProvider>{children}</WithAuthProvider>;
}
