import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Droplets, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

export const WaterLevelDashboard = () => {
  const riverData = [
    {
      name: "Ganga (Haridwar)",
      level: 294.2,
      capacity: 300,
      status: "normal",
      trend: "stable",
      lastUpdated: "2 mins ago"
    },
    {
      name: "Yamuna (Delhi)",
      level: 201.8,
      capacity: 207,
      status: "high",
      trend: "rising",
      lastUpdated: "5 mins ago"
    },
    {
      name: "Narmada (Bharuch)",
      level: 87.3,
      capacity: 100,
      status: "normal",
      trend: "falling",
      lastUpdated: "1 min ago"
    },
    {
      name: "Krishna (Vijayawada)",
      level: 12.4,
      capacity: 25,
      status: "low",
      trend: "falling",
      lastUpdated: "3 mins ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "destructive";
      case "normal": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "normal": return <Droplets className="w-4 h-4" />;
      case "low": return <TrendingDown className="w-4 h-4" />;
      default: return <Droplets className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "falling": return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Live Water Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {riverData.map((river, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">{river.name}</h4>
                <div className="flex items-center gap-1">
                  {getTrendIcon(river.trend)}
                  <Badge 
                    variant={getStatusColor(river.status) as any}
                    className="text-xs flex items-center gap-1"
                  >
                    {getStatusIcon(river.status)}
                    {river.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{river.level}m</span>
                  <span>{river.capacity}m</span>
                </div>
                <Progress 
                  value={(river.level / river.capacity) * 100} 
                  className="h-2"
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Updated {river.lastUpdated}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-lg font-bold text-green-700 dark:text-green-400">12</div>
              <div className="text-xs text-green-600 dark:text-green-500">Normal Levels</div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="text-lg font-bold text-red-700 dark:text-red-400">3</div>
              <div className="text-xs text-red-600 dark:text-red-500">High Alert</div>
            </div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">85%</div>
            <div className="text-xs text-blue-600 dark:text-blue-500">Average Reservoir Capacity</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};