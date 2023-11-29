import Link from 'next/link';
import Dashboard from './dashboard';

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-custom-beige pt-3">
      <Dashboard />
      <Link href="/habits" className="btn btn-primary mb-3">
        habits
      </Link>
    </div>
  );
}
