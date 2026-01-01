import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ShieldX, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import EmployeeProfile, { EmployeeData } from "@/components/EmployeeProfile";
import LoanDetails, { LoanData } from "@/components/LoanDetails";
import ReviewSection, { ReviewData } from "@/components/ReviewSection";
import DecisionSection from "@/components/DecisionSection";
import mLine from "@/assets/m-line.png";
import { 
  fetchAllData, 
  generateOtp, 
  resendOtp, 
  validateOtp,
  EmployeeApiData,
  ReviewApiData 
} from "@/services/apiService";

// Transform API response to component format
const transformEmployeeData = (apiData: EmployeeApiData): EmployeeData => ({
  Photo: apiData.Photo,
  FullName: apiData.FullName,
  ApplicationId: apiData.ApplicationId,
  EmployeeId: apiData.EmployeeId,
  Designation: apiData.Designation,
  Department: apiData.Department,
  JoiningDate: apiData.JoiningDate,
  EmployeeType: apiData.EmployeeType,
  MobileNumber: apiData.MobileNumber,
  ApplicationDate: apiData.ApplicationDate,
});

const transformLoanData = (apiData: EmployeeApiData): LoanData => ({
  LoanAmount: apiData.LoanAmount,
  LoanTenure: apiData.LoanTenure,
  MonthlyEmi: apiData.MonthlyEmi,
  InterestRate: apiData.InterestRate,
  Dbr: apiData.Dbr,
  BuildingConstruction: apiData.BuildingConstruction,
  FlatExtensionRenovation: apiData.FlatExtensionRenovation,
  LandBuildingConstruction: apiData.LandBuildingConstruction,
  ReadymadeFlat: apiData.ReadymadeFlat,
});

const transformReviewData = (apiData: ReviewApiData[]): ReviewData[] =>
  apiData.map((review) => ({
    Title: review.Title,
    SubTitle: review.SubTitle,
    ByName: review.ByName,
    Status: review.Status,
    ByDate: review.ByDate,
    ByRemark: review.ByRemark,
  }));

const Index = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("ID");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [loanData, setLoanData] = useState<LoanData | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData[]>([]);
  const [accessUserId, setAccessUserId] = useState<string>("");

  const [decision, setDecision] = useState<{
    status?: "approved" | "rejected" | "pending";
    decidedBy?: string;
    decidedAt?: string;
    remarks?: string;
  }>({ status: "pending" });

  // Fetch data on mount
  useEffect(() => {
    if (!applicationId) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetchAllData(applicationId);
        
        if (response.Status === "200" && response.EmployeeDataList.length > 0) {
          const empData = response.EmployeeDataList[0];
          setEmployeeData(transformEmployeeData(empData));
          setLoanData(transformLoanData(empData));
          setReviewData(transformReviewData(response.ReviewDataList));
          setAccessUserId(empData.accessuserid);
        } else {
          setError(response.Message || "Failed to load application data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [applicationId]);

  const handleGenerateOtp = async (action: "A" | "R", remarks: string) => {
    if (!applicationId) return { success: false, message: "Invalid application ID" };
    
    try {
      const response = await generateOtp(applicationId, accessUserId, action, remarks);
      return {
        success: response.Status === "200",
        message: response.Message,
      };
    } catch (err) {
      console.error("Error generating OTP:", err);
      return { success: false, message: "Failed to generate OTP" };
    }
  };

  const handleResendOtp = async () => {
    if (!applicationId) return { success: false, message: "Invalid application ID" };
    
    try {
      const response = await resendOtp(applicationId, accessUserId);
      return {
        success: response.Status === "200",
        message: response.Message,
      };
    } catch (err) {
      console.error("Error resending OTP:", err);
      return { success: false, message: "Failed to resend OTP" };
    }
  };

  const handleValidateOtp = async (otp: string) => {
    if (!applicationId) return { success: false, message: "Invalid application ID" };
    
    try {
      const response = await validateOtp(applicationId, accessUserId, otp);
      return {
        success: response.Status === "200",
        message: response.Message,
      };
    } catch (err) {
      console.error("Error validating OTP:", err);
      return { success: false, message: "Failed to validate OTP" };
    }
  };

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
      decidedBy: employeeData?.FullName || "User",
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading application data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employeeData || !loanData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Error</h1>
          <p className="text-muted-foreground">
            {error || "Failed to load application data"}
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
          onGenerateOtp={handleGenerateOtp}
          onResendOtp={handleResendOtp}
          onValidateOtp={handleValidateOtp}
          isReadOnly={decision.status !== "pending"}
        />
      </main>
    </div>
  );
};

export default Index;
