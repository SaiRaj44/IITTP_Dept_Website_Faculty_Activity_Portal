"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  AcademicCapIcon,
  BeakerIcon,
  CpuChipIcon,
  CloudIcon,
  CommandLineIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePageMetadata } from "../../hooks/usePageMetadata"; 


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
      staggerChildren: 0.1,
    },
  },
};

// Get category color and icon
const getCategoryStyle = (question: string) => {
  if (
    question.toLowerCase().includes("ai") ||
    question.toLowerCase().includes("machine learning") ||
    question.toLowerCase().includes("data science")
  ) {
    return {
      icon: <BeakerIcon className="h-8 w-8" />,
      gradient: "from-purple-500 to-pink-500",
      lightGradient: "from-purple-50 to-pink-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
    };
  }
  if (
    question.toLowerCase().includes("cloud") ||
    question.toLowerCase().includes("network") ||
    question.toLowerCase().includes("iot")
  ) {
    return {
      icon: <CloudIcon className="h-8 w-8" />,
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-50 to-cyan-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
    };
  }
  if (
    question.toLowerCase().includes("vlsi") ||
    question.toLowerCase().includes("hardware")
  ) {
    return {
      icon: <CpuChipIcon className="h-8 w-8" />,
      gradient: "from-orange-500 to-red-500",
      lightGradient: "from-orange-50 to-red-50",
      textColor: "text-orange-600",
      borderColor: "border-orange-100",
    };
  }
  if (
    question.toLowerCase().includes("vision") ||
    question.toLowerCase().includes("parallel")
  ) {
    return {
      icon: <CpuChipIcon className="h-8 w-8" />,
      gradient: "from-yellow-500 to-red-500",
      lightGradient: "from-yellow-50 to-red-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-100",
    };
  }
  if (
    question.toLowerCase().includes("education") ||
    question.toLowerCase().includes("optimization")
  ) {
    return {
      icon: <CpuChipIcon className="h-8 w-8" />,
      gradient: "from-cyan-500 to-yellow-500",
      lightGradient: "from-cyan-50 to-yellow-50",
      textColor: "text-cyan-600",
      borderColor: "border-cyan-100",
    };
  }
  if (
    question.toLowerCase().includes("engineering") ||
    question.toLowerCase().includes("learning")
  ) {
    return {
      icon: <CpuChipIcon className="h-8 w-8" />,
      gradient: "from-green-500 to-blue-500",
      lightGradient: "from-green-50 to-blue-50",
      textColor: "text-green-600",
      borderColor: "border-green-100",
    };
  }
  if (
    question.toLowerCase().includes("algorithm") ||
    question.toLowerCase().includes("complexity")
  ) {
    return {
      icon: <CommandLineIcon className="h-8 w-8" />,
      gradient: "from-emerald-500 to-teal-500",
      lightGradient: "from-emerald-50 to-teal-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
    };
  }
  // Default style
  return {
    icon: <LightBulbIcon className="h-8 w-8" />,
    gradient: "from-gray-500 to-slate-500",
    lightGradient: "from-gray-50 to-slate-50",
    textColor: "text-gray-600",
    borderColor: "border-gray-100",
  };
};

