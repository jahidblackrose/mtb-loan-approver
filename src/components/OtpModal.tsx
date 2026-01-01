import { useState, useRef, useEffect } from "react";
import { Shield, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  onResendOtp: () => Promise<{ success: boolean; message: string }>;
  onValidateOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  action: "approved" | "rejected";
  otpMessage: string;
}

const RESEND_COUNTDOWN_SECONDS = 120; // 2 minutes

const OtpModal = ({ 
  isOpen, 
  onClose, 
  onVerified, 
  onResendOtp,
  onValidateOtp,
  action, 
  otpMessage 
}: OtpModalProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const [displayMessage, setDisplayMessage] = useState(otpMessage);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setResendCountdown(RESEND_COUNTDOWN_SECONDS);
      setDisplayMessage(otpMessage);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, otpMessage]);

  // Countdown timer for resend button
  useEffect(() => {
    if (!isOpen || resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, resendCountdown]);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === 6 && !isVerifying) {
      handleVerify();
    }
  }, [otp]);

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
    setError("");
    
    try {
      const result = await onValidateOtp(otpValue);
      
      if (result.success) {
        // Auto-confirm after successful validation
        onVerified();
      } else {
        setError(result.message);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return;
    
    setIsResending(true);
    setError("");
    
    try {
      const result = await onResendOtp();
      setDisplayMessage(result.message);
      
      if (result.success) {
        setResendCountdown(RESEND_COUNTDOWN_SECONDS);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            {displayMessage || "Enter the 6-digit OTP sent to your registered mobile number"}
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
                disabled={isVerifying}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Didn't receive OTP?{" "}
              {resendCountdown > 0 ? (
                <span className="text-muted-foreground">
                  Resend in <span className="font-medium text-primary">{formatCountdown(resendCountdown)}</span>
                </span>
              ) : (
                <button 
                  className="text-primary font-medium hover:underline disabled:opacity-50"
                  onClick={handleResendOtp}
                  disabled={isResending}
                >
                  {isResending ? "Resending..." : "Resend OTP"}
                </button>
              )}
            </p>
          </div>

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
