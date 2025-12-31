import { Banknote, Clock, Percent, Target, TrendingUp, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface LoanData {
  loanAmount: string;
  loanTenure: string;
  monthlyEmi: string;
  interestRate: string;
  dbr?: string;
  buildingConstruction?: string;
  flatExtensionRenovation?: string;
  landBuildingConstruction?: string;
  readymadeFlat?: string;
}

interface LoanDetailsProps {
  loan: LoanData;
}

const LoanDetails = ({ loan }: LoanDetailsProps) => {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-BD').format(num);
  };

  const dbrValue = loan.dbr ? parseFloat(loan.dbr) : 0;

  const getDbrStatus = (dbr: number) => {
    if (dbr <= 40) return { color: "text-success", bg: "bg-success", label: "Healthy" };
    if (dbr <= 55) return { color: "text-warning", bg: "bg-warning", label: "Moderate" };
    return { color: "text-destructive", bg: "bg-destructive", label: "High Risk" };
  };

  const dbrStatus = getDbrStatus(dbrValue);

  // Build purpose string from flags
  const getPurposes = () => {
    const purposes: string[] = [];
    if (loan.buildingConstruction === "1") purposes.push("Building Construction");
    if (loan.flatExtensionRenovation === "1") purposes.push("Flat Extension/Renovation");
    if (loan.landBuildingConstruction === "1") purposes.push("Land & Building Construction");
    if (loan.readymadeFlat === "1") purposes.push("Readymade Flat Purchase");
    return purposes.length > 0 ? purposes.join(", ") : "House Building Loan";
  };

  const tenorMonths = parseInt(loan.loanTenure) || 0;

  return (
    <Card className="animate-slide-up shadow-card hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Banknote className="w-5 h-5 text-primary-foreground" />
          </div>
          Loan Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Loan Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LoanMetric
            icon={<Banknote className="w-4 h-4" />}
            label="Loan Amount"
            value={formatNumber(loan.loanAmount)}
            subValue="BDT"
            highlight
          />
          <LoanMetric
            icon={<Clock className="w-4 h-4" />}
            label="Tenor"
            value={`${tenorMonths} Months`}
            subValue={`(${(tenorMonths / 12).toFixed(1)} Years)`}
          />
          <LoanMetric
            icon={<TrendingUp className="w-4 h-4" />}
            label="EMI Amount"
            value={formatCurrency(loan.monthlyEmi)}
          />
          <LoanMetric
            icon={<Percent className="w-4 h-4" />}
            label="Interest Rate"
            value={`${loan.interestRate}%`}
            subValue="per annum"
          />
        </div>

        {/* Purpose */}
        <div className="p-4 rounded-lg bg-accent/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Loan Purpose</span>
          </div>
          <p className="text-sm text-muted-foreground">{getPurposes()}</p>
        </div>

        {/* DBR Section */}
        {loan.dbr && (
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-medium text-foreground">Debt Burden Ratio (DBR)</span>
                <p className="text-xs text-muted-foreground">Total debt obligations vs. income</p>
              </div>
              <Badge className={`${dbrStatus.color} bg-transparent border ${dbrStatus.bg}/20`}>
                {dbrStatus.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${dbrStatus.color}`}>{dbrValue}%</span>
                <span className="text-xs text-muted-foreground">Threshold: 55%</span>
              </div>
              <Progress 
                value={dbrValue} 
                max={100}
                className="h-3"
                style={{
                  background: 'hsl(var(--muted))',
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>40%</span>
                <span>55%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

const LoanMetric = ({ 
  icon, 
  label, 
  value, 
  subValue, 
  highlight 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  subValue?: string;
  highlight?: boolean;
}) => (
  <div className={`p-4 rounded-lg ${highlight ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20' : 'bg-muted/50'}`}>
    <div className="flex items-center gap-2 mb-2">
      <span className={highlight ? 'text-primary' : 'text-muted-foreground'}>{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`text-lg font-bold ${highlight ? 'gradient-text' : 'text-foreground'}`}>{value}</p>
    {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
  </div>
);

export default LoanDetails;