const areas = [
  {
    id: 1,
    question: "AI Accelerator",
    faculty: "Dr Jaynarayan T Tudu",
    profile1: "dr-jaynarayan-t-tudu",
    answer:
      "An AI accelerator is a class of specialized hardware accelerator or computer system designed to accelerate artificial intelligence applications, especially artificial neural networks, machine vision and machine learning. Typical applications include algorithms for robotics, the internet of things and other data-intensive or sensor-driven tasks. They are often manycore designs and generally focus on low-precision arithmetic, novel dataflow architectures or in-memory computing capability. As of 2018, a typical AI integrated circuit chip contains billions of MOSFET transistors. A number of vendor-specific terms exist for devices in this category, and it is an emerging technology without a dominant design.",
  },
  {
    id: 2,
    question: "Algorithms and Data Structures",
    faculty: "Dr S Raja, Dr G Ramakrishna",
    profile1: "dr-s-raja",
    profile2: "dr-g-ramakrishna",
    answer:
      "In mathematics and computer science, an algorithm is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of problems or to perform a computation. Algorithms are always unambiguous and are used as specifications for performing calculations, data processing, automated reasoning, and other tasks.A data structure is a data organization, management, and storage format that enables efficient access and modification. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data.",
  },
  {
    id: 3,
    question: "Cloud and Edge Computing",
    faculty: "Dr Mahendran V",
    profile1: "dr-v-mahendran",
    answer:
      "Cloud computing is the on-demand availability of computer system resources, especially data storage (cloud storage) and computing power, without direct active management by the user. Edge computing is a distributed computing paradigm that brings computation and data storage closer to the sources of data. This is expected to improve response times and save bandwidth. A common misconception is that edge and IoT are synonymous. Simply stated, edge computing is a topology- and location-sensitive form of distributed computing, while IoT is a use case instantiation of edge computing. The term refers to an architecture rather than a specific technology.",
  },
  {
    id: 4,
    question: "Computational Complexity",
    faculty: "Dr S Raja",
    profile1: "dr-s-raja",
    answer:
      "The computational complexity of an algorithm is the amount of resources required to run it. Particular focus is given to time and memory requirements. The complexity of a problem is the complexity of the best algorithms that allow solving the problem.",
  },
  {
    id: 5,
    question: "Computer Networks",
    faculty: "Prof Venkata Ramana Badarla, Dr Mahendran V",
    profile1: "prof-venkata-ramana-badarla",
    profile2: "dr-v-mahendran",

    answer:
      "A computer network is a group of computers that use a set of common communication protocols over digital interconnections for the purpose of sharing resources located on or provided by the network nodes. The interconnections between nodes are formed from a broad spectrum of telecommunication network technologies, based on physically wired, optical, and wireless radio-frequency methods that may be arranged in a variety of network topologies.",
  },
  {
    id: 6,
    question: "Computer Vision",
    faculty: "Dr Kalidas Yeturu, Dr. Chalavadi Vishnu",
    profile1: "dr-kalidas-yeturu",
    profile2: "dr-chalavadi-vishnu",    
    answer:
      "Computer vision is an interdisciplinary scientific field that deals with how computers can gain high-level understanding from digital images or videos. From the perspective of engineering, it seeks to understand and automate tasks that the human visual system can do.",
  },
  {
    id: 7,
    question: "Computing for Education",
    faculty: "Dr Sridhar Chimalakonda",
    profile1: "dr-sridhar-chimalakonda",
    answer:
      "Computing education is the science and art of teaching and learning of computer science, computing and computational thinking. As a subdiscipline of pedagogy it also addresses the wider impact of computer science in society through its intersection with philosophy, psychology, linguistics, natural sciences, and mathematics. In comparison to science education and mathematics education, computer science education is a much younger field. In the history of computing, digital computers were only built from around the 1940s – although computation has been around for centuries since the invention of analog computers.",
  },
  {
    id: 8,
    question: "Data Science Algorithms and Applications",
    faculty: "Dr Kalidas Yeturu",
    profile1: "dr-kalidas-yeturu",
    answer:
      "Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data and apply knowledge and actionable insights from data across a broad range of application domains. Data science is related to data mining, machine learning and big data.",
  },
  {
    id: 9,
    question: "High Performance Parallel Computing",
    faculty: "Dr Raghavendra K",
    profile1: "dr-raghavendra-kanakagiri",
    answer:
      "Parallel computing is a type of computation in which many calculations or processes are carried out simultaneously. Large problems can often be divided into smaller ones, which can then be solved at the same time. There are several different forms of parallel computing: bit-level, instruction-level, data, and task parallelism. Parallelism has long been employed in high-performance computing but has gained broader interest due to the physical constraints preventing frequency scaling. As power consumption (and consequently heat generation) by computers has become a concern in recent years, parallel computing has become the dominant paradigm in computer architecture, mainly in the form of multi-core processors.",
  },
  {
    id: 10,
    question: "Internet of things (IoT)",
    faculty: "Dr Mahendran V",
    profile1: "dr-v-mahendran",
    answer:
      'The Internet of things (IoT) describes the network of physical objects "things" that are embedded with sensors, software, and other technologies for the purpose of connecting and exchanging data with other devices and systems over the Internet. Machine learning (ML) is the study of computer algorithms that improve automatically through experience and by the use of data. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as "training data", in order to make predictions or decisions without being explicitly programmed to do so. Machine learning algorithms are used in a wide variety of applications, such as in medicine, email filtering, and computer vision, where it is difficult or unfeasible to develop conventional algorithms to perform the needed tasks.',
  },
  {
    id: 11,
    question: "Machine Learning",
    faculty: "Dr Kalidas Yeturu",
    profile1: "dr-kalidas-yeturu",
    answer:
      'Machine learning (ML) is the study of computer algorithms that can improve automatically through experience and by the use of data. It is seen as a part of artificial intelligence. Machine learning algorithms build a model based on sample data, known as "training data", in order to make predictions or decisions without being explicitly programmed to do so.',
  },
  {
    id: 12,
    question: "Reinforcement Learning",
    faculty: "Dr Ajin George Joseph",
    profile1: "dr-ajin-george-joseph",
    answer:
      "Reinforcement learning (RL) is an area of machine learning concerned with how intelligent agents ought to take actions in an environment in order to maximize the notion of cumulative reward. Reinforcement learning is one of three basic machine learning paradigms, alongside supervised learning and unsupervised learning.",
  },
  {
    id: 13,
    question: "Software Engineering",
    faculty: "Dr Sridhar Chimalakonda",
    profile1: "dr-sridhar-chimalakonda",
    answer:
      "Software engineering is the systematic application of engineering approaches to the development of software. Software is a collection of instructions and data that tell a computer how to work. This is in contrast to physical hardware, from which the system is built and actually performs the work. In computer science and software engineering, computer software is all information processed by computer systems, including programs and data. Computer software includes computer programs, libraries and related non-executable data, such as online documentation or digital media. Computer hardware and software require each other and neither can be realistically used on its own.",
  },
  {
    id: 14,
    question: "Stochastic Optimization",
    faculty: "Dr Mahendran V, Dr Ajin George Joseph",
    profile1: "dr-v-mahendran",
    profile2: "dr-ajin-george-joseph",
    answer:
      "Stochastic optimization (SO) methods are optimization methods that generate and use random variables. For stochastic problems, the random variables appear in the formulation of the optimization problem itself, which involves random objective functions or random constraints. Stochastic optimization methods also include methods with random iterates. Some stochastic optimization methods use random iterates to solve stochastic problems, combining both meanings of stochastic optimization. Stochastic optimization methods generalize deterministic methods for deterministic problems.",
  },
  {
    id: 15,
    question: "VLSI Test & Verification",
    faculty: "Dr Jaynarayan T Tudu",
    profile1: "dr-jaynarayan-t-tudu",
    answer:
      "Very large-scale integration (VLSI) is the process of creating an integrated circuit (IC) by combining millions of MOS transistors onto a single chip. VLSI began in the 1970s when MOS integrated circuit chips were widely adopted, enabling complex semiconductor and telecommunication technologies to be developed. The microprocessor and memory chips are VLSI devices. Before the introduction of VLSI technology, most ICs had a limited set of functions they could perform. An electronic circuit might consist of a CPU, ROM, RAM and other glue logic. VLSI lets IC designers add all of these into one chip.",
  },
  {
    id: 16,
    question: "Wireless Networks",
    faculty: "Prof Venkata Ramana Badarla, Dr Mahendran V",
    profile1: "prof-venkata-ramana-badarla",
    profile2: "dr-v-mahendran",
    answer:
      "A wireless network is a computer network that uses wireless data connections between network nodes.Wireless networking is a method by which homes, telecommunications networks and business installations avoid the costly process of introducing cables into a building, or as a connection between various equipment locations.Examples of wireless networks include cell phone networks, wireless local area networks (WLANs), wireless sensor networks, satellite communication networks, and terrestrial microwave networks.",
  },
];

