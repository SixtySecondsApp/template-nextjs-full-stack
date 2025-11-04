import { Metadata } from 'next';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Members | Community OS',
  description: 'Manage your community members',
};

export default function MembersPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 border rounded-xl bg-card">
          <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Members</h2>
          <p className="text-muted-foreground">
            Members management page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
