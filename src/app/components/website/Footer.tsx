"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Department Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div> */}
                <Image
                  src="/assets/images/iittp-logo.png"
                  alt="IIT Tirupati Logo"
                  width={68}
                  height={68}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Department of CSE
                </h3>
                <p className="text-sm text-gray-100">IIT Tirupati</p>
              </div>
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">
              Follow us on social media to stay updated with the latest news and
              events.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/cse_iittirupati"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.957 6.817H2.18l7.73-8.835L1.686 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/cse_iittirupati/"
                target="_blank"
                className="text-gray-400 hover:text-pink-700 transition-colors duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/cse-iittirupati/"
                target="_blank"
                className="text-gray-400 hover:text-blue-700 transition-colors duration-300 "
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* People Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-purple-400 bg-clip-text text-transparent">
              People
            </h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/people/faculty"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Faculty
                </Link>
              </li>
              <li>
                <Link
                  href="/people/research-scholars"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Research Scholars
                </Link>
              </li>
              <li>
                <Link
                  href="/people/staff"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Staff
                </Link>
              </li>
              <li>
                <Link
                  href="/people/students"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Students
                </Link>
              </li>
            </ul>
          </motion.div>
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2 ">
              <li>
                <Link
                  href="/activities/awards-honours"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Awards & Honours
                </Link>
              </li>
              <li>
                <Link
                  href="/activities/guest-lectures"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Guest Lectures
                </Link>
              </li>

              <li>
                <Link
                  href="/research/projects"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/research/publications"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></span>
                  Publications
                </Link>
              </li>
            </ul>
          </motion.div>
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-purple-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-blue-400 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">
                  Yerpedu, Tirupati - 517619
                  <br />
                  Andhra Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">cse_office@iittp.ac.in</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm">(0877) 250-3201</span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-purple-400 bg-clip-text text-transparent">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for the latest updates and news.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div> */}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Department of CSE, IIT Tirupati. All
              rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="https://cse.iittp.ac.in/people/staff"
                className="text-cyan-100"
              >
                <span className="text-gray-600">Developed by {" "}</span> G. Sai Raj
                (JTS), CSE, IIT Tirupati
              </Link>
              {/* <Link href="" className="text-gray-500  text-sm">
              
                Developed by{" "}
                <a
                  href="https://cse.iittp.ac.in/people/staff"
                  target="_blank"
                  className="text-gray-500 hover:text-white transition-colors duration-300"
                >
                  G. Sai Raj
                </a>{" "}
                (JTS), CSE, IIT Tirupati
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
