"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CUSTOM_EVENTS } from "@/utils/constants";
import { useSchedulePageAnalytics } from "@/analytics/schedule.analytics";
import EventsNoResults from "@/components/ui/events-no-results";
import { getEventsWithCoordinates } from "@/utils/helper";
import styles from "./map-view.module.css";

/**
 * MapView Component
 * 
 * Displays events on an interactive map using react-leaflet.
 * Events are clustered by region (city/country) and displayed as markers.
 * Clicking a marker opens the same event detail popup as other views.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.events - Filtered events to display on the map
 * @param {Array} props.allEvents - All events (for no results component)
 * @param {string} props.viewType - Current view type
 * @param {Object} props.searchParams - URL search parameters
 */

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMapContainer = dynamic(
  () => import("./map-container").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className={styles.mapLoading}>
        <div className={styles.mapLoading__spinner}></div>
        <p>Loading map...</p>
      </div>
    )
  }
);

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

/**
 * Groups events by region (city + country combination)
 * 
 * @param events - Array of events with location data
 * @returns Array of region groups with aggregated events
 */
const groupEventsByRegion = (events: any[]): IRegionGroup[] => {
  const regionMap = new Map<string, IRegionGroup>();

  events.forEach((event) => {
    // Only include events with valid coordinates
    if (event.latitude && event.longitude) {
      const regionKey = `${event.city || 'Unknown'}-${event.country || 'Unknown'}`;
      
      if (regionMap.has(regionKey)) {
        const existing = regionMap.get(regionKey)!;
        existing.events.push(event);
        existing.eventCount = existing.events.length;
      } else {
        regionMap.set(regionKey, {
          region: regionKey,
          city: event.city || event.location || 'Unknown',
          country: event.country || '',
          latitude: event.latitude,
          longitude: event.longitude,
          events: [event],
          eventCount: 1,
        });
      }
    }
  });

  return Array.from(regionMap.values());
};

interface IMapViewProps {
  events: any[];
  allEvents: any[];
  viewType: string;
  searchParams?: any;
}

const MapView = (props: IMapViewProps) => {
  const { events = [], allEvents = [], viewType, searchParams } = props;
  const router = useRouter();
  const { onEventClicked } = useSchedulePageAnalytics();
  
  const [selectedRegion, setSelectedRegion] = useState<IRegionGroup | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(globalThis.innerWidth < 1024);
    };
    
    checkMobile();
    globalThis.addEventListener("resize", checkMobile);
    
    return () => globalThis.removeEventListener("resize", checkMobile);
  }, []);

  // Group events by region for clustering
  const regionGroups = useMemo(() => {
    return groupEventsByRegion(events);
  }, [events]);

  // Get events with valid coordinates - filter happens here in map-view
  // This is view-specific logic: only map view needs coordinate filtering
  const eventsWithCoordinates = useMemo(() => {
    return getEventsWithCoordinates(events);
  }, [events]);

  /**
   * Opens the event detail popup (same as list/program views)
   */
  const onOpenDetailPopup = useCallback((event: any) => {
    onEventClicked(viewType, event?.id, event?.name);

    if (event.slug) {
      document.dispatchEvent(
        new CustomEvent(CUSTOM_EVENTS.SHOW_EVENT_DETAIL_MODAL, {
          detail: { isOpen: true, event },
        })
      );
      router.push(
        `${globalThis.location.pathname}${globalThis.location.search}#${event.slug}`,
        { scroll: false }
      );
    }
  }, [onEventClicked, viewType, router]);

  /**
   * Handles marker click - shows region popup or opens event detail
   */
  const onMarkerClick = useCallback((region: IRegionGroup) => {
    if (region.events.length === 1) {
      // Single event - open detail directly
      onOpenDetailPopup(region.events[0]);
    } else {
      // Multiple events - show region popup
      setSelectedRegion(region);
    }
  }, [onOpenDetailPopup]);

  // If no events with coordinates, show appropriate message
  if (events.length === 0) {
    return (
      <div className={styles.mapView__wrapper}>
        <EventsNoResults searchParams={searchParams} allEvents={allEvents} />
      </div>
    );
  }

  if (eventsWithCoordinates.length === 0) {
    return (
      <div className={styles.mapView__wrapper}>
        <div className={styles.mapView__noLocations}>
          <img src="/icons/pl-location-icon.svg" alt="No locations" />
          <h3>No location data available</h3>
          <p>The events in this selection don&apos;t have map coordinates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.mapView__wrapper}>
      <div className={styles.mapView__container}>
        <DynamicMapContainer
          regionGroups={regionGroups}
          events={eventsWithCoordinates}
          onMarkerClick={onMarkerClick}
          onEventClick={onOpenDetailPopup}
          selectedRegion={selectedRegion}
          onCloseRegionPopup={() => setSelectedRegion(null)}
          isMobile={isMobile}
        />
      </div>
      
      {/* Event count badge */}
      <div className={styles.mapView__badge}>
        <span>{eventsWithCoordinates.length}</span>
        <span>{eventsWithCoordinates.length === 1 ? 'Event' : 'Events'} on Map</span>
      </div>
    </div>
  );
};

export default MapView;

