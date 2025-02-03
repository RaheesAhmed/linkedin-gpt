import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="linkedin-nav">
        <div className="linkedin-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="LinkedIn GPT"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-linkedin-blue to-blue-600 bg-clip-text text-transparent">
                  LinkedInGPT
                </span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-2">
                <a className="nav-link">Features</a>
                <a className="nav-link">Pricing</a>
                <a className="nav-link">Enterprise</a>
                <a className="nav-link">Resources</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {session?.user ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost" className="text-linkedin-blue hover:bg-linkedin-blue/5 font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-linkedin-blue hover:bg-linkedin-darkBlue text-white font-medium">
                      Get Started
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="linkedin-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold text-linkedin-black leading-tight">
                Unlock Your LinkedIn <br/>
                <span className="bg-gradient-to-r from-linkedin-blue to-blue-600 bg-clip-text text-transparent">
                  Potential with AI
                </span>
              </h1>
              <p className="text-xl text-linkedin-darkGray leading-relaxed">
                Leverage advanced AI technology to optimize your LinkedIn presence, grow your network, and boost your professional success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up">
                  <Button className="w-full sm:w-auto bg-linkedin-blue hover:bg-linkedin-darkBlue text-white text-lg px-8 py-6 shadow-lg shadow-linkedin-blue/20">
                    Start Free Trial
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white text-lg px-8 py-6">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-linkedin-blue/20 to-transparent rounded-2xl">
                <Image
                  src="/dashboard-preview.png"
                  alt="Dashboard Preview"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="linkedin-container">
          <h2 className="text-3xl font-bold text-center mb-4 text-linkedin-black">
            Powerful Features for LinkedIn Success
          </h2>
          <p className="text-xl text-linkedin-darkGray text-center mb-12 max-w-3xl mx-auto">
            Everything you need to optimize your LinkedIn presence and grow your professional network.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="linkedin-card group">
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-linkedin-black group-hover:text-linkedin-blue transition-colors">
                  {feature.title}
                </h3>
                <p className="text-linkedin-darkGray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-linkedin-gray">
        <div className="linkedin-container">
          <h2 className="text-3xl font-bold text-center mb-12 text-linkedin-black">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`linkedin-card ${plan.popular ? 'border-linkedin-blue ring-2 ring-linkedin-blue' : ''}`}>
                {plan.popular && (
                  <span className="bg-linkedin-blue text-white px-4 py-1 rounded-full text-sm font-medium absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-linkedin-darkGray mb-4">{plan.description}</p>
                <p className="text-3xl font-bold mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-linkedin-darkGray">
                      <svg className="w-5 h-5 mr-2 text-linkedin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className={`w-full ${plan.popular ? 'bg-linkedin-blue hover:bg-linkedin-darkBlue text-white' : 'border-linkedin-blue text-linkedin-blue hover:bg-linkedin-blue hover:text-white'}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="linkedin-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="LinkedIn GPT"
                  width={30}
                  height={30}
                  className="rounded"
                />
                <span className="text-lg font-bold text-linkedin-blue">LinkedIn GPT</span>
              </div>
              <p className="text-linkedin-darkGray">
                Empowering professionals with AI-driven LinkedIn optimization
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a className="linkedin-link">Features</a></li>
                <li><a className="linkedin-link">Pricing</a></li>
                <li><a className="linkedin-link">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a className="linkedin-link">About</a></li>
                <li><a className="linkedin-link">Blog</a></li>
                <li><a className="linkedin-link">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a className="linkedin-link">Privacy</a></li>
                <li><a className="linkedin-link">Terms</a></li>
                <li><a className="linkedin-link">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-linkedin-darkGray">
            <p>&copy; {new Date().getFullYear()} LinkedIn GPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "AI-Powered Analytics",
    description: "Get deep insights into your LinkedIn performance with advanced AI analysis.",
    icon: (
      <svg className="w-6 h-6 text-linkedin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Smart Optimization",
    description: "Optimize your profile and content with AI-driven recommendations.",
    icon: (
      <svg className="w-6 h-6 text-linkedin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Network Growth",
    description: "Expand your professional network with targeted connection strategies.",
    icon: (
      <svg className="w-6 h-6 text-linkedin-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
]

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0/mo",
    features: [
      "Basic Analytics",
      "1 Custom Profile",
      "5 Keywords",
      "Community Support"
    ],
    popular: false
  },
  {
    name: "Pro",
    description: "Best for professionals",
    price: "$29/mo",
    features: [
      "Advanced Analytics",
      "5 Custom Profiles",
      "20 Keywords",
      "Priority Support",
      "Custom Reports"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    description: "For growing businesses",
    price: "$99/mo",
    features: [
      "Full Analytics Suite",
      "Unlimited Profiles",
      "Unlimited Keywords",
      "24/7 Support",
      "Custom Integration",
      "Team Management"
    ],
    popular: false
  }
]
