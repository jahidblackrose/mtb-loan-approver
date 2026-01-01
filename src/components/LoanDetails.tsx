import { Banknote, Calendar, Percent, Calculator, Home, Building, PenTool, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface LoanData {
  LoanAmount: string;
  LoanTenure: string;
  MonthlyEmi: string;
  InterestRate: string;
  Dbr?: string;
  BuildingConstruction?: string;
  FlatExtensionRenovation?: string;
  LandBuildingConstruction?: string;
  ReadymadeFlat?: string;
}

interface LoanDetailsProps {
  loan: LoanData;
}

const LoanDetails = ({ loan }: LoanDetailsProps) => {
  const formatAmount = (amount: string) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return amount;
    
    // Convert to crore/lakh format
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} L`;
    }
    return num.toLocaleString('en-IN');
  };

  const formatEmi = (amount: string) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return amount;
    return num.toLocaleString('en-IN');
  };

  const purposes = [
    { key: 'BuildingConstruction', label: 'Building Construction', icon: <Building className="w-3 h-3" /> },
    { key: 'FlatExtensionRenovation', label: 'Flat/Extension/Renovation', icon: <PenTool className="w-3 h-3" /> },
    { key: 'LandBuildingConstruction', label: 'Land & Building', icon: <MapPin className="w-3 h-3" /> },
    { key: 'ReadymadeFlat', label: 'Readymade Flat', icon: <Home className="w-3 h-3" /> },
  ];

  const activePurposes = purposes.filter(p => loan[p.key as keyof LoanData] === "1");

  return (
    <Card className="overflow-hidden animate-slide-up shadow-card" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
            <Banknote className="w-5 h-5 text-primary" />
          </div>
          Loan Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Amount Display */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/10">
          <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-4xl font-bold text-primary">{formatAmount(loan.LoanAmount)}</p>
            <p className="text-lg text-muted-foreground">BDT</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <MetricCard 
            icon={<Calendar className="w-4 h-4" />}
            label="Tenure"
            value={`${loan.LoanTenure} Mo`}
          />
          <MetricCard 
            icon={<Calculator className="w-4 h-4" />}
            label="Monthly EMI"
            value={`৳${formatEmi(loan.MonthlyEmi)}`}
          />
          <MetricCard 
            icon={<Percent className="w-4 h-4" />}
            label="Interest"
            value={`${loan.InterestRate}%`}
          />
        </div>

        {/* Loan Purpose */}
        {activePurposes.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Loan Purpose</p>
            <div className="flex flex-wrap gap-2">
              {activePurposes.map((purpose) => (
                <Badge 
                  key={purpose.key}
                  variant="secondary"
                  className="flex items-center gap-1.5 px-3 py-1"
                >
                  {purpose.icon}
                  {purpose.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="text-center p-3 rounded-lg bg-accent/50 border border-border">
    <div className="flex justify-center mb-2 text-muted-foreground">
      {icon}
    </div>
    <p className="text-lg font-semibold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default LoanDetails;
