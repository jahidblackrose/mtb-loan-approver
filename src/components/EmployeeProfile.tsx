import { User, Building2, Calendar, Briefcase, Users, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeeData {
  photo?: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  division: string;
  joiningDate: string;
  employmentStatus: "Permanent" | "Contractual" | "Probation";
  mobile?: string;
  applyDate?: string;
}

interface EmployeeProfileProps {
  employee: EmployeeData;
}

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
  const statusColors = {
    Permanent: "bg-success/10 text-success border-success/20",
    Contractual: "bg-warning/10 text-warning border-warning/20",
    Probation: "bg-primary/10 text-primary border-primary/20",
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
                  {employee.photo ? (
                    <img 
                      src={employee.photo} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
              </div>
              <Badge 
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs px-2 ${statusColors[employee.employmentStatus]}`}
              >
                {employee.employmentStatus}
              </Badge>
            </div>
          </div>

          {/* Employee Info */}
          <div className="flex-1 space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-foreground">{employee.name}</h2>
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
              <InfoItem 
                icon={<Users className="w-4 h-4" />}
                label="Division"
                value={employee.division}
              />
              <InfoItem 
                icon={<Calendar className="w-4 h-4" />}
                label="Joining Date"
                value={employee.joiningDate}
              />
              {employee.mobile && (
                <InfoItem 
                  icon={<Phone className="w-4 h-4" />}
                  label="Mobile"
                  value={employee.mobile}
                />
              )}
              {employee.applyDate && (
                <InfoItem 
                  icon={<Calendar className="w-4 h-4" />}
                  label="Apply Date"
                  value={employee.applyDate}
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
