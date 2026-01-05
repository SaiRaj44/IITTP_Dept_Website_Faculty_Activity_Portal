import { NextResponse } from "next/server";
import { ResearchScholar } from "@/app/types/research-scholar";

// Mock data for development
const mockScholars: ResearchScholar[] = [
  {
    _id: "1",
    category: "PhD Regular",
    name: "Arun Kumar",
    supervisor: "Dr. Sridhar Chimalakonda",
    email: "arun@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Machine Learning, Computer Vision",
    joinedYear: "2020",
    thesis: "Deep Learning Applications in Medical Imaging",
    order: 1,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "2",
    category: "PhD Regular",
    name: "Priya Sharma",
    supervisor: "Dr. Piyush Rai",
    email: "priya@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Natural Language Processing",
    joinedYear: "2021",
    thesis: "Transformer Models for Low-Resource Languages",
    linkedin: "https://linkedin.com/in/priyasharma",
    github: "https://github.com/priyasharma",
    order: 2,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "3",
    category: "PhD External",
    name: "Rajesh Verma",
    supervisor: "Dr. Vineeth N Balasubramanian",
    email: "rajesh@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Reinforcement Learning",
    joinedYear: "2019",
    thesis: "Multi-Agent Reinforcement Learning for Autonomous Systems",
    github: "https://github.com/rajeshverma",
    order: 3,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "4",
    category: "MS Regular",
    name: "Sneha Patel",
    supervisor: "Dr. Antony Franklin",
    email: "sneha@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Computer Networks, IoT",
    joinedYear: "2022",
    thesis: "Network Optimization for IoT Environments",
    linkedin: "https://linkedin.com/in/snehapatel",
    personalWebsite: "https://snehapatel.com",
    order: 4,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "5",
    category: "PhD External",
    name: "Vikram Singh",
    supervisor: "Dr. Ramakrishna Upadrasta",
    email: "vikram@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Compiler Optimization",
    joinedYear: "2021",
    thesis: "Optimizing Compilers for Heterogeneous Computing",
    publications: "5 Conference Papers, 2 Journal Articles",
    order: 5,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "6",
    category: "MS Regular",
    name: "Karthik Raja",
    supervisor: "Dr. Ponnurangam Kumaraguru",
    email: "karthik@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Cybersecurity, Privacy",
    joinedYear: "2022",
    thesis: "Privacy-Preserving Machine Learning Models",
    github: "https://github.com/karthikraja",
    order: 6,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "7",
    category: "PhD Regular",
    name: "Neeraj Sharma",
    supervisor: "Dr. Saurabh Joshi",
    email: "neeraj@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Formal Verification, SAT/SMT Solvers",
    joinedYear: "2019",
    thesis: "Efficient Verification Techniques for Hardware Systems",
    github: "https://github.com/neerajsharma",
    order: 7,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "8",
    category: "PhD External",
    name: "Lakshmi Narayan",
    supervisor: "Dr. Raghavendra Rao",
    email: "lakshmi@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Cryptography, Blockchain",
    joinedYear: "2020",
    thesis: "Security Protocols for Distributed Systems",
    publications: "3 Conference Papers, 1 Journal Article",
    linkedin: "https://linkedin.com/in/lakshminarayan",
    order: 8,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  },
  {
    _id: "9",
    category: "MS Regular",
    name: "Akshay Reddy",
    supervisor: "Dr. Santosh Biswas",
    email: "akshay@iittp.ac.in",
    imageUrl: "/assets/images/default-profile.png",
    researchArea: "Embedded Systems, VLSI Design",
    joinedYear: "2021",
    thesis: "Energy-Efficient Architectures for Edge Computing",
    personalWebsite: "https://akshayreddy.me",
    order: 9,
    createdBy: "admin",
    published: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01"
  }
];

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      data: mockScholars,
      message: "Research scholars data retrieved successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Error in research-scholars API route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch research scholars information" },
      { status: 500 }
    );
  }
} 