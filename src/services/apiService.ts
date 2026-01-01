// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Endpoints for apiCode generation
const ENDPOINTS = {
  FETCH_ALL_DATA: "get-fetch-all-date-mgt",
  GENERATE_OTP: "generate-otp-mgt",
  REGENERATE_OTP: "regenerate-otp-mgt",
  VALIDATE_OTP: "validate-otp-mgt",
} as const;

// Generate SHA256 hash for apiCode
async function generateApiCode(refId: string, endpoint: string): Promise<string> {
  const text = refId + endpoint;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex.toUpperCase();
}

// API Response Interfaces
export interface EmployeeApiData {
  FullName: string;
  ApplicationId: string;
  EmployeeId: string;
  DateOfBirth: string;
  Nid: string;
  AcademicQualification: string;
  MaritalStatus: string;
  EmployeeType: string;
  Designation: string;
  Department: string;
  DivisionHead: string;
  JoiningDate: string;
  ApplicationDate: string;
  OrgName: string;
  MobileNumber: string;
  Email: string;
  LoanAmount: string;
  InterestRate: string;
  LoanTenure: string;
  MonthlyEmi: string;
  Dbr: string;
  BuildingConstruction: string;
  FlatExtensionRenovation: string;
  LandBuildingConstruction: string;
  ReadymadeFlat: string;
  Photo?: string;
  accessuserid: string;
  accessusername: string;
  accessusermobile: string;
}

export interface ReviewApiData {
  Title: string;
  SubTitle: string;
  ByName: string;
  Status: string;
  ByDate: string;
  ByRemark: string;
}

export interface FetchAllDataResponse {
  Status: string;
  Message: string;
  EmployeeDataList: EmployeeApiData[];
  ReviewDataList: ReviewApiData[];
}

export interface OtpResponse {
  Status: string;
  Message: string;
}

// API 1: Fetch all data
export async function fetchAllData(refId: string): Promise<FetchAllDataResponse> {
  const apiCode = await generateApiCode(refId, ENDPOINTS.FETCH_ALL_DATA);
  
  const response = await fetch(
    `${API_BASE_URL}/ekyc/api/v1/CustomerNotification/get-fetch-all-date-mgt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refId,
        apiCode,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API 2: Generate OTP (for approve/reject button click)
export async function generateOtp(
  refId: string,
  empId: string,
  action: "A" | "R",
  remarks: string
): Promise<OtpResponse> {
  const apiCode = await generateApiCode(refId, ENDPOINTS.GENERATE_OTP);
  
  const response = await fetch(
    `${API_BASE_URL}/ekyc/api/v1/CustomerNotification/generate-otp-mgt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refId,
        empId,
        action,
        remarks,
        apiCode,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API 3: Resend OTP (enabled after 2 min)
export async function resendOtp(refId: string, empId: string): Promise<OtpResponse> {
  const apiCode = await generateApiCode(refId, ENDPOINTS.REGENERATE_OTP);
  
  const response = await fetch(
    `${API_BASE_URL}/ekyc/api/v1/CustomerNotification/regenerate-otp-mgt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refId,
        empId,
        apiCode,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API 4: Validate OTP
export async function validateOtp(
  refId: string,
  empId: string,
  otp: string
): Promise<OtpResponse> {
  const apiCode = await generateApiCode(refId, ENDPOINTS.VALIDATE_OTP);
  
  const response = await fetch(
    `${API_BASE_URL}/ekyc/api/v1/CustomerNotification/validate-otp-mgt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refId,
        empId,
        otp,
        apiCode,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