export default function AreasPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Use the metadata hook
  usePageMetadata({
    title: 'Research Areas - Computer Science & Engineering, IIT Tirupati',
    description: 'Explore the diverse research areas in the Department of Computer Science & Engineering at IIT Tirupati. Learn about AI, Machine Learning, Cloud Computing, and more.',
    keywords: ['Research Areas', 'CSE Research', 'AI Research', 'Machine Learning', 'Cloud Computing', 'Computer Networks', 'Computer Vision', 'IoT', 'VLSI', 'Software Engineering', 'Algorithms', 'Data Structures', 'High Performance Computing', 'Wireless Networks', 'Stochastic Optimization', 'Reinforcement Learning'],
    ogTitle: 'Research Areas - Computer Science & Engineering, IIT Tirupati',
    ogDescription: 'Explore the diverse research areas in the Department of Computer Science & Engineering at IIT Tirupati.',
    ogImage: '/assets/images/research-areas-og.png',
    ogUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cse.iittp.ac.in'}/research/areas`,
  });
  
  // Use useEffect to handle client-side only code
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Research Areas
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Explore our diverse research areas and the faculty members leading
              innovative technological advancements
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* Decorative Elements */}
       

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {areas.map((area) => {
            const categoryStyle = getCategoryStyle(area.question);
            return (
              <motion.div
                key={area.id}
                variants={fadeIn}
                // onHoverStart={() => setHoveredId(area.id)}
                // onHoverEnd={() => setHoveredId(null)}
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border ${categoryStyle.borderColor}`}
                style={{
                  height: expandedId === area.id ? "auto" : "auto",
                  minHeight: "100px",
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryStyle.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Category Icon */}
                {/* <div
                  className={`absolute top-4 right-4 p-2 rounded-xl bg-gradient-to-br ${
                    categoryStyle.gradient
                  } text-white transform transition-transform duration-500 ${
                    hoveredId === area.id ? "scale-110" : "scale-100"
                  }`}
                >
                  {categoryStyle.icon}
                </div> */}

                <div className="relative p-6">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === area.id ? null : area.id)
                    }
                  >
                    <div className="flex items-start pr-16 mb-4">
                      <h3
                        className={`text-xl font-bold ${categoryStyle.textColor} group-hover:text-opacity-80 transition-colors duration-300`}
                      >
                        {area.question}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <AcademicCapIcon
                        className={`h-4 w-4 ${categoryStyle.textColor}`}
                      />
                      <span className="font-medium flex flex-wrap gap-2">
                        {area.faculty.split(", ").map((name, index) => {
                          const profile =
                            index === 0 ? area.profile1 : area.profile2;
                          return (
                            <span
                              key={index}
                              className="flex items-center gap-1"
                            >
                              <Link
                                href={`/people/faculty/${profile}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${categoryStyle.textColor} `}
                              >
                                {name}
                              </Link>
                              {index < area.faculty.split(", ").length - 1 &&
                                ","}
                            </span>
                          );
                        })}
                      </span>
                    </div>

                    <AnimatePresence>
                      {expandedId === area.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            transition: {
                              duration: 0.4,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            transition: {
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm leading-relaxed text-gray-600 text-justify">
                              {area.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      className={`absolute bottom-6 right-6 p-2 rounded-xl  pb-2${
                        expandedId === area.id ? "bg-gray-100" : "bg-gray-50"
                      } ${
                        categoryStyle.textColor
                      } transition-all duration-300 transform ${
                        expandedId === area.id ? "rotate-180" : "rotate-0"
                      }`}
                      aria-label={
                        expandedId === area.id ? "Collapse" : "Expand"
                      }
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
