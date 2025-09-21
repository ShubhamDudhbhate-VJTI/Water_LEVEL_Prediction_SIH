import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Droplets, 
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

export const AnalyticsPage = () => {
  const stats = [
    {
      title: "Total Monitoring Points",
      value: "47",
      change: "+3",
      changeType: "increase",
      description: "Active water level sensors"
    },
    {
      title: "High Alert Zones",
      value: "8",
      change: "+2",
      changeType: "increase",
      description: "Areas requiring attention"
    },
    {
      title: "Average Water Level",
      value: "67%",
      change: "-5%",
      changeType: "decrease",
      description: "Compared to last month"
    },
    {
      title: "Flood Risk Areas",
      value: "12",
      change: "+1",
      changeType: "increase",
      description: "High probability zones"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      location: "Yamuna - Delhi",
      type: "High Water Level",
      severity: "high",
      time: "2 hours ago",
      description: "Water level exceeded danger mark"
    },
    {
      id: 2,
      location: "Krishna - Vijayawada",
      type: "Low Water Level",
      severity: "medium",
      time: "4 hours ago",
      description: "Water level below normal range"
    },
    {
      id: 3,
      location: "Brahmaputra - Guwahati",
      type: "Rapid Rise",
      severity: "high",
      time: "6 hours ago",
      description: "Unusual rapid water level increase"
    },
    {
      id: 4,
      location: "Godavari - Nashik",
      type: "Sensor Malfunction",
      severity: "low",
      time: "8 hours ago",
      description: "Data transmission interrupted"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Water monitoring insights and trends</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="h-4 w-4 text-gray-400">
                  {index === 0 && <Droplets />}
                  {index === 1 && <AlertTriangle />}
                  {index === 2 && <BarChart3 />}
                  {index === 3 && <TrendingUp />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'increase' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Water Level Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Water Level Trends</CardTitle>
              <CardDescription>Past 7 days water level changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive chart would be displayed here</p>
                  <p className="text-sm">Water level data over time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Water levels across different states</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Regional breakdown chart</p>
                  <p className="text-sm">State-wise water level status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest water monitoring alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{alert.location}</h4>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{alert.type}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    {alert.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Sensors</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Data Accuracy</span>
                  <span className="text-sm font-medium">98%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alert Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">2.3 min</div>
                  <p className="text-sm text-gray-600">Average Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99.2%</div>
                  <p className="text-sm text-gray-600">Alert Delivery Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Alerts</span>
                  <span className="text-sm font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Critical Events</span>
                  <span className="text-sm font-medium text-red-600">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Areas Monitored</span>
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Points</span>
                  <span className="text-sm font-medium">1.2M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;