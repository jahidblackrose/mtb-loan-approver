import { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, XCircle, FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ReviewData {
  title: string;
  department: string;
  status: "approved" | "pending" | "rejected";
  reviewer?: string;
  date?: string;
  remarks?: string;
  attachments?: { name: string; url: string }[];
  cibStatus?: string;
  cibDate?: string;
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

  const statusConfig = {
    approved: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-success",
      bg: "bg-success/10",
      border: "border-success/20",
      label: "Approved",
    },
    pending: {
      icon: <Clock className="w-4 h-4" />,
      color: "text-warning",
      bg: "bg-warning/10",
      border: "border-warning/20",
      label: "Pending",
    },
    rejected: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
      label: "Rejected",
    },
  };

  const config = statusConfig[review.status];

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
                <h4 className="text-sm font-semibold text-foreground">{review.title}</h4>
                <p className="text-xs text-muted-foreground">{review.department}</p>
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
            {review.reviewer && (
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reviewed by:</span>
                <span className="font-medium text-foreground">{review.reviewer}</span>
                {review.date && (
                  <span className="text-xs text-muted-foreground">• {review.date}</span>
                )}
              </div>
            )}
            
            {(review.cibStatus || review.cibDate) && (
              <div className="grid grid-cols-2 gap-3 mb-2">
                {review.cibStatus && (
                  <div className="p-3 rounded-md bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1">CIB Status</p>
                    <p className="text-sm font-medium text-foreground">{review.cibStatus}</p>
                  </div>
                )}
                {review.cibDate && (
                  <div className="p-3 rounded-md bg-card border border-border">
                    <p className="text-xs text-muted-foreground mb-1">CIB Date</p>
                    <p className="text-sm font-medium text-foreground">{review.cibDate}</p>
                  </div>
                )}
              </div>
            )}

            {review.remarks && (
              <div className="p-3 rounded-md bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                <p className="text-sm text-foreground">{review.remarks}</p>
              </div>
            )}

            {review.attachments && review.attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Attachments</p>
                <div className="flex flex-wrap gap-2">
                  {review.attachments.map((attachment, idx) => (
                    <a
                      key={idx}
                      href={attachment.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-xs font-medium hover:bg-accent/80 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default ReviewSection;
