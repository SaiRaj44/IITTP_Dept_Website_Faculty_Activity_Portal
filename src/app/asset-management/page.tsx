"use client";

import {
  FaClipboardCheck,
  FaUndo,
  FaCheckCircle,
  FaBoxOpen,
  FaExchangeAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

const Dashboard = () => {
  return (
    <div className="p-4 text-sm">
      <Breadcrumbs />
      <div className="sm:flex-auto sm:flex sm:items-center">
        <h1 className="text-2xl font-semibold leading-6 text-gray-900 mt-2 ml-2">
          Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 py-4">
        <div className="bg-white shadow rounded p-4 flex items-center">
          <FaBoxOpen className="w-8 h-8 text-blue-500 mr-3" />
          <div>
            <h2 className="text-base font-semibold text-black">Total Assets</h2>
            <p className="text-lg text-black">-</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 flex items-center">
          <FaCheckCircle className="w-8 h-8 text-green-500 mr-3" />
          <div>
            <h2 className="text-base font-semibold text-black">
              Available Assets
            </h2>
            <p className="text-lg text-black">-</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 flex items-center">
          <FaExchangeAlt className="w-8 h-8 text-orange-500 mr-3" />
          <div>
            <h2 className="text-base font-semibold text-black">
              Issued Assets
            </h2>
            <p className="text-lg text-black">-</p>
          </div>
        </div>
        <div className="bg-white shadow rounded p-4 flex items-center">
          <FaExclamationTriangle className="w-8 h-8 text-red-500 mr-3" />
          <div>
            <h2 className="text-base font-semibold text-black">
              Faulty Assets Count
            </h2>
            <p className="text-lg text-black">-</p>
          </div>
        </div>
      </div>
      <h2 className="text-base font-semibold mb-2 text-black">Quick Links</h2>
      <ul className="list-disc pl-5 text-black">
        <li className="flex items-center">
          <FaClipboardCheck className="mr-2" />{" "}
          <a href="/add-new-asset">Add New Asset</a>
        </li>
        <li className="flex items-center">
          <FaUndo className="mr-2" /> <a href="/return-items">Return Items</a>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
