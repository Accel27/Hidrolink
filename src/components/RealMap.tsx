import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Truck, ServiceRequest } from '@/types';

const LAT = 10.6427;
const LNG = -71.6125;

export const RealMap = React.memo(({ 
  trucks, 
  height = 280, 
  requests = [], 
  isDriverView = false 
}: { 
  trucks: Truck[]; 
  height?: number; 
  requests?: ServiceRequest[];
  isDriverView?: boolean;
}) => {
  
  const activeRequests = requests.filter(r => r.status === 'pending' || r.status === 'accepted');

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${LAT}, ${LNG}], 14);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        var driverIcon = L.divIcon({
          className: 'driver-icon',
          html: '<div style="background-color: #0EA5E9; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px;">🚚</div>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        var clientIcon = L.divIcon({
          className: 'client-icon',
          html: '<div style="background-color: #EF4444; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px;">🏠</div>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        var trucksData = ${JSON.stringify(trucks)};
        trucksData.forEach(function(truck, index) {
          var lat = ${LAT} + (index * 0.002) + 0.001;
          var lng = ${LNG} + (index * 0.002) + 0.001;
          var markerIcon = ${isDriverView} ? driverIcon : new L.Icon.Default();
          var popupText = ${isDriverView} ? '<b>Tu Camión</b><br>Placa: ' + truck.plate : '<b>' + truck.plate + '</b><br>Precio: $' + truck.pricePerPipa + ' / pipa';
          L.marker([lat, lng], {icon: markerIcon}).addTo(map).bindPopup(popupText);
        });

        var requestsData = ${JSON.stringify(activeRequests)};
        requestsData.forEach(function(req) {
          L.marker([req.clientLat, req.clientLng], {icon: clientIcon}).addTo(map)
           .bindPopup('<b>Cliente</b><br>' + req.pipasRequested + ' pipas<br>$' + req.totalPrice);
        });
      </script>
    </body>
    </html>
  `, [trucks, activeRequests, isDriverView]);

  return (
    <View style={[styles.container, { height }]}>
      <WebView 
        source={{ html }} 
        style={{ flex: 1 }} 
        scrollEnabled={false} 
        cacheEnabled={true}
        androidLayerType="hardware"
        nestedScrollEnabled={true}
        overScrollMode="never"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', backgroundColor: '#E0F2FE' },
});