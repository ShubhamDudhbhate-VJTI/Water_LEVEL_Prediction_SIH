// import { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { MapPin, Droplets, AlertTriangle } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// export const LocationMap = () => {
//   const mapContainer = useRef<HTMLDivElement>(null);
//   const map = useRef<mapboxgl.Map | null>(null);
//   const [mapboxToken, setMapboxToken] = useState('');
//   const [tokenEntered, setTokenEntered] = useState(false);
//   const { toast } = useToast();

//   // Sample water monitoring stations across India
//   const waterStations = [
//     { id: 1, name: "Ganga - Haridwar", lat: 29.9457, lng: 78.1642, level: 294.2, status: "normal" },
//     { id: 2, name: "Yamuna - Delhi", lat: 28.6139, lng: 77.2090, level: 201.8, status: "high" },
//     { id: 3, name: "Narmada - Bharuch", lat: 21.7051, lng: 72.9959, level: 87.3, status: "normal" },
//     { id: 4, name: "Krishna - Vijayawada", lat: 16.5062, lng: 80.6480, level: 12.4, status: "low" },
//     { id: 5, name: "Godavari - Nashik", lat: 19.9975, lng: 73.7898, level: 156.7, status: "normal" },
//     { id: 6, name: "Brahmaputra - Guwahati", lat: 26.1445, lng: 91.7362, level: 89.5, status: "high" },
//   ];

//   const initializeMap = () => {
//     if (!mapContainer.current || !mapboxToken) return;

//     mapboxgl.accessToken = mapboxToken;
    
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/light-v11',
//       center: [78.9629, 20.5937], // Center of India
//       zoom: 4.5,
//     });

//     map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

//     map.current.on('load', () => {
//       // Add markers for water stations
//       waterStations.forEach((station) => {
//         const statusColor = station.status === 'high' ? '#ef4444' : 
//                            station.status === 'low' ? '#f59e0b' : '#10b981';

//         // Create custom marker
//         const markerElement = document.createElement('div');
//         markerElement.className = 'custom-marker';
//         markerElement.style.cssText = `
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           background-color: ${statusColor};
//           border: 3px solid white;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.3);
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         `;

//         const icon = document.createElement('div');
//         icon.innerHTML = station.status === 'high' ? '⚠️' : 
//                         station.status === 'low' ? '📉' : '💧';
//         icon.style.fontSize = '12px';
//         markerElement.appendChild(icon);

//         // Create popup
//         const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
//           <div style="padding: 8px; font-family: system-ui;">
//             <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${station.name}</h3>
//             <p style="margin: 4px 0; font-size: 12px; color: #666;">Level: ${station.level}m</p>
//             <p style="margin: 4px 0; font-size: 12px; color: ${statusColor}; font-weight: 500; text-transform: uppercase;">${station.status}</p>
//           </div>
//         `);

//         new mapboxgl.Marker(markerElement)
//           .setLngLat([station.lng, station.lat])
//           .setPopup(popup)
//           .addTo(map.current!);
//       });
//     });
//   };

//   useEffect(() => {
//     if (tokenEntered && mapboxToken) {
//       initializeMap();
//     }

//     return () => {
//       if (map.current) {
//         map.current.remove();
//       }
//     };
//   }, [tokenEntered, mapboxToken]);

//   const handleTokenSubmit = () => {
//     if (!mapboxToken.trim()) {
//       toast({
//         title: "Token required",
//         description: "Please enter your Mapbox public token",
//         variant: "destructive",
//       });
//       return;
//     }
//     setTokenEntered(true);
//     toast({
//       title: "Map loading",
//       description: "Initializing map with water monitoring stations",
//     });
//   };

//   if (!tokenEntered) {
//     return (
//       <div className="h-full flex items-center justify-center p-6">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5" />
//               Location Map Setup
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-sm text-gray-600">
//               To display the interactive map with water monitoring locations, please enter your Mapbox public token.
//             </p>
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 placeholder="Enter Mapbox public token"
//                 value={mapboxToken}
//                 onChange={(e) => setMapboxToken(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
//               />
//               <Button onClick={handleTokenSubmit} className="w-full">
//                 Load Map
//               </Button>
//             </div>
//             <p className="text-xs text-gray-500">
//               Get your token from{' '}
//               <a 
//                 href="https://mapbox.com/" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//               >
//                 mapbox.com
//               </a>{' '}
//               dashboard
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col">
//       <div className="p-4 border-b bg-white">
//         <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//           <Droplets className="h-5 w-5 text-blue-600" />
//           Water Monitoring Stations
//         </h3>
//         <p className="text-sm text-gray-600 mt-1">Real-time water level data across India</p>
//       </div>
      
//       <div className="flex-1 relative">
//         <div ref={mapContainer} className="absolute inset-0" />
        
