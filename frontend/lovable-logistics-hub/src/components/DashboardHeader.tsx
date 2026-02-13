import { Bell, Search, User } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">Command Center</h1>
        <p className="text-[11px] text-muted-foreground font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm">
          <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search shipments, vehicles..."
            className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-52 text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary transition-all duration-200 hover:scale-105 active:scale-95">
          <Bell className="w-[18px] h-[18px] text-muted-foreground" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive animate-pulse-glow" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-lg kpi-gradient-blue flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">Admin</p>
            <p className="text-xs text-muted-foreground">Dispatcher</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
