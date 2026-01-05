"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Define types for menu items
interface MenuItem {
  name: string;
  path: string;
  submenu?: MenuItem[];
  image?: string;
  description?: string;
  featuredItems?: {
    title: string;
    image: string;
    path: string;
  }[];
}

interface HeaderProps {
  isTransparent?: boolean;
}

// Create Header component
export default function Header({ isTransparent = false }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeNestedSubmenu, setActiveNestedSubmenu] = useState<string | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(
    null
  );

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Refs for dropdown menus
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle scroll effect only if transparent header is enabled
  useEffect(() => {
    if (!isTransparent) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    // Trigger the check immediately and then on scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparent]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".menu-item-button")
      ) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Main menu structure
  const menuItems: MenuItem[] = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "People",
      path: "",
      description: "Meet our faculty, students, research scholars, and staff.",
      submenu: [
        { name: "Faculty", path: "/people/faculty" },
        { name: "Research Scholars", path: "/people/research-scholars" },
        { name: "Staff", path: "/people/staff" },
        { name: "Students", path: "/people/students" },

        { name: "Graduands", path: "/people/graduands" },
      ],
    },
    {
      name: "Research",
      path: "",
      description: "Explore our research areas and publications.",
      submenu: [
        {
          name: "Areas of Research",
          path: "/research/areas",
        },
        { name: "Books", path: "/research/books" },
        { name: "Patents", path: "/research/patents" },
        { name: "Projects", path: "/research/projects" },
        { name: "Publications", path: "/research/publications" },
        // { name: "Sponsored Projects", path: "/research/sponsored-projects" },
      ],
    },
    {
      name: "Academics",
      path: "",
      description: "Information about our academic programs and resources.",
      submenu: [
        { name: "Programmes", path: "/academics/programmes" },
        { name: "B.Tech", path: "https://iittp.ac.in/btech" },
        { name: "M.Tech", path: "https://iittp.ac.in/mtech" },
        { name: "M.S. (Research)", path: "https://iittp.ac.in/ms" },
        { name: "Ph.D", path: "https://iittp.ac.in/phd" },
        { name: "Time Table", path: "https://iittp.ac.in/btechtimetable" },
        { name: "Teaching Labs", path: "/academics/labs" },
      ],
    },
    {
      name: "Activities",
      path: "",
      description: "Department activities, events, and announcements.",
      submenu: [
        { name: "Announcements", path: "/activities/announcements" },
        { name: "Awards & Honours", path: "/activities/awards-honours" },
        { name: "Guest Lectures", path: "/activities/guest-lectures" },
        { name: "Placements", path: "/activities/placements" },
      ],
    },
    {
      name: "Resources",
      path: "",
      description:
        "Access departmental resources and systems (Nvidia DGX A 100)",
      submenu: [
        { name: "Deptflow", path: "/signin" },
        { name: "Old Website", path: "https://cse.iittp.ac.in/website/" },

        {
          name: "Faculty Activity Portal",
          path: "https://cse.iittp.ac.in/activity-report/",
        },
        {
          name: "Workflow System",
          path: "https://iittp.plumerp.co.in/prod/iittirupati/",
        },
        {
          name: "Documentation Portal",
          path: "https://cse.iittp.ac.in/docs",
        },
      ],
    },
  ];

  // Toggle dropdown for desktop
  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (openDropdown === name) {
      setOpenDropdown(null);
      setOpenNestedDropdown(null);
    } else {
      setOpenDropdown(name);
      setOpenNestedDropdown(null);
    }
  };

  // Toggle nested dropdown for desktop
  const toggleNestedDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenNestedDropdown(openNestedDropdown === name ? null : name);
  };

  // Toggle submenu for mobile
  const toggleSubmenu = (name: string) => {
    if (activeSubmenu === name) {
      setActiveSubmenu(null);
      setActiveNestedSubmenu(null);
    } else {
      setActiveSubmenu(name);
    }
  };

  // Toggle nested submenu for mobile
  const toggleNestedSubmenu = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveNestedSubmenu(activeNestedSubmenu === name ? null : name);
  };

  // Animation variants for dropdowns
  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      y: -5,
      height: 0,
      transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
    },
  };

  // Store dropdown menu ref
  const registerDropdownRef = (name: string, ref: HTMLDivElement | null) => {
    if (ref) {
      dropdownRefs.current[name] = ref;
    }
  };

  // Handle link click for scrolling to sections
  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    if (path.startsWith("/#")) {
      e.preventDefault();
      const sectionId = path.split("#")[1];
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
        setOpenDropdown(null);
      } else if (window.location.pathname !== "/") {
        window.location.href = path;
      }
    }
  };

  const renderLink = (item: MenuItem) => {
    if (item.path.startsWith("/#")) {
      return (
        <a
          href={item.path}
          onClick={(e) => handleLinkClick(item.path, e)}
          className={`block px-5 py-2 text-sm font-semibold font-sans tracking-wide hover:text-blue-600 hover:bg-gray-50 ${
            isTransparent && !isScrolled ? "text-white" : "text-gray-600"
          }`}
        >
          {item.name}
        </a>
      );
    }
    return (
      <Link
        href={item.path}
        className={`menu-item-button font-semibold font-sans tracking-wide py-2 px-1 flex items-center relative after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full text-[15px] ${
          isTransparent && !isScrolled
            ? "text-white hover:text-blue-200"
            : "text-gray-800 hover:text-blue-600"
        } transition-colors`}
      >
        {item.name}
      </Link>
    );
  };

  // Update mobile menu link rendering
  const renderMobileLink = (item: MenuItem) => {
    if (item.path.startsWith("/#")) {
      return (
        <a
          href={item.path}
          onClick={(e) => handleLinkClick(item.path, e)}
          className="block px-5 py-3 text-gray-600 hover:text-blue-600 transition-colors font-sans font-semibold tracking-wide"
        >
          {item.name}
        </a>
      );
    }
    return (
      <Link
        href={item.path}
        className="block px-0 py-3 text-gray-600 hover:text-blue-600 transition-colors font-sans font-semibold tracking-wide"
        onClick={() => setMobileMenuOpen(false)}
      >
        {item.name}
      </Link>
    );
  };

  // If not mounted, return a placeholder to prevent hydration mismatch
  if (!mounted) {
    return (
      <header
        className={`${
          isTransparent ? "fixed top-0 left-0 right-0" : "relative"
        } z-50 bg-white shadow-lg`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-[90px] h-[90px] bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
              </div>
              <div>
                <div className="h-7 w-72 bg-gradient-to-r from-blue-100 to-purple-100 rounded animate-pulse"></div>
                <div className="h-5 w-56 bg-gradient-to-r from-blue-100 to-purple-100 rounded mt-1 animate-pulse"></div>
              </div>
            </div>
            <div className="lg:hidden">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`${
        isTransparent ? "fixed top-0 left-0 right-0" : "relative"
      } z-50 transition-all duration-300 ${
        isTransparent && !isScrolled ? "bg-transparent" : "bg-white shadow-lg"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Left side - Logo and Department Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="mr-4">
              {/* Institute logo with modern styling */}
              <div className="flex items-center justify-center relative group bg-white rounded-lg p-1 ">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 "></div>
                <a href="https://iittp.ac.in" target="_blank">
                  <Image
                    src="/assets/images/iittp-logo.png"
                    alt="IIT Tirupati Logo"
                    width={90}
                    height={90}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      if (target.parentElement) {
                        target.parentElement.innerHTML =
                          '<div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">CSE</div>';
                      }
                    }}
                  />
                </a>
              </div>
            </div>
            <div>
              <a href="https://cse.iittp.ac.in">
                <h1
                  className={`text-xl font-bold font-serif leading-tight ${
                    isTransparent && !isScrolled
                      ? "text-white"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  }`}
                >
                  Department of Computer Science & Engineering
                </h1>
              </a>
              <a href="https://cse.iittp.ac.in">
                <p
                  className={`text-sm font-sans  ${
                    isTransparent && !isScrolled
                      ? "text-white/80"
                      : "text-gray-600"
                  }`}
                >
                  Indian Institute of Technology Tirupati
                </p>
              </a>
            </div>
          </motion.div>

          {/* Right side - Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 relative">
            {menuItems.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={item.name}
                className={`relative group ${
                  item.name === "Resources" ? "static" : ""
                }`}
              >
                {item.path && !item.submenu ? (
                  renderLink(item)
                ) : (
                  <div className="relative">
                    <button
                      onClick={(e) => toggleDropdown(item.name, e)}
                      key={`dropdown-${item.name}`}
                      type="button"
                      suppressHydrationWarning
                      className={`menu-item-button font-semibold font-sans tracking-wide py-2 px-1 flex items-center relative after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:bottom-0 after:left-0 after:transition-all after:duration-300 hover:after:w-full text-[15px] ${
                        isTransparent && !isScrolled
                          ? "text-white hover:text-blue-200"
                          : "text-gray-800 hover:text-blue-600"
                      } transition-colors ${
                        openDropdown === item.name ? "after:w-full" : ""
                      }`}
                    >
                      {item.name}
                      <ChevronDownIcon
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* First-level dropdown */}
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          ref={(ref) => registerDropdownRef(item.name, ref)}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={dropdownVariants}
                          className={`absolute right-0 md:right-auto mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50 ${
                            item.name === "Resources"
                              ? "right-0 md:right-0 lg:right-0"
                              : ""
                          }`}
                        >
                          <div className="rounded-t-md h-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                          <div className="py-1">
                            {item.submenu?.map((subItem) => (
                              <div
                                key={subItem.name}
                                className="relative group/submenu"
                              >
                                {subItem.submenu ? (
                                  <>
                                    <button
                                      onClick={(e) =>
                                        toggleNestedDropdown(subItem.name, e)
                                      }
                                      key={`nested-${subItem.name}`}
                                      type="button"
                                      suppressHydrationWarning
                                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between transition-colors duration-150"
                                    >
                                      <span>{subItem.name}</span>
                                      <ChevronRightIcon
                                        className={`h-4 w-4 text-gray-400 group-hover/submenu:text-blue-500 transition-transform duration-200 ${
                                          openNestedDropdown === subItem.name
                                            ? "rotate-90"
                                            : ""
                                        }`}
                                      />
                                    </button>

                                    {/* Second-level dropdown (nested) */}
                                    <AnimatePresence>
                                      {openNestedDropdown === subItem.name && (
                                        <motion.div
                                          initial="hidden"
                                          animate="visible"
                                          exit="exit"
                                          variants={dropdownVariants}
                                          className="absolute left-full top-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none -mt-2 ml-0.5 z-50 overflow-hidden"
                                        >
                                          <div className="rounded-t-md h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                                          <div className="py-2">
                                            {subItem.submenu.map(
                                              (nestedItem) => (
                                                <Link
                                                  key={nestedItem.name}
                                                  href={nestedItem.path}
                                                  target={
                                                    nestedItem.path.startsWith(
                                                      "https://"
                                                    )
                                                      ? "_blank"
                                                      : undefined
                                                  }
                                                  rel={
                                                    nestedItem.path.startsWith(
                                                      "https://"
                                                    )
                                                      ? "noopener noreferrer"
                                                      : undefined
                                                  }
                                                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                                  onClick={() => {
                                                    setOpenDropdown(null);
                                                    setOpenNestedDropdown(null);
                                                  }}
                                                >
                                                  {nestedItem.name}
                                                </Link>
                                              )
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </>
                                ) : (
                                  <Link
                                    href={subItem.path}
                                    target={
                                      subItem.path.startsWith("https://")
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel={
                                      subItem.path.startsWith("https://")
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                                    onClick={() => {
                                      setOpenDropdown(null);
                                      setOpenNestedDropdown(null);
                                    }}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            key="mobile-menu-button"
            type="button"
            suppressHydrationWarning
            className={`lg:hidden p-2 rounded-md hover:bg-gray-100/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 ${
              isTransparent && !isScrolled
                ? "text-white hover:text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
              {menuItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={item.name}
                  className={`border-b border-gray-100 ${
                    !item.submenu ? "py-0" : "py-2"
                  }`}
                >
                  {item.path && !item.submenu ? (
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderMobileLink(item)}
                    </motion.div>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        key={`mobile-${item.name}`}
                        type="button"
                        suppressHydrationWarning
                        className="flex w-full items-center justify-between py-2 text-gray-700 hover:text-blue-600 transition-colors font-sans font-semibold tracking-wide text-[15px]"
                      >
                        <span>{item.name}</span>
                        <motion.span
                          animate={{
                            rotate: activeSubmenu === item.name ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {activeSubmenu === item.name && item.submenu && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4 ml-2 border-l-2 border-blue-100"
                          >
                            {item.submenu.map((subItem, subIndex) => (
                              <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.15,
                                  delay: subIndex * 0.05,
                                }}
                                key={subItem.name}
                              >
                                {subItem.submenu ? (
                                  <>
                                    <button
                                      onClick={(e) =>
                                        toggleNestedSubmenu(subItem.name, e)
                                      }
                                      key={`mobile-nested-${subItem.name}`}
                                      type="button"
                                      suppressHydrationWarning
                                      className="flex w-full items-center justify-between py-2.5 text-gray-600 hover:text-blue-600 transition-colors font-sans font-medium tracking-wide"
                                    >
                                      <span>{subItem.name}</span>
                                      <motion.span
                                        animate={{
                                          rotate:
                                            activeNestedSubmenu === subItem.name
                                              ? 90
                                              : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <ChevronRightIcon className="w-4 h-4" />
                                      </motion.span>
                                    </button>
                                    <AnimatePresence>
                                      {activeNestedSubmenu === subItem.name && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{
                                            height: "auto",
                                            opacity: 1,
                                          }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                          className="overflow-hidden pl-4 ml-2 border-l-2 border-indigo-100"
                                        >
                                          {subItem.submenu.map(
                                            (nestedItem, nestedIndex) => (
                                              <motion.div
                                                initial={{ opacity: 0, x: -5 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                  duration: 0.15,
                                                  delay: nestedIndex * 0.05,
                                                }}
                                                key={nestedItem.name}
                                              >
                                                <Link
                                                  href={nestedItem.path}
                                                  target={
                                                    nestedItem.path.startsWith(
                                                      "https://"
                                                    )
                                                      ? "_blank"
                                                      : undefined
                                                  }
                                                  rel={
                                                    nestedItem.path.startsWith(
                                                      "https://"
                                                    )
                                                      ? "noopener noreferrer"
                                                      : undefined
                                                  }
                                                  className="block py-2.5 text-gray-500 hover:text-blue-600 transition-colors font-sans font-medium tracking-wide"
                                                  onClick={() =>
                                                    setMobileMenuOpen(false)
                                                  }
                                                >
                                                  {nestedItem.name}
                                                </Link>
                                              </motion.div>
                                            )
                                          )}
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </>
                                ) : (
                                  <Link
                                    href={subItem.path}
                                    target={
                                      subItem.path.startsWith("https://")
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel={
                                      subItem.path.startsWith("https://")
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    className="block py-2.5 text-gray-600 hover:text-blue-600 transition-colors font-sans font-medium tracking-wide"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
