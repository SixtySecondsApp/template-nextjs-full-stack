import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default function HomePage() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <TopNav />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Welcome to Community OS
            </h1>
            <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
              This is a demo page showcasing the Next.js 15 components with dark mode support.
            </p>

            <div className="grid gap-4">
              <div
                className="p-6 rounded-lg shadow-sm border"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Component Features
                </h2>
                <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                  <li>Server Component Sidebar with navigation sections</li>
                  <li>Client Component TopNav with tabs and search</li>
                  <li>Dark mode toggle with next-themes</li>
                  <li>Clerk UserButton integration</li>
                  <li>Design system CSS variables</li>
                  <li>Responsive layout with mobile support</li>
                </ul>
              </div>

              <div
                className="p-6 rounded-lg shadow-sm border"
                style={{
                  background: 'var(--surface-elevated)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Design Tokens
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Primary Color
                    </p>
                    <div
                      className="w-full h-12 rounded-lg"
                      style={{ background: 'var(--primary-color)' }}
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Success Color
                    </p>
                    <div
                      className="w-full h-12 rounded-lg"
                      style={{ background: 'var(--success)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
