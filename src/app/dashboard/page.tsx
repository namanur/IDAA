import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // For now, redirect to home as it contains the main dashboard UI
  redirect('/');
}
