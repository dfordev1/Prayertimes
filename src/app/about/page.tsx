import Link from "next/link";

export const metadata = {
  title: "About - My Next.js App",
  description: "Learn more about this Next.js application",
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
          >
            ← Back to Home
          </Link>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
            About This App
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              🚀 Built with Modern Technologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TechItem name="Next.js 15" description="The React Framework for Production" />
              <TechItem name="TypeScript" description="Type-safe JavaScript" />
              <TechItem name="Tailwind CSS" description="Utility-first CSS framework" />
              <TechItem name="App Router" description="File-based routing system" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ✨ Features Included
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Server-side rendering (SSR) and static site generation (SSG)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Automatic code splitting and performance optimization
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Built-in SEO and metadata management
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Dark mode support with CSS variables
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Responsive design for all devices
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}