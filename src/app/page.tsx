import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Index() {
  return (
    <div className="min-h-screen bg-delivery-bg">
      <header className="px-6 py-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-26 relative">
              <img src="/logo-long.svg" alt="logo" className="w-26 relative" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="px-6 py-2 text-delivery-dark hover:text-delivery-orange transition-colors font-roboto"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-delivery-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-roboto"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 py-16 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 bg-delivery-orange text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition-colors font-roboto"
            >
              Start
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 sm:px-8 lg:px-16 bg-delivery-dark">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4"></div>
          <p className="text-gray-400 font-roboto">
            © 2025 ColiGoo Delivery. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
