import { Metadata } from 'next';
import { BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics | Community OS',
  description: 'Deep dive into your community analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 border rounded-xl bg-card">
          <BarChart3 size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Analytics</h2>
          <p className="text-muted-foreground">
            Analytics page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
