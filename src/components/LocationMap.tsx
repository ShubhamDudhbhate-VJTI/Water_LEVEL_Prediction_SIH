import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Droplets, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const LocationMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenEntered, setTokenEntered] = useState(false);
  const { toast } = useToast();

  // Sample water monitoring stations across India
  const waterStations = [
    { id: 1, name: "Ganga - Haridwar", lat: 29.9457, lng: 78.1642, level: 294.2, status: "normal" },
    { id: 2, name: "Yamuna - Delhi", lat: 28.6139, lng: 77.2090, level: 201.8, status: "high" },
    { id: 3, name: "Narmada - Bharuch", lat: 21.7051, lng: 72.9959, level: 87.3, status: "normal" },
    { id: 4, name: "Krishna - Vijayawada", lat: 16.5062, lng: 80.6480, level: 12.4, status: "low" },
    { id: 5, name: "Godavari - Nashik", lat: 19.9975, lng: 73.7898, level: 156.7, status: "normal" },
    { id: 6, name: "Brahmaputra - Guwahati", lat: 26.1445, lng: 91.7362, level: 89.5, status: "high" },
  ];

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [78.9629, 20.5937], // Center of India
      zoom: 4.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Add markers for water stations
      waterStations.forEach((station) => {
        const statusColor = station.status === 'high' ? '#ef4444' : 
                           station.status === 'low' ? '#f59e0b' : '#10b981';

        // Create custom marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${statusColor};
          border: 3px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = station.status === 'high' ? '⚠️' : 
                        station.status === 'low' ? '📉' : '💧';
        icon.style.fontSize = '12px';
        markerElement.appendChild(icon);

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; font-family: system-ui;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${station.name}</h3>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">Level: ${station.level}m</p>
            <p style="margin: 4px 0; font-size: 12px; color: ${statusColor}; font-weight: 500; text-transform: uppercase;">${station.status}</p>
          </div>
        `);

        new mapboxgl.Marker(markerElement)
          .setLngLat([station.lng, station.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });
  };

  useEffect(() => {
    if (tokenEntered && mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [tokenEntered, mapboxToken]);

  const handleTokenSubmit = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: "Token required",
        description: "Please enter your Mapbox public token",
        variant: "destructive",
      });
      return;
    }
    setTokenEntered(true);
    toast({
      title: "Map loading",
      description: "Initializing map with water monitoring stations",
    });
  };

  if (!tokenEntered) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Map Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To display the interactive map with water monitoring locations, please enter your Mapbox public token.
            </p>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTokenSubmit()}
              />
              <Button onClick={handleTokenSubmit} className="w-full">
                Load Map
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mapbox.com
              </a>{' '}
              dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          Water Monitoring Stations
        </h3>
        <p className="text-sm text-gray-600 mt-1">Real-time water level data across India</p>
      </div>
      
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Water Levels</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Alert</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};