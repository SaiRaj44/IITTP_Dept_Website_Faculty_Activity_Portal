"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaBoxOpen,
  FaMapMarkedAlt,
  FaStore,
  FaList,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

export default function AssetManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenu(openSubMenu === menu ? null : menu);
  };

  const { data: session } = useSession({
    required: false,
    onUnauthenticated() {
      // Do nothing when unauthenticated to prevent automatic redirect
    },
  });

  if (!session) {
    return null;
  }

  const userRole = session.user?.role || "user";

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="flex flex-1">
        {/* Left Side Menu */}
        <nav className="w-1/6 bg-gray-800 text-white p-1 rounded shadow h-auto">
          <h2 className="font-semibold text-sm text-white text-center">Menu</h2>
          <div className="bg-white h-1 w-full mb-2"></div>
          <ul className="mt-1 space-y-1">
            {/* Dashboard */}
            <li className="cursor-pointer flex items-center py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105">
              <FaTachometerAlt className="w-5 h-5 mr-2" />
              <Link href="/asset-management/">
                <span className="flex-1 text-sm">Dashboard</span>
              </Link>
            </li>

            {/* Assets Management */}
            <li
              onClick={() => toggleSubMenu("assetsManagement")}
              className="cursor-pointer flex items-center py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105"
            >
              <FaBoxOpen className="w-5 h-5 mr-2" />
              <span className="flex-1 text-sm">Assets Management</span>
            </li>
            {openSubMenu === "assetsManagement" && (
              <ul className="transition-all duration-300 ease-in-out pl-4">
                <li className="py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105 flex items-center text-xs">
                  <FaUser className="w-5 h-5 mr-2" />
                  <Link href="/asset-management/My-Asset-List">
                    <span className="flex-1">My Assets</span>
                  </Link>
                </li>
                <li className="py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105 flex items-center text-xs">
                  <FaList className="w-5 h-5 mr-2" />
                  <Link href="/asset-management/All-Assets">
                    <span className="flex-1">View All Assets</span>
                  </Link>
                </li>
                {/* <li className="py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105 flex items-center text-xs">
                  <FaExchangeAlt className="w-5 h-5 mr-2" />
                  <Link href="/asset-management/transfer">
                    <span className="flex-1">Asset Transfer</span>
                  </Link>
                </li> */}
              </ul>
            )}

            {/* Faculty-only menus */}
            {userRole === "faculty" && (
              <>
                <li className="cursor-pointer flex items-center py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105">
                  <FaStore className="w-5 h-5 mr-2" />
                  <Link href="/asset-management/vendors">
                    <span className="flex-1 text-sm">Vendor Management</span>
                  </Link>
                </li>
                <li className="cursor-pointer flex items-center py-2 px-3 rounded transition duration-200 hover:bg-gray-600 hover:scale-105">
                  <FaMapMarkedAlt className="w-5 h-5 mr-2" />
                  <Link href="/asset-management/locations">
                    <span className="flex-1 text-sm">Locations</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 ml-4 bg-white rounded-lg shadow p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
