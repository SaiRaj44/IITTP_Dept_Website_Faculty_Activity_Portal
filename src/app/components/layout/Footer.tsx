"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-4 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-sm text-gray-900">
          <span className="flex items-center space-x-1">
            <span>Developed by</span>
            <Link
              href="https://cse.iittp.ac.in/people/staff"
              target="_blank"
              className="font-medium text-blue-800 hover:text-blue-900 transition-colors duration-200"
            >
              G. Sai Raj (JTS), CSE
            </Link>
            <span className="mx-1">•</span>
            <Link
              href="mailto:sairaj@iittp.ac.in"
              className="text-blue-800 hover:text-blue-900 transition-colors duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 mr-1"
              >
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              sairaj@iittp.ac.in
            </Link>
          </span>
        </div>
        <div className="mt-1 text-center text-xs text-gray-800">
          © {new Date().getFullYear()} Department of Computer Science and
          Engineering, IIT Tirupati
        </div>
      </div>
    </footer>
  );
}
