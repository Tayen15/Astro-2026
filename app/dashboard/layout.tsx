import { redirect } from 'next/navigation';
import { createClient } from '@/src/db/supabase/server';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user role from our users table
  const { db } = await import('@/src/db');
  const userRecord = await db.query.users.findFirst({
    where: (users: any, { eq }: any) => eq(users.id, user.id),
  });

  const role = userRecord?.role || 'participant';

  // Only admin can access dashboard
  if (role !== 'admin') {
    redirect('/');
  }

  const userName = userRecord?.name || user.email?.split('@')[0] || 'User';

  return (
    <DashboardShell role={role} userName={userName} userEmail={user.email!}>
      {children}
    </DashboardShell>
  );
}
