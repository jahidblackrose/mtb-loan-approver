import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import EmployeeProfile from "@/components/EmployeeProfile";
import LoanDetails from "@/components/LoanDetails";
import ReviewSection from "@/components/ReviewSection";
import DecisionSection from "@/components/DecisionSection";
import mLine from "@/assets/m-line.png";
import employeeAvatar from "@/assets/employee-avatar.jpg";

// Demo data
const employeeData = {
  photo: employeeAvatar,
  name: "Mohammad Rafiqul Islam",
  employeeId: "MTB-2019-0847",
  designation: "Senior Manager",
  department: "Corporate Banking",
  division: "Commercial Division",
  divisionHead: "Mr. Anis Rahman",
  joiningDate: "15 March, 2019",
  employmentStatus: "Permanent" as const,
};

const loanData = {
  amount: 5000000,
  tenorMonths: 180,
  emiAmount: 48500,
  interestRate: 9.5,
  purpose: "Construction of residential house on owned land at Uttara, Dhaka. Plot size 4 katha, proposed construction 2,500 sq ft.",
  dbr: 42,
  existingExposure: [
    { type: "Car Loan", amount: 1500000, outstanding: 850000 },
    { type: "Credit Card", amount: 300000, outstanding: 45000 },
  ],
};

const reviewData = [
  {
    title: "HR Verification",
    department: "Human Resources",
    status: "approved" as const,
    reviewer: "Ms. Fatima Begum",
    date: "28 Dec, 2024",
    remarks: "Employee service record verified. No disciplinary action on file. Salary and benefits confirmed as per records.",
  },
  {
    title: "Legal Review",
    department: "Legal & Compliance",
    status: "approved" as const,
    reviewer: "Mr. Kamal Hossain",
    date: "29 Dec, 2024",
    remarks: "Property documents verified. Title deed is clear. No encumbrance found. Mutation records are in order.",
    attachments: [
      { name: "Title_Deed.pdf", url: "#" },
      { name: "Mutation_Certificate.pdf", url: "#" },
    ],
  },
  {
    title: "CAD Review",
    department: "Credit Administration",
    status: "pending" as const,
    remarks: "Awaiting final valuation report from approved surveyor.",
  },
  {
    title: "CIB Review",
    department: "Credit Information Bureau",
    status: "approved" as const,
    reviewer: "Mr. Nasir Uddin",
    date: "27 Dec, 2024",
    remarks: "CIB report verified. No overdue or classified loans found. Credit history is satisfactory.",
    cibStatus: "Clear",
    cibDate: "27 Dec, 2024",
  },
];

const Index = () => {
  const [decision, setDecision] = useState<{
    status?: "approved" | "rejected" | "pending";
    decidedBy?: string;
    decidedAt?: string;
    remarks?: string;
  }>({ status: "pending" });

  const handleDecision = (status: "approved" | "rejected", remarks: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setDecision({
      status,
      decidedBy: "Mr. Shahid Mahmud (AGM)",
      decidedAt: formattedDate,
      remarks,
    });

    toast({
      title: status === "approved" ? "Loan Approved ✓" : "Loan Rejected",
      description: `Decision has been recorded successfully.`,
      variant: status === "approved" ? "default" : "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background M-line accent */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url(${mLine})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom right',
          backgroundSize: '60%',
        }}
      />

      <Header />
      
      <main className="relative z-10 container max-w-3xl py-6 pb-28 space-y-6">
        {/* Page Title */}
        <div className="text-center space-y-1 animate-fade-in">
          <p className="text-sm font-medium text-primary">
            Mutual Trust Bank PLC
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Loan Application Review
          </h1>
          <p className="text-sm text-muted-foreground">
            Employee House Building Loan (EHBL)
          </p>
        </div>

        {/* Employee Profile */}
        <EmployeeProfile employee={employeeData} />

        {/* Loan Details */}
        <LoanDetails loan={loanData} />

        {/* Management Reviews */}
        <ReviewSection reviews={reviewData} />

        {/* Decision Section */}
        <DecisionSection 
          decision={decision}
          onDecision={handleDecision}
          isReadOnly={decision.status !== "pending"}
        />
      </main>
    </div>
  );
};

export default Index;
