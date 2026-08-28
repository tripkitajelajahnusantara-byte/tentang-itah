import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import AdminLoginForm from '@/components/AdminLoginForm';

export const revalidate = 0; // Dynamic server check

export const metadata = {
  title: 'Login Administrator',
  description: 'Halaman login panel administrator website Tentang Itah.',
};

export default async function AdminLoginPage() {
  const isAuth = await isAdminAuthenticated();
  if (isAuth) {
    redirect('/admin/dashboard');
  }

  return <AdminLoginForm />;
}
