import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">Project Estimation Admin Panel</h1>
          <p className="text-xl text-muted-foreground">Manage your estimation system configuration and content</p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/admin">
            <Button size="lg" className="gap-2">
              <Settings className="h-5 w-5" />
              Access Admin Panel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
