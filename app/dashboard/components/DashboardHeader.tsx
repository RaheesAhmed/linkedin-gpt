interface DashboardHeaderProps {
  username: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="linkedin-container">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {username}</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your subscription and GPT conversations</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
