import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Database } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const UploadData = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState({
    location: "",
    waterLevel: "",
    capacity: "",
    timestamp: "",
  });
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} ready for upload`,
      });
    }
  };

  const handleManualSubmit = () => {
    if (!manualData.location || !manualData.waterLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in location and water level",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Data Submitted",
      description: "Water level data has been recorded successfully",
    });

    setManualData({
      location: "",
      waterLevel: "",
      capacity: "",
      timestamp: "",
    });
  };

  const processFileUpload = () => {
    if (!selectedFile) return;

    toast({
      title: "Processing File",
      description: "Uploading and processing your data file...",
    });

    // Simulate file processing
    setTimeout(() => {
      toast({
        title: "Upload Complete",
        description: `${selectedFile.name} has been processed successfully`,
      });
      setSelectedFile(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                File Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload CSV, Excel, or JSON files with water level data
                </p>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Selected File:</p>
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button onClick={processFileUpload} className="w-full mt-3">
                    Process Upload
                  </Button>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>CSV files with columns: location, water_level, capacity, timestamp</li>
                  <li>Excel spreadsheets (.xlsx, .xls)</li>
                  <li>JSON files with water level arrays</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Manual Data Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Manual Data Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location/River Name</Label>
                <Input
                  id="location"
                  placeholder="e.g., Ganga at Haridwar"
                  value={manualData.location}
                  onChange={(e) => setManualData({...manualData, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waterLevel">Current Water Level (meters)</Label>
                <Input
                  id="waterLevel"
                  type="number"
                  placeholder="e.g., 294.2"
                  value={manualData.waterLevel}
                  onChange={(e) => setManualData({...manualData, waterLevel: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Maximum Capacity (meters)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 300.0"
                  value={manualData.capacity}
                  onChange={(e) => setManualData({...manualData, capacity: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp (optional)</Label>
                <Input
                  id="timestamp"
                  type="datetime-local"
                  value={manualData.timestamp}
                  onChange={(e) => setManualData({...manualData, timestamp: e.target.value})}
                />
              </div>
              
              <Button onClick={handleManualSubmit} className="w-full">
                Submit Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Uploads */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { file: "water_levels_jan_2024.csv", date: "2024-01-15", records: 1247 },
                { file: "Manual Entry - Ganga Haridwar", date: "2024-01-14", records: 1 },
                { file: "rainfall_data.xlsx", date: "2024-01-14", records: 856 },
              ].map((upload, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{upload.file}</p>
                    <p className="text-xs text-muted-foreground">
                      {upload.records} records • {upload.date}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadData;