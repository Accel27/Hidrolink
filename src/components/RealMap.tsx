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
            <!-- Cambiamos FontAwesome por Material Design Icons (MDI) -->
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        #map { width: 100vw; height: 100vh; }
        
        /* Estilos para los íconos del mapa */
        .custom-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid white;
        }
        .truck-pin { background-color: #0EA5E9; width: 40px; height: 40px; font-size: 18px; }
        .client-pin { background-color: #EF4444; width: 36px; height: 36px; font-size: 16px; }
        
        /* Estilos de las ventanas emergentes (Popups) */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0;
          padding: 12px;
          font-size: 14px;
          line-height: 1.4;
        }
        .popup-title { font-weight: bold; color: #0F172A; margin-bottom: 4px; display: block;}
        .popup-price { color: #10B981; font-weight: bold; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${LAT}, ${LNG}], 14);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        // Icono del Camion
        var truckIcon = L.divIcon({
          className: '',
          html: '<div class="custom-pin truck-pin"><i class="mdi mdi-tanker-truck"></i></div>',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Icono del Cliente
        var clientIcon = L.divIcon({
          className: '',
          html: '<div class="custom-pin client-pin"><i class="mdi mdi-home"></i></div>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        // Dibujar camiones
        var trucksData = ${JSON.stringify(trucks)};
        trucksData.forEach(function(truck, index) {
          var lat = ${LAT} + (index * 0.002) + 0.001;
          var lng = ${LNG} + (index * 0.002) + 0.001;
          var markerIcon = ${isDriverView} ? truckIcon : truckIcon;
          
          var popupHTML = ${isDriverView} 
            ? '<span class="popup-title">Tu Camión (' + truck.plate + ')</span>'
            : '<span class="popup-title">Camión ' + truck.plate + '</span><span class="popup-price">$' + truck.pricePerPipa.toFixed(2) + ' / pipa</span>';
            
          L.marker([lat, lng], {icon: markerIcon}).addTo(map).bindPopup(popupHTML);
        });

        // Dibujar clientes
        var requestsData = ${JSON.stringify(activeRequests)};
        requestsData.forEach(function(req) {
          var popupHTML = '<span class="popup-title">Cliente (' + req.pipasRequested + ' pipas)</span><span class="popup-price">$' + req.totalPrice.toFixed(2) + '</span>';
          L.marker([req.clientLat, req.clientLng], {icon: clientIcon}).addTo(map).bindPopup(popupHTML);
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