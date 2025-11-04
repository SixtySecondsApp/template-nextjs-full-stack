import { Metadata } from 'next';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Content | Community OS',
  description: 'Manage your community content',
};

export default function ContentPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12 border rounded-xl bg-card">
          <MessageSquare size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Content</h2>
          <p className="text-muted-foreground">
            Content management page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
