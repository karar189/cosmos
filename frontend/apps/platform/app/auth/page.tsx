import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function AuthPage() {
  // redirect(ROUTES.AUTH.SIGNUP);
  redirect(ROUTES.HOME);
}