"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SubscriptionPlans } from "./components/SubscriptionPlans"

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/sign-in")
    },
  })

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-linkedin-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="linkedin-container">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {session?.user?.name}</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your subscription and GPT conversations</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="linkedin-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="md:col-span-8">
            {/* Subscription Plans */}
            <SubscriptionPlans />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Current Plan Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="text-xl font-semibold text-linkedin-blue">Free Plan</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversations Today</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium text-linkedin-blue">2/5 Used</p>
                      <p className="text-sm font-medium text-gray-500">40%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-linkedin-blue h-2 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Need Help */}
            <Card className="p-6 bg-gradient-to-br from-gray-50 to-transparent">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">Questions about our plans or features?</p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
