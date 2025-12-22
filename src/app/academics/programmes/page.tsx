"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AcademicCapIcon,
  BookOpenIcon,
  BeakerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";

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

interface CurriculumYear {
  year: string;
  link: string;
}

interface Program {
  id: string;
  title: string;
  type: "research" | "course";
  icon: React.ReactNode;
  description: string;
  curriculumYears?: CurriculumYear[];
}

export default function ProgrammesPage() {
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  const programs: Program[] = [
    {
      id: "btech",
      title: "B.Tech. Program",
      type: "course",
      icon: <AcademicCapIcon className="h-6 w-6" />,
      description:
        "The B.Tech. program is a four-year course oriented undergraduate program. The course work is spread across all the semesters. See here for the detailed curriculum. The courses include a set of core courses offered by the department, a set of departmental electives and some free electives. There will be a B.Tech project in the final sem of the program.",
      curriculumYears: [
        {
          year: "2019",
          link: "https://cse.iittp.ac.in/website/wp-content/uploads/2022/08/Curriculum-BTech-2019.pdf",
        },
        {
          year: "2018",
          link: "https://cse.iittp.ac.in/website/wp-content/uploads/2021/10/Curriculum-BTech-2018.pdf",
        },
        {
          year: "2017",
          link: "https://cse.iittp.ac.in/website/wp-content/uploads/2021/10/Curriculum-BTech-2017.pdf",
        },
        {
          year: "2016",
          link: "https://cse.iittp.ac.in/website/wp-content/uploads/2021/09/CSE_curriculum_B.Tech_2016.pdf",
        },
        {
          year: "2015",
          link: "https://cse.iittp.ac.in/website/wp-content/uploads/2021/09/CSE_Curriculum_B.Tech_2015.pdf",
        },
      ],
    },
    {
      id: "mtech",
      title: "M.Tech. Program",
      type: "course",
      icon: <AcademicCapIcon className="h-6 w-6" />,
      description:
        "The M.Tech. program is a two-year course oriented graduate program. The student has to take a set of core courses and a set of electives. The course work is spread across the first two semesters with an option of taking one elective in the third semester. This is followed by a project in the third and fourth semester in which the student can take up a project of his or her interest, supervised by a faculty member.",
      curriculumYears: [
        {
          year: "2020",
          link: "https://cse.iittp.ac.in/wp-content/uploads/2022/08/M.Tech-CSE-2020-21.pdf",
        },
        {
          year: "2019",
          link: "https://cse.iittp.ac.in/wp-content/uploads/2021/10/Curriculum-MTech-2019.pdf",
        },
        {
          year: "2018",
          link: "https://cse.iittp.ac.in/wp-content/uploads/2021/10/Curriculum-MTech-2018.pdf",
        },
      ],
    },
    {
      id: "dual",
      title: "Dual Degree Program",
      type: "course",
      icon: <AcademicCapIcon className="h-6 w-6" />,
      description:
        "The Dual Degree program is a five-year program. At the end of five years, the student is awarded both a B.Tech. and M.Tech. degree.",
      curriculumYears: [
        {
          year: "2018",
          link: "https://cse.iittp.ac.in/wp-content/uploads/2022/08/Curriculum-Dual-2018.pdf",
        },
        {
          year: "2017",
          link: "https://cse.iittp.ac.in/wp-content/uploads/2021/10/Curriculum-Dual-2017.pdf",
        },
      ],
    },
    {
      id: "ms-regular",
      title: "M.S. (Regular) Research Program",
      type: "research",
      icon: <BeakerIcon className="h-6 w-6" />,
      description:
        "The M.S (Research) program is a postgraduate research-oriented program. The scholar works in an area of his/her interest under the supervision of a faculty member. The scholar has to obtain a minimum number of credits by taking courses. The highlight of the program is the independent research work taken by scholar, leading to a dissertation at the end of the program. The average duration of an M.S. program is between two to three years.",
    },
    {
      id: "ms-external",
      title: "M.S. (External) Research Program",
      type: "research",
      icon: <BeakerIcon className="h-6 w-6" />,
      description:
        "The M.S (External) Research program is a postgraduate research-oriented program. The scholar works in an area of his/her interest under the supervision of a faculty member. The scholar has to obtain a minimum number of credits by taking courses. The highlight of the program is the independent research work taken by scholar, leading to a dissertation at the end of the program. The average duration of an M.S. program is between two to three years. The scholar taken into this program should have relevant work experience as mentioned in the admission criteria. The scholar has to submit a No Objection Certificate from their current organization.",
    },
    {
      id: "phd-regular",
      title: "PhD (Regular) Research Program",
      type: "research",
      icon: <BeakerIcon className="h-6 w-6" />,
      description:
        "The PhD (Regular) program is a postgraduate research-oriented program. The scholar works in an area of his/her interest under the supervision of a faculty member. The scholar has to obtain a minimum number of credits by taking courses. The highlight of the program is the independent research work taken by scholar, leading to a dissertation at the end of the program. The average duration of a PhD. program is between four to five years.",
    },
    {
      id: "phd-external",
      title: "PhD (External) Research Program",
      type: "research",
      icon: <BeakerIcon className="h-6 w-6" />,
      description:
        "The PhD (External) program is a postgraduate research-oriented program. The scholar works in an area of his/her interest under the supervision of a faculty member. The scholar has to obtain a minimum number of credits by taking courses. The highlight of the program is the independent research work taken by scholar, leading to a dissertation at the end of the program. The average duration of a PhD. program is between four to five years. The scholar taken into this program should have relevant work experience as mentioned in the admission criteria. The scholar has to submit a No Objection Certificate from their current organization.",
    },
  ];

  const toggleProgram = (id: string) => {
    setExpandedProgram(expandedProgram === id ? null : id);
  };

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
              Academic Programs
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              The Department offers the following academic programs
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Program Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Course Oriented Programs */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Course Oriented Programs
              </h2>
            </div>
            <p className="text-gray-600">
              Structured academic programs with comprehensive coursework and
              practical training.
            </p>
          </motion.div>

          {/* Research Programs */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center mb-4">
              <BeakerIcon className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                Research Programs
              </h2>
            </div>
            <p className="text-gray-600">
              Advanced research-oriented programs focusing on independent
              research and innovation.
            </p>
          </motion.div>
        </div>

        {/* Programs List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={fadeIn}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                program.type === "research"
                  ? "border-l-4 border-purple-500"
                  : "border-l-4 border-blue-500"
              }`}
            >
              <button
                onClick={() => toggleProgram(program.id)}
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span
                    className={`mr-4 ${
                      program.type === "research"
                        ? "text-purple-500"
                        : "text-blue-500"
                    }`}
                  >
                    {program.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {program.title}
                  </h3>
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedProgram === program.id ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {expandedProgram === program.id && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-gray-600 mb-4">{program.description}</p>

                  {program.curriculumYears && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Curriculum List
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.curriculumYears.map((year) => (
                          <a
                            key={year.year}
                            href={year.link}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              program.type === "research"
                                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                            target="_blank"
                          >
                            {year.year}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
