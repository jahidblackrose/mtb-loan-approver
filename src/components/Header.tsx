import mtbLogo from "@/assets/mtb-logo.png";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={mtbLogo} 
            alt="Mutual Trust Bank PLC" 
            className="h-10 w-auto"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-foreground">Management Portal</span>
            <span className="text-xs text-muted-foreground">Employee House Building Loan</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">MR</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
