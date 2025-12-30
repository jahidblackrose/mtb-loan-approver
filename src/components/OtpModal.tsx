import { useState, useRef, useEffect } from "react";
import { Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  action: "approved" | "rejected";
}

const OtpModal = ({ isOpen, onClose, onVerified, action }: OtpModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo: Accept any 6-digit OTP
    setIsVerifying(false);
    onVerified();
  };

  const actionConfig = {
    approved: {
      color: "text-success",
      bg: "bg-success/10",
      icon: <CheckCircle2 className="w-5 h-5" />,
      label: "Approve",
    },
    rejected: {
      color: "text-destructive",
      bg: "bg-destructive/10",
      icon: <XCircle className="w-5 h-5" />,
      label: "Reject",
    },
  };

  const config = actionConfig[action];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            OTP Verification
          </DialogTitle>
          <DialogDescription>
            Enter the 6-digit OTP sent to your registered mobile number
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Action Badge */}
          <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${config.bg}`}>
            <span className={config.color}>{config.icon}</span>
            <span className={`font-medium ${config.color}`}>
              Confirming: {config.label} Loan Application
            </span>
          </div>

          {/* OTP Input */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Didn't receive OTP?{" "}
            <button className="text-primary font-medium hover:underline">
              Resend OTP
            </button>
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              variant={action === "approved" ? "success" : "destructive"}
              className="flex-1"
              onClick={handleVerify}
              disabled={isVerifying || otp.some(d => !d)}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>Confirm {config.label}</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;
