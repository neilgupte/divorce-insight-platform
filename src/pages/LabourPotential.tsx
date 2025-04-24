
import React from "react"; // Add React import
import MainLayout from "@/components/layout/MainLayout";
import { Outlet } from "react-router-dom";

const LabourPotential = () => {
  return <MainLayout><Outlet /></MainLayout>;
};

export default LabourPotential;
