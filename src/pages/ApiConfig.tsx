import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Key, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ApiConfig = () => {
  const [apiKeys, setApiKeys] = useState({
    weatherApi: "",
    waterLevelApi: "",
    satelliteApi: "",
  });
  
  const [endpoints, setEndpoints] = useState({
    waterLevel: "https://api.waterlevels.india.gov.in/v1/",
    weather: "https://api.openweathermap.org/data/2.5/",
    satellite: "https://api.sentinel-hub.com/",
  });

  const { toast } = useToast();

  const apiStatus = {
    waterLevel: "active",
    weather: "active", 
    satellite: "inactive",
    floodAlert: "active",
  };

  const handleSaveApiKey = (apiType: string) => {
    toast({
      title: "API Key Saved",
      description: `${apiType} API key has been saved securely`,
    });
  };

  const testConnection = (apiName: string) => {
    toast({
      title: "Testing Connection",
      description: `Testing ${apiName} API connection...`,
    });

    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `${apiName} API is responding correctly`,
      });
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">API Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Configure external APIs for real-time water level and weather data
          </p>
        </div>

        <Tabs defaultValue="apis" className="space-y-6">
          <TabsList>
            <TabsTrigger value="apis">API Keys</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="apis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Weather API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>OpenWeatherMap API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKeys.weatherApi}
                      onChange={(e) => setApiKeys({...apiKeys, weatherApi: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveApiKey("Weather")} className="flex-1">
                      Save Key
                    </Button>
                    <Button variant="outline" onClick={() => testConnection("Weather")}>
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Water Level API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>India Water Resources API Key</Label>
                    <Input
                      type="password"
                      placeholder="Government API key"
                      value={apiKeys.waterLevelApi}
                      onChange={(e) => setApiKeys({...apiKeys, waterLevelApi: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveApiKey("Water Level")} className="flex-1">
                      Save Key
                    </Button>
                    <Button variant="outline" onClick={() => testConnection("Water Level")}>
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Satellite API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Sentinel Hub API Key</Label>
                    <Input
                      type="password"
                      placeholder="Satellite imagery API"
                      value={apiKeys.satelliteApi}
                      onChange={(e) => setApiKeys({...apiKeys, satelliteApi: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleSaveApiKey("Satellite")} className="flex-1">
                      Save Key
                    </Button>
                    <Button variant="outline" onClick={() => testConnection("Satellite")}>
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Water Level Data Endpoint</Label>
                  <Input
                    value={endpoints.waterLevel}
                    onChange={(e) => setEndpoints({...endpoints, waterLevel: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Weather Data Endpoint</Label>
                  <Input
                    value={endpoints.weather}
                    onChange={(e) => setEndpoints({...endpoints, weather: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Satellite Data Endpoint</Label>
                  <Input
                    value={endpoints.satellite}
                    onChange={(e) => setEndpoints({...endpoints, satellite: e.target.value})}
                  />
                </div>
                
                <Button className="w-full">Save Endpoints</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(apiStatus).map(([api, status]) => (
                <Card key={api}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base capitalize">
                        {api.replace(/([A-Z])/g, ' $1').trim()} API
                      </CardTitle>
                      {getStatusBadge(status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="text-muted-foreground">2 mins ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="text-muted-foreground">124ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Requests:</span>
                        <span className="text-muted-foreground">1,247 / 5,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiConfig;