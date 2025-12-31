import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ShieldX } from "lucide-react";
import Header from "@/components/Header";
import EmployeeProfile, { EmployeeData } from "@/components/EmployeeProfile";
import LoanDetails, { LoanData } from "@/components/LoanDetails";
import ReviewSection, { ReviewData } from "@/components/ReviewSection";
import DecisionSection from "@/components/DecisionSection";
import mLine from "@/assets/m-line.png";
import employeeAvatar from "@/assets/employee-avatar.jpg";

// Demo data matching API response structure
const employeeData: EmployeeData = {
  Photo: employeeAvatar,
  fullName: "Md. Mahmudul Haque Khan",
  applicationId: "2025000004",
  employeeId: "C4148",
  designation: "Junior Asst Vice President",
  department: "MTB Digital Banking Division",
  divisionHead: "Khalid Hossin",
  joiningDate: "11/3/2025 12:00:00 AM",
  employeeType: "Regular",
  mobileNumber: "01855333129",
  applicationDate: "12/23/2025 12:00:00 AM",
};

const loanData: LoanData = {
  loanAmount: "6870000",
  interestRate: "4.5",
  loanTenure: "131",
  monthlyEmi: "66471",
  dbr: "",
  buildingConstruction: "1",
  flatExtensionRenovation: "1",
  landBuildingConstruction: "1",
  readymadeFlat: "1",
};

const reviewData: ReviewData[] = [
  {
    title: "Line Manager Review",
    subTitle: "Reporting Authority",
    byName: "Khalid Hossin",
    status: "Approved",
    byDate: "12/30/2025 12:00:00 AM",
    byRemark: "Employee performance is satisfactory. Recommended for loan approval based on service record and conduct.",
  },
  {
    title: "CIB Review",
    subTitle: "Credit Information Bureau",
    byName: "Md. Jahidur Rahman",
    status: "Pending",
    byDate: "12/28/2025 12:00:00 AM",
    byRemark: "CIB report verified. No overdue or classified loans found. Credit history is satisfactory.",
  },
  {
    title: "CAD Review",
    subTitle: "Credit Administration",
    byName: "AVIJIT SARKAR",
    status: "Approved",
    byDate: "12/28/2025 12:00:00 AM",
    byRemark: "Awaiting final valuation report from approved surveyor.",
  },
  {
    title: "Legal Review",
    subTitle: "Legal and Compliance",
    byName: "Aynul Haque",
    status: "Approved",
    byDate: "12/28/2025 12:00:00 AM",
    byRemark: "Property documents verified. Title deed is clear. No encumbrance found. Mutation records are in order.",
  },
  {
    title: "HR Review",
    subTitle: "Human Resources",
    byName: "Md. Hakimur Rahman",
    status: "Approved",
    byDate: "12/30/2025 12:00:00 AM",
    byRemark: "Employee service record verified. No disciplinary action on file. Salary and benefits confirmed as per records.",
  },
];

const Index = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("ID");

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

  // Show error page if no ID parameter
  if (!applicationId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">
            Invalid or missing application reference. Please use a valid link to access the loan application.
          </p>
        </div>
      </div>
    );
  }

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
