
import { Company } from "@/components/admin/companies/types";

// Mock API endpoint - replace with real API endpoint when available
const MOCK_DELAY = 800;

export const getCompanies = async (): Promise<Company[]> => {
  // Simulating API call with mock data
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  return [
    {
      id: 1,
      name: "Acme Corporation",
      industry: "Manufacturing",
      dateOnboarded: "Jan 15, 2025",
      modules: ["Labour Planning", "Real Estate IQ", "Divorce IQ"],
      status: "active",
    },
    {
      id: 2,
      name: "TechGiant Inc",
      industry: "Technology",
      dateOnboarded: "Feb 3, 2025",
      modules: ["Labour Planning", "Real Estate IQ"],
      status: "active",
    },
    {
      id: 3,
      name: "Small Business LLC",
      industry: "Retail",
      dateOnboarded: "Dec 10, 2024",
      modules: ["Labour Planning"],
      status: "active",
    },
    {
      id: 4,
      name: "Enterprise Solutions",
      industry: "Consulting",
      dateOnboarded: "Mar 22, 2025",
      modules: ["Real Estate IQ", "Module 4", "Module 5"],
      status: "active",
    },
    {
      id: 5,
      name: "Old Corp",
      industry: "Finance",
      dateOnboarded: "Nov 5, 2024",
      modules: ["Divorce IQ"],
      status: "suspended",
    },
  ];
};
