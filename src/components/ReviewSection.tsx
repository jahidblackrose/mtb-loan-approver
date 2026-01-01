import { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, XCircle, FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface ReviewData {
  Title: string;
  SubTitle: string;
  ByName?: string;
  Status: string;
  ByDate?: string;
  ByRemark?: string;
}

interface ReviewSectionProps {
  reviews: ReviewData[];
}

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  return (
    <Card className="animate-slide-up shadow-card hover:shadow-card-hover transition-shadow duration-300" style={{ animationDelay: "0.2s" }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-secondary to-primary">
            <FileText className="w-5 h-5 text-secondary-foreground" />
          </div>
          Operational Teams Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </CardContent>
    </Card>
  );
};

const ReviewCard = ({ review }: { review: ReviewData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === "approved") {
      return {
        icon: <CheckCircle2 className="w-4 h-4" />,
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
        label: "Approved",
      };
    }
    if (normalizedStatus === "rejected") {
      return {
        icon: <XCircle className="w-4 h-4" />,
        color: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive/20",
        label: "Rejected",
      };
    }
    return {
      icon: <Clock className="w-4 h-4" />,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
      label: "Pending",
    };
  };

  const config = getStatusConfig(review.Status);

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`rounded-lg border ${config.border} ${config.bg} overflow-hidden transition-all duration-200`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${config.bg} ${config.color}`}>
                {config.icon}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-foreground">{review.Title}</h4>
                <p className="text-xs text-muted-foreground">{review.SubTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${config.color} ${config.bg} ${config.border}`}>
                {config.label}
              </Badge>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-3">
            {review.ByName && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reviewed by:</span>
                <span className="font-medium text-foreground">{review.ByName}</span>
                {review.ByDate && (
                  <span className="text-xs text-muted-foreground">• {formatDate(review.ByDate)}</span>
                )}
              </div>
            )}

            {review.ByRemark && (
              <div className="p-3 rounded-md bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                <p className="text-sm text-foreground">{review.ByRemark}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ReviewSection;