//         {/* Legend */}
//         <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
//           <h4 className="text-xs font-semibold text-gray-700 mb-2">Water Levels</h4>
//           <div className="space-y-1">
//             <div className="flex items-center gap-2 text-xs">
//               <div className="w-3 h-3 rounded-full bg-red-500"></div>
//               <span>High Alert</span>
//             </div>
//             <div className="flex items-center gap-2 text-xs">
//               <div className="w-3 h-3 rounded-full bg-green-500"></div>
//               <span>Normal</span>
//             </div>
//             <div className="flex items-center gap-2 text-xs">
//               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//               <span>Low</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import { Droplets, AlertTriangle, ArrowDownCircle, Waves } from "lucide-react";

const waterStations = [
  { id: 1, name: "Ganga - Haridwar", lat: 29.9457, lng: 78.1642, level: 294.2, status: "normal" },
  { id: 2, name: "Yamuna - Delhi", lat: 28.6139, lng: 77.2090, level: 201.8, status: "high" },
  { id: 3, name: "Narmada - Bharuch", lat: 21.7051, lng: 72.9959, level: 87.3, status: "normal" },
  { id: 4, name: "Krishna - Vijayawada", lat: 16.5062, lng: 80.6480, level: 12.4, status: "low" },
  { id: 5, name: "Godavari - Nashik", lat: 19.9975, lng: 73.7898, level: 156.7, status: "normal" },
  { id: 6, name: "Brahmaputra - Guwahati", lat: 26.1445, lng: 91.7362, level: 89.5, status: "high" },
];

export const LocationMap = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="p-6 bg-card/95 backdrop-blur-md border-b card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl water-gradient animate-float">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Water Monitoring Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground ml-13">
          Real-time water level monitoring across India's major rivers
        </p>
      </header>
      
      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Embedded Google Map */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d8467.896502085729!2d72.86008720223806!3d19.018880205561896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1758481546819!5m2!1sen!2sin"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        
        {/* Station Info Cards */}
        <div className="absolute top-4 right-4 space-y-2 max-h-[calc(100%-8rem)] overflow-y-auto max-w-[280px]">
          <div className="bg-card/95 backdrop-blur-md p-4 rounded-xl card-shadow">
            <h3 className="text-lg font-bold text-card-foreground mb-3 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Live Monitoring Stations
            </h3>
          </div>
          
          {waterStations.map((station) => (
            <div
              key={station.id}
              className={`bg-card/95 backdrop-blur-md p-4 rounded-xl card-shadow transition-smooth hover:scale-105 border-l-4 ${
                station.status === 'high' ? 'border-l-destructive' :
                station.status === 'low' ? 'border-l-warning' : 'border-l-success'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-card-foreground">
                    {station.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time monitoring
                  </p>
                </div>
                <div 
                  className={`w-4 h-4 rounded-full ${
                    station.status === 'high' ? 'bg-destructive animate-pulse' :
                    station.status === 'low' ? 'bg-warning animate-bounce' : 'bg-success'
                  }`}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Water Level:</span>
                  <span className="text-sm font-bold text-primary">{station.level}m</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <span 
                    className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                      station.status === 'high' ? 'bg-destructive/20 text-destructive' :
                      station.status === 'low' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                    }`}
                  >
                    {station.status}
                  </span>
                </div>
                
                {station.status === 'high' && (
                  <div className="bg-destructive/10 p-2 rounded text-xs text-destructive">
                    ⚠️ Flood risk - Monitor closely
                  </div>
                )}
                {station.status === 'low' && (
                  <div className="bg-warning/10 p-2 rounded text-xs text-warning">
                    📉 Low water - Drought concern
                  </div>
                )}
                {station.status === 'normal' && (
                  <div className="bg-success/10 p-2 rounded text-xs text-success">
                    ✅ Optimal water levels
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-md p-5 rounded-xl card-shadow z-20">
          <h4 className="text-sm font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-primary" />
            Legend
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                <span className="text-sm text-muted-foreground">High Alert</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <div className="flex items-center gap-1">
                <Droplets className="h-3 w-3 text-success" />
                <span className="text-sm text-muted-foreground">Normal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-warning animate-bounce"></div>
              <div className="flex items-center gap-1">
                <ArrowDownCircle className="h-3 w-3 text-warning" />
                <span className="text-sm text-muted-foreground">Low Level</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="absolute bottom-6 right-6 bg-card/95 backdrop-blur-md p-5 rounded-xl card-shadow z-20">
          <h4 className="text-sm font-semibold text-card-foreground mb-3">Quick Stats</h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Stations:</span>
              <span className="font-semibold text-foreground">{waterStations.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">High Alert:</span>
              <span className="font-semibold text-destructive">
                {waterStations.filter(s => s.status === 'high').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Normal:</span>
              <span className="font-semibold text-success">
                {waterStations.filter(s => s.status === 'normal').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-semibold text-warning">
                {waterStations.filter(s => s.status === 'low').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

















