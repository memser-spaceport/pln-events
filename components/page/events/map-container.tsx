"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

/**
 * Interface for region-grouped events
 */
interface IRegionGroup {
  region: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  events: any[];
  eventCount: number;
}

interface IMapContainerComponentProps {
  regionGroups: IRegionGroup[];
  events: any[];
  onMarkerClick: (region: IRegionGroup) => void;
  onEventClick: (event: any) => void;
  selectedRegion: IRegionGroup | null;
  onCloseRegionPopup: () => void;
  isMobile: boolean;
  onEventsAroundMeClick?: () => void;
}

/**
 * Map configuration constants
 */
const MAP_CONFIG = {
  TILE_LAYER_URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  TILE_LAYER_ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  DEFAULT_CENTER: [20, 0] as [number, number],
  DEFAULT_ZOOM: 3, // Increased to match MIN_ZOOM and prevent seeing multiple continents
  MIN_ZOOM: 3, // Increased to prevent seeing multiple continents on widescreen
  MAX_ZOOM: 18,
  FLY_DURATION: 1.5,
};

/** Threshold for determining if markers are at "same location" */
const SAME_LOCATION_THRESHOLD = 0.0001;

/**
 * Checks if all markers in a cluster are at the same location
 * @param markers - Array of Leaflet markers
 * @returns true if all markers are within SAME_LOCATION_THRESHOLD of each other
 */
const areMarkersAtSameLocation = (markers: any[]): boolean => {
  if (!markers.length) return false;
  const firstLatLng = markers[0]?.getLatLng();
  if (!firstLatLng) return false;
  
  return markers.every((marker: any) => {
    const latLng = marker.getLatLng();
    return Math.abs(latLng.lat - firstLatLng.lat) < SAME_LOCATION_THRESHOLD && 
           Math.abs(latLng.lng - firstLatLng.lng) < SAME_LOCATION_THRESHOLD;
  });
};

/**
 * Handles cluster spiderfy for same-location markers
 * @param layer - Leaflet cluster layer
 */
const handleClusterSpiderfy = (layer: any): void => {
  if (!layer.spiderfy || !layer.getChildCount || layer.getChildCount() <= 1) {
    return;
  }
  
  const childMarkers = layer.getAllChildMarkers();
  if (areMarkersAtSameLocation(childMarkers)) {
    layer.spiderfy();
  }
};

/**
 * Determines the appropriate zoom level based on location accuracy
 * @param accuracy - Location accuracy in meters
 * @returns Zoom level (12-16)
 */
const getZoomLevelForAccuracy = (accuracy: number): number => {
  if (accuracy < 100) return 16;
  if (accuracy < 500) return 14;
  return 12;
};

/**
 * Cluster configuration - matches POC settings
 * IMPORTANT: Never disable clustering to prevent same-location markers from stacking
 */
const CLUSTER_CONFIG = {
  showCoverageOnHover: false,  // Disabled to remove blue coverage polygon on hover
  zoomToBoundsOnClick: false,  // We handle click manually to support spiderfy for same-location events
  spiderfyOnMaxZoom: true,
  spiderfyDistanceMultiplier: 2.5,  // Increase spider spread for better visibility with many markers
  removeOutsideVisibleBounds: true,
  animate: true,
  maxClusterRadius: 80,  // Same as POC
  // DO NOT set disableClusteringAtZoom - this causes same-location markers to stack invisibly
  // Instead, let clustering continue and spiderfy at max zoom
  singleMarkerMode: false,
  // Spider leg styling - light and subtle
  spiderLegPolylineOptions: {
    weight: 1,
    color: '#94a3b8',
    opacity: 0.4,
  },
};

/**
 * Paths to existing marker icons
 */
const MARKER_ICONS = {
  default: '/icons/location-pin.svg',
};

/**
 * Creates a custom marker icon - always uses location pins per Figma design
 * Uses existing SVG icons from public/icons folder
 * @param eventImage - URL of the event image
 * @param isFeatured - Whether this is a featured event
 */
