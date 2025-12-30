import { useState, useRef } from "react";
import { CheckCircle2, XCircle, Shield, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import OtpModal from "./OtpModal";

interface DecisionData {
  status?: "approved" | "rejected" | "pending";
  decidedBy?: string;
  decidedAt?: string;
  remarks?: string;
}

interface DecisionSectionProps {
  decision?: DecisionData;
  onDecision: (decision: "approved" | "rejected", remarks: string) => void;
  isReadOnly?: boolean;
}

const DecisionSection = ({ decision, onDecision, isReadOnly = false }: DecisionSectionProps) => {
  const [remarks, setRemarks] = useState("");
  const [selectedAction, setSelectedAction] = useState<"approved" | "rejected" | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleActionClick = (action: "approved" | "rejected") => {
    if (!remarks.trim()) {
      setError("Remarks are mandatory before making a decision");
      // Scroll to and focus the remarks textarea
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
      return;
    }
    setError("");
    setSelectedAction(action);
    setShowOtpModal(true);
  };

  const handleOtpVerified = () => {
    if (selectedAction) {
      onDecision(selectedAction, remarks);
    }
    setShowOtpModal(false);
    setSelectedAction(null);
    setRemarks("");
  };

  const statusConfig = {
    approved: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/30",
      label: "Approved",
    },
    rejected: {
      icon: <XCircle className="w-5 h-5" />,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      label: "Rejected",
    },
    pending: {
      icon: <Clock className="w-5 h-5" />,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/30",
      label: "Pending Review",
    },
  };

  if (decision?.status && decision.status !== "pending") {
    const config = statusConfig[decision.status];
    return (
      <Card className="animate-slide-up shadow-card" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-2 rounded-lg ${config.bg}`}>
              <span className={config.color}>{config.icon}</span>
            </div>
            Decision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${config.bg} ${config.border} border`}>
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${config.bg} ${config.color} border ${config.border}`}>
                {config.label}
              </Badge>
              {decision.decidedAt && (
                <span className="text-xs text-muted-foreground">{decision.decidedAt}</span>
              )}
            </div>
            
            {decision.decidedBy && (
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Decided by:</span>
                <span className="text-sm font-medium text-foreground">{decision.decidedBy}</span>
              </div>
            )}

            {decision.remarks && (
              <div className="p-3 rounded-md bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                <p className="text-sm text-foreground">{decision.remarks}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="animate-slide-up shadow-card" style={{ animationDelay: "0.3s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            Your Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Remarks <span className="text-destructive">*</span>
            </label>
            <Textarea
              ref={textareaRef}
              placeholder="Enter your remarks here (mandatory for approval/rejection)..."
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                if (error) setError("");
              }}
              className="min-h-[100px] resize-none"
              disabled={isReadOnly}
            />
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 border border-border">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground">
              OTP verification will be required before final submission
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t border-border shadow-elevated z-40">
        <div className="container max-w-3xl mx-auto flex gap-3">
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            onClick={() => handleActionClick("rejected")}
            disabled={isReadOnly}
          >
            <XCircle className="w-5 h-5" />
            Reject
          </Button>
          <Button
            variant="success"
            size="lg"
            className="flex-1"
            onClick={() => handleActionClick("approved")}
            disabled={isReadOnly}
          >
            <CheckCircle2 className="w-5 h-5" />
            Approve
          </Button>
        </div>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setSelectedAction(null);
        }}
        onVerified={handleOtpVerified}
        action={selectedAction || "approved"}
      />
    </>
  );
};

export default DecisionSection;
