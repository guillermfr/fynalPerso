import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";

const DeliveryMap = ({ addresses }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // On supprime la carte si une ancienne instance existe
    if (mapRef.current && mapRef.current._leaflet_id) {
      mapRef.current.remove();
    }

    // Création de la carte
    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 13);

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

      console.log("waypoints:", waypoints); // Affichage des coordonnées

      if (waypoints.length === 0) {
        console.error("Il n'y a pas de coordonnées"); // On gère le cas où le tableau des coordonnées est vide
        return;
      }

      // Icone personnalisée
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

      // Calcul du trajet avec l'algorithme de Dijkstra
      routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        addWaypoints : false,
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "car",
          algorithm: "dijkstra",
        }),
        createMarker: (i, waypoint, n) => {
          console.log("waypoint:", waypoint); // On vérifie si le point correspond à de vraies coordonnées
          return L.marker(waypoint.latLng, {
            draggable: false,
            icon: myIcon,
          });
        },
      });

      if (!routingControlRef.current) {
        console.error("Le routing control ne peut pas être créé"); // On gère le cas où on ne peut pas créer de trajet
        return;
      }

      routingControlRef.current.addTo(map);

      routingControlRef.current.on("routingerror", (e) => console.error("Routing error:", e));
      routingControlRef.current.on("waypointschanged", (e) => console.log("Waypoints changed:", e.waypoints));
    };

    geocodeAddresses();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [addresses]);

  return <div ref={mapRef} style={{ height: "400px", objectFit: "cover", zIndex:1}} />;
};

export default DeliveryMap;