const createCustomMarkerIcon = (eventImage: string, isFeatured: boolean = false): L.DivIcon => {
  const iconSrc = MARKER_ICONS.default;
  
  return L.divIcon({
    html: `
      <div class="map-marker-pin">
        <img class="map-marker-pin-icon" src="${iconSrc}" alt="Event location" width="36" height="40" />
        <img class="map-marker-pin-image" src="${eventImage}" alt="Event image" />
        ${isFeatured ? `<img class="map-marker-pin-image-overlay" src="/icons/featured-logo.svg" alt="Event image overlay" />` : ''}
      </div>
    `,
    iconSize: [36, 40],
    iconAnchor: [18, 40],
    popupAnchor: [0, -40],
    className: 'custom-div-marker-icon',
  });
};

/**
 * Default fallback icon for events without images (used in pins and hover popover)
 */
const DEFAULT_EVENT_IMAGE = '/images/event-default.svg';

/**
 * Creates cluster icon matching Figma design:
 * - White pill with "X Events" text
 * - Blue ring around the cluster
 * - Stacked pins with event images overlaid (reduced sizes)
 */
const createClusterIcon = (cluster: any): L.DivIcon => {
  const count = cluster.getChildCount();
  const markers = cluster.getAllChildMarkers();
  
  // Get up to 3 markers for the stack display
  const stackCount = Math.min(count, 3);
  
  // Create stacked pins HTML with event images overlaid (smaller sizes)
  let stackedPinsHtml = '';
  for (let i = 0; i < stackCount; i++) {
    const marker = markers[i];
    const eventData = marker?.options?.eventData;
    const isFeatured = eventData?.isFeatured || false;
    const iconSrc = MARKER_ICONS.default;
    const eventImage = eventData?.eventLogo || eventData?.hostLogo || DEFAULT_EVENT_IMAGE;
    stackedPinsHtml += `
      <div class="cluster-stack-pin cluster-stack-pin--${i + 1}">
        <img class="cluster-stack-pin-icon" src="${iconSrc}" alt="Event" width="32" height="35" />
        <img class="cluster-stack-pin-image" src="${eventImage}" alt="Event image" onerror="this.src='${DEFAULT_EVENT_IMAGE}';" />
      </div>
    `;
  }

  return L.divIcon({
    html: `
      <div class="cluster-container">
        <div class="cluster-pill">${count} Events</div>
        <div class="cluster-ring"></div>
        <div class="cluster-stack-container">
          ${stackedPinsHtml}
        </div>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [70, 70],
    iconAnchor: [35, 45],
  });
};

/**
 * Creates user location icon
 */
const createUserLocationIcon = (): L.DivIcon => {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'user-location-marker',
  });
};

/**
 * Region popup component for multiple events at same location
 */
function RegionPopup({ 
  region, 
  onEventClick, 
  onClose 
}: Readonly<{ 
  region: IRegionGroup; 
  onEventClick: (event: any) => void;
  onClose: () => void;
}>) {
  return (
    <div className="map-region-popup">
      <div className="map-region-popup__header">
        <div className="map-region-popup__title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#156ff7"/>
          </svg>
          <span>{region.city}{region.country ? `, ${region.country}` : ''}</span>
        </div>
        <button className="map-region-popup__close" onClick={onClose} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="map-region-popup__count">{region.eventCount} {region.eventCount === 1 ? 'Event' : 'Events'}</p>
      <div className="map-region-popup__events">
        {region.events.map((event, index) => (
          <button 
            key={event.id || index} 
            className="map-region-popup__event-card"
            onClick={() => onEventClick(event)}
            type="button"
          >
            <div className="map-region-popup__event-header">
              {event.eventLogo ? (
                <img 
                  src={event.eventLogo} 
                  alt={event.name || event.title} 
                  className="map-region-popup__event-logo"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="map-region-popup__event-logo-fallback">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#156ff7"/>
                  </svg>
                </div>
              )}
              <div className="map-region-popup__event-info">
                <h4 className="map-region-popup__event-title">{event.name || event.title}</h4>
                <p className="map-region-popup__event-date">{event.dateRange}</p>
              </div>
            </div>
            <span className="map-region-popup__event-btn">View Details</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Map Container Component
 * Implements vanilla Leaflet with marker clustering, matching the Figma design
 */
function MapContainerComponent({
  regionGroups,
  events,
  onMarkerClick,
  onEventClick,
  selectedRegion,
  onCloseRegionPopup,
  isMobile,
  onEventsAroundMeClick,
}: Readonly<IMapContainerComponentProps>) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const hasInitializedBoundsRef = useRef(false);
  const previousEventsLengthRef = useRef(0);
  
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number; accuracy: number} | null>(null);

  /**
   * Initialize the map
   */
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    // Set max bounds to prevent world wrapping - limit to one world instance
    const maxBounds = L.latLngBounds(
      L.latLng(-85, -180), // Southwest corner
      L.latLng(85, 180)    // Northeast corner
    );

    const map = L.map(mapRef.current, {
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      minZoom: MAP_CONFIG.MIN_ZOOM,
      maxZoom: MAP_CONFIG.MAX_ZOOM,
      zoomControl: !isMobile,
      scrollWheelZoom: true,
      worldCopyJump: false,
      maxBounds: maxBounds, // Prevent panning beyond one world instance
      maxBoundsViscosity: 1, // Make bounds sticky
    });

    // Add tile layer with noWrap to prevent horizontal wrapping
    L.tileLayer(MAP_CONFIG.TILE_LAYER_URL, {
      attribution: MAP_CONFIG.TILE_LAYER_ATTRIBUTION,
      noWrap: true, // Prevent tile wrapping - show only one world instance
    }).addTo(map);

    // Create cluster group with custom icon - only clusters 3+ markers
    const clusterGroup = L.markerClusterGroup({
      ...CLUSTER_CONFIG,
      iconCreateFunction: createClusterIcon,
    });

    // Custom cluster click handler for proper zoom/spiderfy behavior
    clusterGroup.on('clusterclick', (e: any) => {
      const cluster = e.layer;
      const childMarkers = cluster.getAllChildMarkers();
      const bounds = cluster.getBounds();
      const currentZoom = map.getZoom();
      
      // Check if all markers are at the same location
      const allSameLocation = areMarkersAtSameLocation(childMarkers);

      // Calculate if zooming would actually help (bounds are too small to separate)
      const boundsSpan = Math.max(
        bounds.getNorth() - bounds.getSouth(),
        bounds.getEast() - bounds.getWest()
      );
      const zoomWouldHelp = boundsSpan > 0.001; // ~100m difference
      const shouldSpiderfy = allSameLocation || currentZoom >= MAP_CONFIG.MAX_ZOOM - 2 || !zoomWouldHelp;

      if (shouldSpiderfy) {
        // Spiderfy immediately when:
        // 1. All markers at same location
        // 2. Already at high zoom
        // 3. Bounds are too small for zoom to help
        cluster.spiderfy();
      } else {
        // Otherwise zoom to bounds
        map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: MAP_CONFIG.MAX_ZOOM - 2,
          duration: MAP_CONFIG.FLY_DURATION * 0.5,
        });
      }
    });

    // Handle zoom end to auto-spiderfy clusters at max zoom
    map.on('zoomend', () => {
      if (map.getZoom() >= MAP_CONFIG.MAX_ZOOM - 1) {
        // At max zoom, spiderfy any visible clusters with same-location markers
        clusterGroup.eachLayer((layer: any) => {
          handleClusterSpiderfy(layer);
        });
      }
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    // Create user location layer
    const userLocationLayer = L.layerGroup().addTo(map);
    userLocationLayerRef.current = userLocationLayer;

    mapInstanceRef.current = map;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      clusterGroupRef.current = null;
      userLocationLayerRef.current = null;
    };
  }, [isMobile]);

  /**
   * Handle container resize (e.g., when filter drawer opens/closes)
   * Leaflet needs invalidateSize() to be called when container dimensions change
   */
  useEffect(() => {
    const map = mapInstanceRef.current;
    const container = mapRef.current;
    if (!map || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Small delay to let CSS transitions complete
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  /**
   * Update markers when events change
   */
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!map || !clusterGroup) return;

    // Clear existing markers
    clusterGroup.clearLayers();

    // Add markers for each event
    // Note: events are already filtered for coordinates in map-view.tsx
    // This check serves as a safety guard
    events.forEach((event) => {
      // Safety check: skip events without valid coordinates
      // Also skip events with 0,0 coordinates (invalid/missing location data)
      if (event.latitude == null || event.longitude == null || 
          typeof event.latitude !== 'number' || 
          typeof event.longitude !== 'number' ||
          Number.isNaN(event.latitude) || 
          Number.isNaN(event.longitude) ||
          (event.latitude === 0 && event.longitude === 0)) {
        return;
      }

      // Check if event is featured
      const isFeatured = event.isFeaturedEvent || event.isFeatured || false;
      const eventImage = event.eventLogo || event.hostLogo || DEFAULT_EVENT_IMAGE;

      const marker = L.marker([event.latitude, event.longitude], {
        icon: createCustomMarkerIcon(eventImage, isFeatured),
        // Store event data for cluster icon creation
        eventData: { ...event, isFeatured },
      } as any);

      // Add rich tooltip to show event details on hover (matching Figma design)
      const eventName = event.name || event.title || 'Event';
      const eventLocation = event.eventLocation || event.location || event.venue?.name || '';
      const eventDate = event.dateRange || event.startDate || '';
      const eventTime = event.timeRange || '';
      // Use same fallback logic as detail popup: eventLogo -> hostLogo -> default
      
      const tooltipContent = `
        <div class="map-event-tooltip">
          <div class="map-event-tooltip__image-wrapper">
            <img src="${eventImage}" alt="${eventName}" class="map-event-tooltip__image" onerror="this.src='/images/event-default.svg';" />
          </div>
          <div class="map-event-tooltip__content">
            <div class="map-event-tooltip__info">
              <p class="map-event-tooltip__title">${eventName}</p>
              ${eventLocation ? `
                <div class="map-event-tooltip__row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#64748b"/>
                  </svg>
                  <span>${eventLocation}</span>
                </div>
              ` : ''}
            </div>
            <div class="map-event-tooltip__meta">
              ${eventDate ? `
                <div class="map-event-tooltip__row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="#64748b"/>
                  </svg>
                  <span>${eventDate}</span>
                </div>
              ` : ''}
              ${eventTime ? `
                <div class="map-event-tooltip__row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#64748b"/>
                  </svg>
                  <span>${eventTime}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
      
      marker.bindTooltip(tooltipContent, {
        direction: 'right',
        offset: [20, 0],
        className: 'map-marker-tooltip-rich',
        permanent: false,
        interactive: false,
      });

      // Directly open event details modal on click (no popup)
      marker.on('click', () => {
        onEventClick(event);
      });

      // Add hover effect
      marker.on('mouseover', () => {
        const iconElement = marker.getElement()?.querySelector('.map-marker-pin');
        if (iconElement) {
          (iconElement as HTMLElement).style.transform = 'scale(1.15)';
        }
      });

      marker.on('mouseout', () => {
        const iconElement = marker.getElement()?.querySelector('.map-marker-pin');
        if (iconElement) {
          (iconElement as HTMLElement).style.transform = 'scale(1)';
          (iconElement as HTMLElement).style.filter = 'none';
        }
      });

      clusterGroup.addLayer(marker);
    });

    // Fit bounds to show all markers - only on initial load or when events actually change
    // This prevents zooming out when clicking on markers
    const eventsChanged = events.length !== previousEventsLengthRef.current;
    previousEventsLengthRef.current = events.length;
    
    if (events.length > 0 && (!hasInitializedBoundsRef.current || eventsChanged)) {
      const validEvents = events.filter(e => e.latitude && e.longitude && !(e.latitude === 0 && e.longitude === 0));
      if (validEvents.length > 0) {
        const bounds = L.latLngBounds(
          validEvents.map(e => [e.latitude, e.longitude] as [number, number])
        );
        map.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
          duration: MAP_CONFIG.FLY_DURATION,
        });
        hasInitializedBoundsRef.current = true;
      }
    }
  }, [events, onEventClick]);

  /**
   * Update user location marker
   */
  useEffect(() => {
    const userLocationLayer = userLocationLayerRef.current;
    if (!userLocationLayer || !userLocation) return;

    userLocationLayer.clearLayers();

    // Cap the accuracy circle radius for visual purposes (max 150m display)
    // Only show circle if accuracy is reasonable (< 500m)
    const displayRadius = Math.min(userLocation.accuracy || 50, 150);
    const showAccuracyCircle = userLocation.accuracy < 500;

    if (showAccuracyCircle) {
      // Add accuracy circle - subtle and capped
      L.circle([userLocation.lat, userLocation.lng], {
        radius: displayRadius,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(userLocationLayer);
    }

    // Add user marker
    const userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: createUserLocationIcon(),
    });

    const accuracyText = userLocation.accuracy > 1000 
      ? `±${(userLocation.accuracy / 1000).toFixed(1)}km` 
      : `±${Math.round(userLocation.accuracy)}m`;

    userMarker.bindPopup(`
      <div class="map-popup-content">
        <h4 style="font-weight: 600; color: #0f172a; margin-bottom: 8px;">Your Location</h4>
        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Accuracy: ${accuracyText}</p>
        ${userLocation.accuracy > 500 ? '<p style="font-size: 12px; color: #f59e0b; margin: 4px 0;">⚠️ Low accuracy - try on mobile for better results</p>' : ''}
      </div>
    `);

    userLocationLayer.addLayer(userMarker);
  }, [userLocation]);

  /**
   * Get user location with improved accuracy
   * Uses watchPosition to get progressively better location fixes
   */
  const getUserLocation = useCallback(() => {
    // Track analytics for "Events around me" click
    onEventsAroundMeClick?.();
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    let watchId: number;
    let bestAccuracy = Infinity;
    let hasFlown = false;

    // Use watchPosition for better accuracy - it refines location over time
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Only update if this position is more accurate
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          setUserLocation({ lat: latitude, lng: longitude, accuracy });

          // Fly to location on first good fix
          const map = mapInstanceRef.current;
          if (map && !hasFlown) {
            hasFlown = true;
            // Zoom level based on accuracy - closer zoom for better accuracy
            const zoomLevel = getZoomLevelForAccuracy(accuracy);
            map.flyTo([latitude, longitude], zoomLevel, {
              duration: MAP_CONFIG.FLY_DURATION,
            });
          }
        }

        // Stop watching after getting a good fix (< 100m) or after 5 seconds
        if (accuracy < 100) {
          navigator.geolocation.clearWatch(watchId);
          setIsLocating(false);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
        navigator.geolocation.clearWatch(watchId);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // Stop watching after 5 seconds regardless
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setIsLocating(false);
    }, 5000);
  }, [onEventsAroundMeClick]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />
      
      {/* Location Button */}
      <div className="map-controls">
        <button
          className="map-locate-btn"
          onClick={getUserLocation}
          disabled={isLocating}
          title="Events around me"
          type="button"
        >
          {isLocating ? (
            <div className="map-locate-spinner" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" fill="#156ff7"/>
            </svg>
          )}
          <span className="map-locate-text">Events around me</span>
        </button>
        
        {locationError && (
          <div className="map-location-error">
            {locationError}
          </div>
        )}
      </div>

      {/* Region popup overlay for multiple events */}
      {selectedRegion && selectedRegion.eventCount > 1 && (
        <div className="map-region-overlay">
          <button 
            className="map-region-overlay__backdrop" 
            onClick={onCloseRegionPopup}
            type="button"
            aria-label="Close popup"
          />
          <RegionPopup
            region={selectedRegion}
            onEventClick={onEventClick}
            onClose={onCloseRegionPopup}
          />
        </div>
      )}

      <style>{mapStyles}</style>
    </div>
  );
}

/**
 * Map styles matching the Figma design
 */
const mapStyles = `
  /* Map wrapper and container */
  .map-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .map-container {
    height: 100%;
    width: 100%;
    z-index: 0;
  }

  /* Custom marker styles - Figma hexagonal pins */
  .custom-div-marker-icon {
    background: transparent !important;
    border: none !important;
    cursor: pointer;
  }

  .map-marker-pin {
    transition: transform 0.2s ease, filter 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .map-marker-pin-image {
    position: absolute;
    width: 24px !important;
    height: 24px;
    border-radius: 50%;
    top: 4.5px;
    left: 5.5px;
    object-fit: cover;
  }

  .map-marker-pin-image-overlay {
    position: absolute;
    top: 0px;
    right: 2px;
    width: 12px !important;
    height: 12px;
  }

  .map-marker-pin-icon {
    display: block;
    width: 36px;
    height: 40px;
  }

  /* Hover effect for pins */
  .leaflet-marker-icon.custom-div-marker-icon:hover .map-marker-pin {
    transform: scale(1.15);
  }

  /* Rich tooltip styles for event details on hover - matching Figma design */
  .map-marker-tooltip-rich {
    background: white !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 8px !important;
    padding: 7px 10px !important;
    box-shadow: 0 2px 6px rgba(15, 23, 42, 0.16) !important;
    max-width: 340px !important;
    min-width: 280px !important;
  }

  .map-marker-tooltip-rich::before {
    display: none !important;
  }

  .map-event-tooltip {
    display: flex;
    gap: 6px;
    align-items: flex-start;
  }

  .map-event-tooltip__image-wrapper {
    flex-shrink: 0;
    padding: 3px 0;
  }

  .map-event-tooltip__image {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    object-fit: cover;
    background: #f1f5f9;
    border: 1px solid #DBDBDB;
  }

  .map-event-tooltip__content {
    flex: 1;
    min-width: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .map-event-tooltip__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .map-event-tooltip__title {
    font-family: 'Aileron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin: 0;
    line-height: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .map-event-tooltip__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .map-event-tooltip__row svg {
    flex-shrink: 0;
  }

  .map-event-tooltip__row span {
    font-family: 'Aileron', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .map-event-tooltip__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .map-event-tooltip__meta .map-event-tooltip__row span {
    font-size: 12px;
    color: #64748b;
    line-height: 22px;
  }

  /* Cluster icon styles - Figma design */
  .custom-cluster-icon {
    background: transparent !important;
    border: none !important;
  }

  .cluster-container {
    position: relative;
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Figma cluster pill styling - smaller */
  .cluster-pill {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 3px 8px;
    border-radius: 45px;
    font-size: 10px;
    font-weight: 600;
    color: #0f172a;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.25);
    white-space: nowrap;
    z-index: 100;
  }

  /* Figma cluster ring styling - smaller */
  .cluster-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 2px solid #156FF7;
    background: rgba(21, 111, 247, 0.1);
    z-index: 0;
    pointer-events: none;
  }

  .cluster-stack-container {
    position: relative;
    width: 44px;
    height: 50px;
    margin-top: 10px;
  }

  /* Stacked pins in cluster - cascading diagonal overlap with event images */
  .cluster-stack-pin {
    position: absolute;
    transition: transform 0.2s ease;
    width: 32px;
    height: 35px;
  }

  .cluster-stack-pin-icon {
    width: 32px;
    height: 35px;
    display: block;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
    position: absolute;
    top: 0;
    left: 0;
  }

  .cluster-stack-pin-image {
    position: absolute;
    top: 4px;
    left: 4.5px;
    width: 20.5px !important;
    height: 20.5px;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Third pin - back layer (top-right) */
  .cluster-stack-pin--3 {
    top: 3px;
    left: 15px;
    z-index: 1;
  }

  /* Second pin - middle layer (top-left) */
  .cluster-stack-pin--2 {
    top: 4px;
    left: 0;
    z-index: 2;
  }

  /* First pin - front layer (center-bottom, most prominent) */
  .cluster-stack-pin--1 {
    top: 14px;
    left: 6px;
    z-index: 3;
  }

  /* Hover effect for clusters */
  .custom-cluster-icon:hover .cluster-container {
    transform: scale(1.05);
  }

  .custom-cluster-icon:hover .cluster-ring {
    border-width: 3px;
    background: rgba(21, 111, 247, 0.15);
  }

  /* User location marker */
  .user-location-marker {
    background: transparent !important;
    border: none !important;
  }

  /* Map controls - positioned at bottom right */
  .map-controls {
    position: absolute;
    bottom: 70px;
    right: 16px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .map-locate-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #156ff7;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .map-locate-btn:hover {
    border-color: #156ff7;
    background: #f0f7ff;
  }

  .map-locate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .map-locate-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid #e2e8f0;
    border-top-color: #156ff7;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .map-locate-text {
    display: block;
  }

  .map-location-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    max-width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* User location popup styles */
  .leaflet-popup-content-wrapper {
    border-radius: 12px;
    padding: 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    overflow: hidden;
  }

  .leaflet-popup-content {
    margin: 0;
    padding: 16px;
  }

  .leaflet-popup-tip {
    background: white;
  }

  /* Region popup overlay */
  .map-region-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .map-region-overlay__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
  }

  .map-region-popup {
    position: relative;
    background: white;
    border-radius: 16px;
    padding: 20px;
    max-width: 420px;
    width: 100%;
    max-height: 70vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  }

  .map-region-popup__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .map-region-popup__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }

  .map-region-popup__close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s ease;
  }

  .map-region-popup__close:hover {
    background: #f1f5f9;
  }

  .map-region-popup__count {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 16px 0;
  }

  .map-region-popup__events {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: calc(70vh - 100px);
    padding-right: 8px;
  }

  .map-region-popup__events::-webkit-scrollbar {
    width: 6px;
  }

  .map-region-popup__events::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  .map-region-popup__events::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .map-region-popup__event-card {
    padding: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .map-region-popup__event-card:hover {
    border-color: #156ff7;
    background: #f8fafc;
  }

  .map-region-popup__event-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .map-region-popup__event-logo {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #f1f5f9;
  }

  .map-region-popup__event-logo-fallback {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .map-region-popup__event-info {
    flex: 1;
    min-width: 0;
  }

  .map-region-popup__event-title {
    font-size: 14px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 4px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .map-region-popup__event-date {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }

  .map-region-popup__event-btn {
    width: 100%;
    padding: 8px 14px;
    background: #156ff7;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .map-region-popup__event-btn:hover {
    background: #1258cc;
  }

  /* Hide Leaflet attribution on bottom right */
  .leaflet-bottom.leaflet-right {
    display: none;
  }

  /* Mobile adjustments */
  @media (max-width: 768px) {
    .map-controls {
      bottom: 70px;
      right: 12px;
    }

    .map-locate-text {
      display: none;
    }

    .map-locate-btn {
      padding: 10px;
    }

    .map-region-popup {
      max-width: calc(100% - 40px);
      max-height: 60vh;
    }
  }
`;

export default MapContainerComponent;
