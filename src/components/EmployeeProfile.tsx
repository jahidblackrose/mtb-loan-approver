import { User, Building2, Calendar, Briefcase, Users, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface EmployeeData {
  Photo?: string;
  fullName: string;
  applicationId: string;
  employeeId: string;
  designation: string;
  department: string;
  divisionHead?: string;
  joiningDate: string;
  employeeType: string;
  mobileNumber?: string;
  applicationDate?: string;
}

interface EmployeeProfileProps {
  employee: EmployeeData;
}

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
  const getStatusColors = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === "regular" || normalizedStatus === "permanent") {
      return "bg-success/10 text-success border-success/20";
    }
    if (normalizedStatus === "contractual") {
      return "bg-warning/10 text-warning border-warning/20";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="overflow-hidden animate-slide-up shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <div className="h-2 bg-gradient-to-r from-primary via-pink-500 to-secondary" />
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  {employee.Photo ? (
                    <img 
                      src={employee.Photo.startsWith('data:') ? employee.Photo : `data:image/jpeg;base64,${employee.Photo}`} 
                      alt={employee.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Badge 
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 ${getStatusColors(employee.employeeType)}`}
              >
                {employee.employeeType}
              </Badge>
            </div>
          </div>

          {/* Employee Info */}
          <div className="flex-1 space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-foreground">{employee.fullName}</h2>
              <p className="text-sm text-muted-foreground">ID: {employee.employeeId}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoItem 
                icon={<Briefcase className="w-4 h-4" />}
                label="Designation"
                value={employee.designation}
              />
              <InfoItem 
                icon={<Building2 className="w-4 h-4" />}
                label="Department"
                value={employee.department}
              />
              {employee.divisionHead && (
                <InfoItem 
                  icon={<Users className="w-4 h-4" />}
                  label="Division Head"
                  value={employee.divisionHead}
                />
              )}
              <InfoItem 
                icon={<Calendar className="w-4 h-4" />}
                label="Joining Date"
                value={formatDate(employee.joiningDate)}
              />
              {employee.mobileNumber && (
                <InfoItem 
                  icon={<Phone className="w-4 h-4" />}
                  label="Mobile"
                  value={employee.mobileNumber}
                />
              )}
              {employee.applicationDate && (
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Apply Date"
                  value={formatDate(employee.applicationDate)}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <div className="p-1.5 rounded-md bg-accent text-accent-foreground">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value}</p>
    </div>
  </div>
);

export default EmployeeProfile;
