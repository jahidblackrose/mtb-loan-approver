import { Banknote, Clock, Percent, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LoanData {
  amount: number;
  tenorMonths: number;
  emiAmount: number;
  interestRate: number;
  purpose: string;
  dbr: number;
  existingExposure?: {
    type: string;
    amount: number;
    outstanding: number;
  }[];
}

interface LoanDetailsProps {
  loan: LoanData;
}

const LoanDetails = ({ loan }: LoanDetailsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDbrStatus = (dbr: number) => {
    if (dbr <= 40) return { color: "text-success", bg: "bg-success", label: "Healthy" };
    if (dbr <= 55) return { color: "text-warning", bg: "bg-warning", label: "Moderate" };
    return { color: "text-destructive", bg: "bg-destructive", label: "High Risk" };
  };

  const dbrStatus = getDbrStatus(loan.dbr);

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
            value={formatCurrency(loan.amount)}
            highlight
          />
          <LoanMetric
            icon={<Clock className="w-4 h-4" />}
            label="Tenor"
            value={`${loan.tenorMonths} Months`}
            subValue={`(${(loan.tenorMonths / 12).toFixed(1)} Years)`}
          />
          <LoanMetric
            icon={<TrendingUp className="w-4 h-4" />}
            label="EMI Amount"
            value={formatCurrency(loan.emiAmount)}
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
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Loan Purpose</span>
          </div>
          <p className="text-sm text-muted-foreground">{loan.purpose}</p>
        </div>

        {/* DBR Section */}
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
              <span className={`text-2xl font-bold ${dbrStatus.color}`}>{loan.dbr}%</span>
              <span className="text-xs text-muted-foreground">Threshold: 55%</span>
            </div>
            <Progress 
              value={loan.dbr} 
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

        {/* Existing Exposure */}
        {loan.existingExposure && loan.existingExposure.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Existing Loan Exposure</h4>
            <div className="space-y-2">
              {loan.existingExposure.map((exposure, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{exposure.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Limit: {formatCurrency(exposure.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(exposure.outstanding)}
                    </p>
                    <p className="text-xs text-muted-foreground">Outstanding</p>
                  </div>
                </div>
              ))}
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
