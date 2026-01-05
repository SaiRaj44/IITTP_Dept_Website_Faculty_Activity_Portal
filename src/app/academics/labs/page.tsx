"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";
import {
  ComputerDesktopIcon,
  ServerIcon,
  UserGroupIcon,
  MapPinIcon,
  CpuChipIcon,
  CircleStackIcon,
  SwatchIcon,
  SpeakerWaveIcon,
  CommandLineIcon,
  TvIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const labs = [
  {
    name: "System Security Lab",
    location: "AB1, II Floor",
    capacity: 58,
    image: "/assets/images/labs/ssl.jpeg",
    configurations: [
      {
        icon: CpuChipIcon,
        label: "Processor",
        value: "Intel i9-13900 (8+16 Cores)",
      },
      {
        icon: CircleStackIcon,
        label: "RAM",
        value: "64GB DDR5 Non-ECC Memory",
      },
      {
        icon: SwatchIcon,
        label: "GPU",
        value: "8 GB NVidia GeForce RTX 3050 GDDR6",
      },
      { icon: ComputerDesktopIcon, label: "Storage", value: "1 TB NVMe SSD" },
      {
        icon: CommandLineIcon,
        label: "NIC",
        value: "Dual RJ45 Gigabit Ethernet Cards",
      },
      {
        icon: SpeakerWaveIcon,
        label: "Audio",
        value: "Internal Stereo Speakers",
      },
      { icon: CommandLineIcon, label: "OS", value: "Ubuntu 22.04 LTS" },
      { icon: TvIcon, label: "Monitor", value: 'LG 29" Ultra Wide Monitor' },
    ],
    courses: [
      "Data Structures and Algorithms",
      "Computer Networks",
      "Advanced Computer Networks",
      "Stochastic Network Optimization",
      "Software Engineering",
      "Cloud Computing",
      "Parallel Computing",
      "Parallel Numerical Linear Algebra",
      "Database Systems",
      "Distributed Systems",
      "Operating Systems",
      "Compiler Design",
      "Introduction to Programming",
      "Programming Methodology",
      "Performance Evaluation of Computer Systems",
      "Advanced Data Structures and Algorithms",
      "Industrial software Engineering",
      "Network Security",
      "Cyber Security",
    ],
  },
  {
    name: "Data Science Lab",
    location: "AB1, II Floor",
    capacity: 58,
    image: "/assets/images/labs/dsl.jpg",
    configurations: [
      {
        icon: CpuChipIcon,
        label: "Processor",
        value: "Intel i7-12700 (8+16 Cores)",
      },
      {
        icon: CircleStackIcon,
        label: "RAM",
        value: "32GB DDR5 Non-ECC Memory",
      },
      {
        icon: SwatchIcon,
        label: "GPU",
        value: "8 GB Inter UHD Graphics",
      },
      { icon: ComputerDesktopIcon, label: "Storage", value: "2 TB NVMe SSD" },
      {
        icon: CommandLineIcon,
        label: "NIC",
        value: "Dual RJ45 Gigabit Ethernet Cards",
      },
      {
        icon: SpeakerWaveIcon,
        label: "Audio",
        value: "Internal Stereo Speakers",
      },
      { icon: CommandLineIcon, label: "OS", value: "Ubuntu 22.04 LTS" },
      { icon: TvIcon, label: "Monitor", value: 'HP 24" Monitor' },
    ],
    specialConfig: {
      name: "NVidia DGX A-100 GPU Server",
      image: "/assets/images/nvidia-a100.png",
      specs: [
        { label: "Performance", value: "156 TeraFlops Double Precision" },
        { label: "AI Performance", value: "5 PetaFlops AI, 10 Petaops INT8" },
        { label: "CPU", value: "128 cores" },
        { label: "RAM", value: "1 TB" },
        { label: "GPU", value: "8 x 40GB nodes" },
        { label: "Storage", value: "15 TB SSD" },
        { label: "Connectivity", value: "NVidia NV Link Switches" },
      ],
      location: "DB2-Ground Floor Data Center",
    },
    courses: [
      "Machine Learning",
      "Artificial Intelligence",
      "Deep Learning",
      "Reinforcement Learning",
      "Artificial Neural Networks",
      "Predictive Data Modelling",
      "Industrial Data Science and Engineering",
      "Data Science for Software Engineering",
      "Speech Processing",
      "Computer Graphics",
      "Computer Vision",
      "Natural Language Processing",
      "Computational Methods in Optimization",
    ],
  },
];

export default function TeachingLabsPage() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Teaching Laboratories
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Department academic laboratories
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {labs.map((lab) => (
            <motion.div
              key={lab.name}
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={lab.image}
                  alt={lab.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {lab.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-white/90">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5" />
                      <span>{lab.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="h-5 w-5" />
                      <span>Capacity: {lab.capacity} students</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* System Configurations */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CpuChipIcon className="h-5 w-5 mr-2 text-blue-600" />
                    System Configurations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lab.configurations.map((config) => (
                      <div
                        key={config.label}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <config.icon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {config.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {config.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Configuration (DGX A100) */}
                {lab.specialConfig && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <ServerIcon className="h-5 w-5 mr-2 text-blue-600" />
                      High-end {lab.specialConfig.name}
                    </h3>
                    <div className="bg-blue-50 rounded-xl overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={lab.specialConfig.image}
                          alt={lab.specialConfig.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="opacity-90"
                        />
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {lab.specialConfig.specs.map((spec, index) => (
                            <div key={index} className="py-2">
                              <h4 className="text-sm font-medium text-blue-800">
                                {spec.label}
                              </h4>
                              <p className="text-sm text-blue-600">
                                {spec.value}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <MapPinIcon className="h-5 w-5 text-blue-600" />
                            <span className="text-sm text-blue-800">
                              Located at: {lab.specialConfig.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Offered Courses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Offered Courses
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lab.courses.map((course) => (
                      <div
                        key={course}
                        className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
