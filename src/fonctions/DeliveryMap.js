import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const DeliveryMap = ({ addresses }) => {
  const mapRef = useRef(null);
  let map = null;
  const routingControlRef = useRef(null);

  useEffect(() => {

      if(mapRef.current){
      // Création de la carte
      map = L.map(mapRef.current).setView([48.8566, 2.3522], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© Fynal Marketplace",
      }).addTo(map);

      // Géocodage des adresses pour obtenir les coordonnées latitude/longitude
      const waypoints = [];
      const geocoder = L.Control.Geocoder.nominatim();

      const geocodeAddress = (address) => {
        return new Promise((resolve) => {
          geocoder.geocode(address, (results) => {
            if (results && results.length > 0) {
              const latLng = results[0].center;
              waypoints.push(L.latLng(latLng.lat, latLng.lng));
            }
            resolve();
          });
        });
    };

    // Boucle pour géocoder chaque adresse
    const geocodeAddresses = async () => {
      for (const address of addresses) {
        await geocodeAddress(address);
      }

      // On vérifie si la map existe avant de lui ajouter des éléments
      if (map) {
        // Calcul du trajet avec l'algorithme de Dijkstra
        const myIcon = L.icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          shadowSize: [41, 41],
        });
        // On vérifie si le contrôle de routage existe et on le supprime avant d'en créer un nouveau
        if (routingControlRef.current) {
          routingControlRef.current.remove();
        }

        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: true,
          addWaypoints : false,
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "car",
            algorithm: "dijkstra",
          }),
          // Utilisation de l'icône de marqueur
           createMarker: (i, waypoint, n) => {
            return L.marker(waypoint.latLng, {
              draggable: false,
              icon: myIcon,
            });
          },
        }).addTo(map);
      }
    };
      geocodeAddresses();
    }
    
    return () => {
      // On vérifie si la map est définie avant de la supprimer
      if (map) {
        map.remove();
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: "400px", objectFit: "cover", zIndex:1}} />;
};

export default DeliveryMap;
