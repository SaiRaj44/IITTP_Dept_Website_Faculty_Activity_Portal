"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDesktop,
  FaKeyboard,
  FaMouse,
  FaTv,
  FaClipboardCheck,
  FaExclamationTriangle,
  FaListAlt,
  FaChevronDown,
  FaChevronUp,
  FaServer,
} from "react-icons/fa";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";

interface ModelCount {
  model: string;
  brand: string;
  count: number;
}

interface CategoryStats {
  total: number;
  byModel: ModelCount[];
}

interface AssetStats {
  Monitor: CategoryStats;
  Keyboard: CategoryStats;
  Mouse: CategoryStats;
  Desktop: CategoryStats;
  Workstation: CategoryStats;
  "All-In-One": CategoryStats;
  Faulty: CategoryStats;
  [key: string]: CategoryStats;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto" as const,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<AssetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/assets/stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || "Failed to fetch stats");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleCardClick = (filterType: string, filterValue: string) => {
    if (filterType === "subcategory") {
      router.push(`/asset-management/All-Assets?subcategory=${filterValue}`);
    } else if (filterType === "category") {
      router.push(`/asset-management/All-Assets?category=${filterValue}`);
    } else if (filterType === "status") {
      router.push(`/asset-management/All-Assets?status=${filterValue}`);
    }
  };

  const toggleExpand = (categoryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const categoryConfig = [
    {
      name: "Monitor",
      icon: FaTv,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      filterType: "subcategory",
      filterValue: "Monitor",
    },
    {
      name: "Desktop",
      icon: FaDesktop,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-100",
      textColor: "text-orange-600",
      filterType: "subcategory",
      filterValue: "Desktop",
    },
    {
      name: "Workstation",
      icon: FaServer,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-600",
      filterType: "subcategory",
      filterValue: "Workstation",
    },
    {
      name: "Keyboard",
      icon: FaKeyboard,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600",
      filterType: "subcategory",
      filterValue: "Keyboard",
    },
    {
      name: "Mouse",
      icon: FaMouse,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
      filterType: "subcategory",
      filterValue: "Mouse",
    },
    {
      name: "Faulty",
      icon: FaExclamationTriangle,
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      filterType: "status",
      filterValue: "In Repair",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <Breadcrumbs />
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Breadcrumbs />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Breadcrumbs />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Asset Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Overview of all asset categories</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
      >
        {categoryConfig.map((config) => {
          const categoryData = stats?.[config.name as keyof AssetStats];
          const Icon = config.icon;
          const isExpanded = expandedCategory === config.name;

          return (
            <motion.div
              key={config.name}
              variants={cardVariants}
              className="flex flex-col"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(config.filterType, config.filterValue)}
                className={`
                  relative overflow-hidden rounded-2xl p-5 cursor-pointer
                  bg-gradient-to-br ${config.bgGradient}
                  border border-white/50 shadow-lg hover:shadow-xl
                  transition-shadow duration-300
                `}
              >
                {/* Background decoration */}
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className={`inline-flex p-3 rounded-xl ${config.iconBg} mb-3`}>
                      <Icon className={`w-6 h-6 ${config.textColor}`} />
                    </div>
                    <h2 className="text-sm font-medium text-gray-600 mb-1">
                      {config.name === "Faulty" ? "Faulty Items" : config.name}
                    </h2>
                    <motion.p
                      key={categoryData?.total}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold text-gray-900"
                    >
                      {categoryData?.total || 0}
                    </motion.p>
                  </div>

                  {categoryData && categoryData.byModel.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleExpand(config.name, e)}
                      className={`p-2 rounded-lg ${config.iconBg} ${config.textColor}`}
                    >
                      {isExpanded ? (
                        <FaChevronUp className="w-4 h-4" />
                      ) : (
                        <FaChevronDown className="w-4 h-4" />
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Expanded Model List */}
              <AnimatePresence>
                {isExpanded && categoryData && (
                  <motion.div
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-3 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <FaListAlt className="w-4 h-4" />
                        By Model
                      </h3>
                      <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {categoryData.byModel.slice(0, 10).map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex justify-between items-center text-sm py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div>
                              <span className="font-medium text-gray-800">
                                {item.model || "Unknown Model"}
                              </span>
                              {item.brand && (
                                <span className="text-gray-400 text-xs ml-2">
                                  ({item.brand})
                                </span>
                              )}
                            </div>
                            <span className={`font-bold ${config.textColor} bg-gray-100 px-2.5 py-1 rounded-full text-xs`}>
                              {item.count}
                            </span>
                          </motion.li>
                        ))}
                        {categoryData.byModel.length > 10 && (
                          <li className="text-center text-sm text-gray-400 py-2">
                            +{categoryData.byModel.length - 10} more models
                          </li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.a
            href="/asset-management/My-Asset-List"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
          >
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaClipboardCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Add New Asset</h3>
              <p className="text-sm text-gray-500">Register a new asset to the system</p>
            </div>
          </motion.a>

          <motion.a
            href="/asset-management/All-Assets"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors"
          >
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FaListAlt className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View All Assets</h3>
              <p className="text-sm text-gray-500">Browse and manage all assets</p>
            </div>
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
