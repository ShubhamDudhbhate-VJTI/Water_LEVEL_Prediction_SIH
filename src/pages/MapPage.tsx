import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LocationMap } from '@/components/LocationMap';
import { 
  MapPin, 
  Droplets, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Layers
} from 'lucide-react';

const waterStations = [
  { 
    id: 1, 
    name: "Ganga - Haridwar", 
    location: "Uttarakhand",
    level: 294.2, 
    capacity: 300,
    status: "normal",
    trend: "stable",
    alerts: 0,
    lastUpdated: "2 mins ago"
  },
  { 
    id: 2, 
    name: "Yamuna - Delhi", 
    location: "Delhi",
    level: 201.8, 
    capacity: 207,
    status: "high",
    trend: "rising",
    alerts: 2,
    lastUpdated: "5 mins ago"
  },
  { 
    id: 3, 
    name: "Narmada - Bharuch", 
    location: "Gujarat",
    level: 87.3, 
    capacity: 100,
    status: "normal",
    trend: "falling",
    alerts: 0,
    lastUpdated: "1 min ago"
  },
  { 
    id: 4, 
    name: "Krishna - Vijayawada", 
    location: "Andhra Pradesh",
    level: 12.4, 
    capacity: 25,
    status: "low",
    trend: "falling",
    alerts: 1,
    lastUpdated: "3 mins ago"
  },
  { 
    id: 5, 
    name: "Godavari - Nashik", 
    location: "Maharashtra",
    level: 156.7, 
    capacity: 180,
    status: "normal",
    trend: "stable",
    alerts: 0,
    lastUpdated: "4 mins ago"
  },
  { 
    id: 6, 
    name: "Brahmaputra - Guwahati", 
    location: "Assam",
    level: 89.5, 
    capacity: 95,
    status: "high",
    trend: "rising",
    alerts: 3,
    lastUpdated: "1 min ago"
  }
];

export const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "normal": return "bg-green-100 text-green-800 border-green-200";
      case "low": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "falling": return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const filteredStations = waterStations.filter(station => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         station.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || station.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalStations = waterStations.length;
  const highAlertStations = waterStations.filter(s => s.status === "high").length;
  const normalStations = waterStations.filter(s => s.status === "normal").length;
  const lowStations = waterStations.filter(s => s.status === "low").length;

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden">
      <div className="h-full flex">
        {/* Left Panel - Station List */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Water Monitoring</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-green-700">{normalStations}</div>
                <div className="text-xs text-green-600">Normal</div>
              </div>
              <div className="bg-red-50 p-2 rounded-lg text-center">
                <div className="text-lg font-bold text-red-700">{highAlertStations}</div>
                <div className="text-xs text-red-600">High Alert</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex space-x-1">
              {["all", "high", "normal", "low"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2 space-y-2">
              {filteredStations.map((station) => (
                <Card key={station.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 truncate">
                          {station.name}
                        </h3>
                        <p className="text-xs text-gray-500">{station.location}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {getTrendIcon(station.trend)}
                        <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(station.status)}`}>
                          {station.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Water Level</span>
                        <span className="text-sm font-medium">
                          {station.level}m / {station.capacity}m
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            station.status === 'high' ? 'bg-red-500' :
                            station.status === 'low' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(station.level / station.capacity) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Updated {station.lastUpdated}
                        </span>
                        {station.alerts > 0 && (
                          <div className="flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600">{station.alerts} alerts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1 relative">
          <div className="absolute top-4 left-4 z-10">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Map Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Droplets className="w-4 h-4 mr-2" />
                  Water Levels
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flood Zones
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Rainfall Data
                </Button>
              </CardContent>
            </Card>
          </div>

          <LocationMap />
        </div>
      </div>
    </div>
  );
};


export default MapPage;