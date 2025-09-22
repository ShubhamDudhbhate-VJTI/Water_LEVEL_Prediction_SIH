// import { Navigation } from "@/components/Navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { BarChart, TrendingUp, AlertTriangle, CloudRain } from "lucide-react";

// const AnalyticsPage = () => {
//   const stateData = [
//     { state: "Uttar Pradesh", rivers: 12, highAlert: 2, avgLevel: 78 },
//     { state: "Bihar", rivers: 8, highAlert: 3, avgLevel: 82 },
//     { state: "West Bengal", rivers: 6, highAlert: 1, avgLevel: 65 },
//     { state: "Assam", rivers: 9, highAlert: 4, avgLevel: 89 },
//     { state: "Maharashtra", rivers: 7, highAlert: 0, avgLevel: 45 },
//   ];

//   const trends = [
//     { metric: "Flood Risk", value: "Medium", change: "+5%", color: "orange" },
//     { metric: "Rainfall", value: "Above Normal", change: "+12%", color: "blue" },
//     { metric: "Water Storage", value: "85%", change: "-2%", color: "green" },
//     { metric: "Drought Risk", value: "Low", change: "-8%", color: "green" },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
//        <Navigation />
//       <div className="flex-1 container mx-auto px-4 py-8 flex flex-col">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold">Water Analytics Dashboard</h1>
//           <p className="text-muted-foreground mt-2">
//             Comprehensive analysis of water levels across India
//           </p>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           {trends.map((trend, index) => (
//             <Card key={index}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between space-y-0 pb-2">
//                   <p className="text-sm font-medium">{trend.metric}</p>
//                   <div className="flex items-center space-x-1">
//                     <TrendingUp className="h-4 w-4 text-green-600" />
//                     <span className="text-xs text-green-600">{trend.change}</span>
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold">{trend.value}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* State-wise Analysis */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart className="h-5 w-5" />
//                 State-wise Water Levels
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {stateData.map((state, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="font-medium">{state.state}</span>
//                       <div className="flex items-center gap-2">
//                         <Badge variant={state.highAlert > 2 ? "destructive" : state.highAlert > 0 ? "secondary" : "default"}>
//                           {state.highAlert} alerts
//                         </Badge>
//                         <span className="text-sm text-muted-foreground">{state.avgLevel}%</span>
//                       </div>
//                     </div>
//                     <Progress value={state.avgLevel} className="h-2" />
//                     <div className="flex justify-between text-xs text-muted-foreground">
//                       <span>{state.rivers} rivers monitored</span>
//                       <span>Avg capacity: {state.avgLevel}%</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <AlertTriangle className="h-5 w-5" />
//                 Active Alerts
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {[
//                   { location: "Yamuna - Delhi", type: "Flood Warning", level: "High", time: "2 hours ago" },
//                   { location: "Brahmaputra - Assam", type: "Rising Level", level: "Medium", time: "4 hours ago" },
//                   { location: "Godavari - Telangana", type: "Low Water", level: "Low", time: "6 hours ago" },
//                 ].map((alert, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                     <div className="space-y-1">
//                       <p className="font-medium text-sm">{alert.location}</p>
//                       <p className="text-xs text-muted-foreground">{alert.type}</p>
//                     </div>
//                     <div className="text-right">
//                       <Badge variant={alert.level === "High" ? "destructive" : alert.level === "Medium" ? "secondary" : "default"}>
//                         {alert.level}
//                       </Badge>
//                       <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Monthly Trends */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <CloudRain className="h-5 w-5" />
//               Monthly Analysis
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="space-y-4">
//                 <h3 className="font-semibold">Rainfall Patterns</h3>
//                 <div className="space-y-3">
//                   {["January", "February", "March"].map((month, index) => (
//                     <div key={index} className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span>{month}</span>
//                         <span>{120 + index * 30}mm</span>
//                       </div>
//                       <Progress value={40 + index * 20} className="h-1" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold">Water Storage</h3>
//                 <div className="space-y-3">
//                   {["Reservoirs", "Rivers", "Groundwater"].map((source, index) => (
//                     <div key={index} className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span>{source}</span>
//                         <span>{85 - index * 10}%</span>
//                       </div>
//                       <Progress value={85 - index * 10} className="h-1" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h3 className="font-semibold">Risk Assessment</h3>
//                 <div className="space-y-3">
//                   <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
//                     <div className="text-lg font-bold text-green-700 dark:text-green-400">LOW</div>
//                     <div className="text-xs text-green-600 dark:text-green-500">Flood Risk</div>
//                   </div>
//                   <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
//                     <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">MEDIUM</div>
//                     <div className="text-xs text-yellow-600 dark:text-yellow-500">Drought Risk</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsPage;\













import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, TrendingUp, AlertTriangle, CloudRain } from "lucide-react";

const AnalyticsPage = () => {
  const stateData = [
    { state: "Uttar Pradesh", rivers: 12, highAlert: 2, avgLevel: 78 },
    { state: "Bihar", rivers: 8, highAlert: 3, avgLevel: 82 },
    { state: "West Bengal", rivers: 6, highAlert: 1, avgLevel: 65 },
    { state: "Assam", rivers: 9, highAlert: 4, avgLevel: 89 },
    { state: "Maharashtra", rivers: 7, highAlert: 0, avgLevel: 45 },
  ];

  const trends = [
    { metric: "Flood Risk", value: "Medium", change: "+5%" },
    { metric: "Rainfall", value: "Above Normal", change: "+12%" },
    { metric: "Water Storage", value: "85%", change: "-2%" },
    { metric: "Drought Risk", value: "Low", change: "-8%" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900">
      <Navigation />

      {/* Main content */}
      <main className="flex-1 w-full overflow-x-hidden flex flex-col">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Water Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive analysis of water levels across India
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 mb-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {trends.map((trend, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-sm font-medium truncate">{trend.metric}</p>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">{trend.change}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold truncate">{trend.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* State-wise & Alerts */}
          <div className="grid gap-6 mb-8 grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
            {/* State-wise Water Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  State-wise Water Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stateData.map((state, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{state.state}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              state.highAlert > 2
                                ? "destructive"
                                : state.highAlert > 0
                                ? "secondary"
                                : "default"
                            }
                          >
                            {state.highAlert} alerts
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {state.avgLevel}%
                          </span>
                        </div>
                      </div>
                      <Progress value={state.avgLevel} className="h-2 w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{state.rivers} rivers monitored</span>
                        <span>Avg capacity: {state.avgLevel}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      location: "Yamuna - Delhi",
                      type: "Flood Warning",
                      level: "High",
                      time: "2 hours ago",
                    },
                    {
                      location: "Brahmaputra - Assam",
                      type: "Rising Level",
                      level: "Medium",
                      time: "4 hours ago",
                    },
                    {
                      location: "Godavari - Telangana",
                      type: "Low Water",
                      level: "Low",
                      time: "6 hours ago",
                    },
                  ].map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm truncate">
                          {alert.location}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {alert.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            alert.level === "High"
                              ? "destructive"
                              : alert.level === "Medium"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {alert.level}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5" />
                Monthly Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
                {/* Rainfall Patterns */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Rainfall Patterns</h3>
                  {["January", "February", "March"].map((month, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{month}</span>
                        <span>{120 + index * 30}mm</span>
                      </div>
                      <Progress value={40 + index * 20} className="h-1 w-full" />
                    </div>
                  ))}
                </div>

                {/* Water Storage */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Water Storage</h3>
                  {["Reservoirs", "Rivers", "Groundwater"].map((source, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{source}</span>
                        <span>{85 - index * 10}%</span>
                      </div>
                      <Progress value={85 - index * 10} className="h-1 w-full" />
                    </div>
                  ))}
                </div>

                {/* Risk Assessment */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Risk Assessment</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-700 dark:text-green-400">
                        LOW
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-500">
                        Flood Risk
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-center">
                      <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                        MEDIUM
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-500">
                        Drought Risk
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
