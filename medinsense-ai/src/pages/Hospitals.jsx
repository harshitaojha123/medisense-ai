import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Cross,
  Filter,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Star,
  X,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* --------------------------------------------------------------------------
   LEAFLET MARKER FIX
-------------------------------------------------------------------------- */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* --------------------------------------------------------------------------
   CONSTANTS
-------------------------------------------------------------------------- */

const DEFAULT_CENTER = [20.5937, 78.9629];

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search";

/*
  Multiple Overpass servers are used so that the app does not completely
  fail when one public server is busy/unavailable.
*/
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

const specialtyAliases = {
  endocrinology: "Diabetes Care",
  diabetes: "Diabetes Care",
  "diabetes-care": "Diabetes Care",
  "general-medicine": "General Medicine",
  cardiology: "Cardiology",
  diagnostics: "Diagnostics",
  emergency: "Emergency Care",
  "emergency-care": "Emergency Care",
  preventive: "Preventive Care",
};

const specialties = [
  {
    name: "General Medicine",
    icon: Stethoscope,
  },
  {
    name: "Cardiology",
    icon: HeartPulse,
  },
  {
    name: "Diagnostics",
    icon: Activity,
  },
  {
    name: "Emergency Care",
    icon: Cross,
  },
  {
    name: "Diabetes Care",
    icon: Syringe,
  },
  {
    name: "Preventive Care",
    icon: ShieldCheck,
  },
];

/* --------------------------------------------------------------------------
   HELPERS
-------------------------------------------------------------------------- */

function getFacilityType(tags = {}) {
  const amenity = tags.amenity?.toLowerCase();
  const healthcare = tags.healthcare?.toLowerCase();

  if (
    amenity === "hospital" ||
    healthcare === "hospital"
  ) {
    return "Hospital";
  }

  if (
    amenity === "clinic" ||
    amenity === "doctors" ||
    healthcare === "clinic" ||
    healthcare === "doctor"
  ) {
    return "Clinic";
  }

  if (
    amenity === "pharmacy" ||
    healthcare === "pharmacy"
  ) {
    return "Pharmacy";
  }

  if (
    healthcare === "laboratory" ||
    healthcare === "diagnostic_lab"
  ) {
    return "Diagnostics";
  }

  if (healthcare === "specialist") {
    return "Specialist";
  }

  return "Healthcare";
}

function getCoordinates(element) {
  if (
    element.lat !== undefined &&
    element.lon !== undefined
  ) {
    return {
      lat: Number(element.lat),
      lon: Number(element.lon),
    };
  }

  if (element.center) {
    return {
      lat: Number(element.center.lat),
      lon: Number(element.center.lon),
    };
  }

  return null;
}

function getName(tags = {}) {
  return (
    tags.name ||
    tags["name:en"] ||
    tags.operator ||
    "Healthcare Facility"
  );
}

function getAddress(tags = {}) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);

  return (
    parts.join(", ") ||
    tags["addr:full"] ||
    "Address not available"
  );
}

function getPhone(tags = {}) {
  return (
    tags.phone ||
    tags["contact:phone"] ||
    "Phone not available"
  );
}

function getSpecialty(tags = {}) {
  const values = [
    tags.speciality,
    tags.specialty,
    tags["healthcare:speciality"],
    tags["healthcare:specialty"],
  ].filter(Boolean);

  if (values.length > 0) {
    return values.join(", ");
  }

  const name = getName(tags).toLowerCase();

  if (
    name.includes("diabetes") ||
    name.includes("diabet") ||
    name.includes("endocr")
  ) {
    return "Endocrinology / Diabetes Care";
  }

  if (
    name.includes("apollo") ||
    name.includes("fortis") ||
    name.includes("max") ||
    name.includes("medanta")
  ) {
    return "Multispecialty Healthcare";
  }

  return "Healthcare Services";
}

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function formatDistance(distance) {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1)} km`;
}

function buildGoogleMapsUrl(lat, lon) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

/* --------------------------------------------------------------------------
   MAP CONTROLLER
-------------------------------------------------------------------------- */

function MapController({ center, zoom = 14 }) {
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    map.flyTo(center, zoom, {
      duration: 1.2,
    });
  }, [center, zoom, map]);

  return null;
}

/* --------------------------------------------------------------------------
   HOSPITALS PAGE
-------------------------------------------------------------------------- */

function Hospitals() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [search, setSearch] =
    useState("");

  const [activeType, setActiveType] =
    useState("All");

  const [selectedSpecialty, setSelectedSpecialty] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [userLocation, setUserLocation] =
    useState(null);

  const [mapCenter, setMapCenter] =
    useState(DEFAULT_CENTER);

  const [mapZoom, setMapZoom] =
    useState(5);

  const [facilities, setFacilities] =
    useState([]);

  const [loadingFacilities, setLoadingFacilities] =
    useState(false);

  const [facilityError, setFacilityError] =
    useState("");

  const [searchingLocation, setSearchingLocation] =
    useState(false);

  const [hasSearched, setHasSearched] =
    useState(false);

  /* ----------------------------------------------------------------------
     READ SPECIALTY FROM URL
  ---------------------------------------------------------------------- */

  useEffect(() => {
    const specialtyFromUrl =
      searchParams.get("specialty");

    if (!specialtyFromUrl) {
      return;
    }

    const normalized =
      specialtyFromUrl
        .trim()
        .toLowerCase();

    const mappedSpecialty =
      specialtyAliases[normalized];

    if (mappedSpecialty) {
      setSelectedSpecialty(mappedSpecialty);
      setShowFilters(true);
    }
  }, [searchParams]);

  /* ----------------------------------------------------------------------
     BUILD OVERPASS QUERY
  ---------------------------------------------------------------------- */

  const buildHealthcareQuery = (
    latitude,
    longitude,
    radius
  ) => {
    return `
      [out:json][timeout:35];

      (
        node["amenity"="hospital"]
          (around:${radius},${latitude},${longitude});

        way["amenity"="hospital"]
          (around:${radius},${latitude},${longitude});

        relation["amenity"="hospital"]
          (around:${radius},${latitude},${longitude});


        node["amenity"="clinic"]
          (around:${radius},${latitude},${longitude});

        way["amenity"="clinic"]
          (around:${radius},${latitude},${longitude});

        relation["amenity"="clinic"]
          (around:${radius},${latitude},${longitude});


        node["amenity"="doctors"]
          (around:${radius},${latitude},${longitude});

        way["amenity"="doctors"]
          (around:${radius},${latitude},${longitude});

        relation["amenity"="doctors"]
          (around:${radius},${latitude},${longitude});


        node["healthcare"="doctor"]
          (around:${radius},${latitude},${longitude});

        way["healthcare"="doctor"]
          (around:${radius},${latitude},${longitude});

        relation["healthcare"="doctor"]
          (around:${radius},${latitude},${longitude});


        node["healthcare"="clinic"]
          (around:${radius},${latitude},${longitude});

        way["healthcare"="clinic"]
          (around:${radius},${latitude},${longitude});

        relation["healthcare"="clinic"]
          (around:${radius},${latitude},${longitude});


        node["healthcare"="hospital"]
          (around:${radius},${latitude},${longitude});

        way["healthcare"="hospital"]
          (around:${radius},${latitude},${longitude});

        relation["healthcare"="hospital"]
          (around:${radius},${latitude},${longitude});


        node["healthcare"="specialist"]
          (around:${radius},${latitude},${longitude});

        way["healthcare"="specialist"]
          (around:${radius},${latitude},${longitude});

        relation["healthcare"="specialist"]
          (around:${radius},${latitude},${longitude});


        node["healthcare"="diagnostic_lab"]
          (around:${radius},${latitude},${longitude});

        way["healthcare"="diagnostic_lab"]
          (around:${radius},${latitude},${longitude});

        relation["healthcare"="diagnostic_lab"]
          (around:${radius},${latitude},${longitude});
      );

      out center tags;
    `;
  };

  /* ----------------------------------------------------------------------
     FETCH HEALTHCARE FACILITIES
  ---------------------------------------------------------------------- */

  const fetchFacilitiesFromOverpass = async (
    latitude,
    longitude,
    radius
  ) => {
    const query = buildHealthcareQuery(
      latitude,
      longitude,
      radius
    );

    let lastError = null;

    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        const response = await fetch(
          endpoint,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `data=${encodeURIComponent(query)}`,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Overpass server returned ${response.status}`
          );
        }

        const data =
          await response.json();

        if (
          data &&
          Array.isArray(data.elements)
        ) {
          return data;
        }
      } catch (error) {
        console.warn(
          "Overpass endpoint failed:",
          endpoint,
          error
        );

        lastError = error;
      }
    }

    throw (
      lastError ||
      new Error(
        "All healthcare search services failed."
      )
    );
  };

  /* ----------------------------------------------------------------------
     MAP DATA
  ---------------------------------------------------------------------- */

  const fetchNearbyFacilities = async (
    latitude,
    longitude
  ) => {
    try {
      setLoadingFacilities(true);
      setFacilityError("");
      setHasSearched(false);

      /*
        First try 5 km.
        If nothing is found, automatically try 10 km.
      */

      let data =
        await fetchFacilitiesFromOverpass(
          latitude,
          longitude,
          5000
        );

      let elements =
        data?.elements || [];

      if (elements.length === 0) {
        data =
          await fetchFacilitiesFromOverpass(
            latitude,
            longitude,
            10000
          );

        elements =
          data?.elements || [];
      }

      const mapped = elements
        .map((element) => {
          const coordinates =
            getCoordinates(element);

          if (!coordinates) {
            return null;
          }

          const tags =
            element.tags || {};

          const distance =
            calculateDistance(
              latitude,
              longitude,
              coordinates.lat,
              coordinates.lon
            );

          return {
            id: `${element.type}-${element.id}`,

            name: getName(tags),

            type: getFacilityType(tags),

            specialty:
              getSpecialty(tags),

            address:
              getAddress(tags),

            phone:
              getPhone(tags),

            hours:
              tags.opening_hours ||
              "Hours not available",

            distance,

            distanceLabel:
              formatDistance(distance),

            /*
              OpenStreetMap does not reliably provide
              Google-style ratings/reviews.
            */
            rating: null,

            reviews: null,

            tags: [
              getFacilityType(tags),

              tags.healthcare ||
                tags.amenity ||
                null,

              tags.emergency === "yes"
                ? "Emergency"
                : null,
            ].filter(Boolean),

            lat: coordinates.lat,

            lon: coordinates.lon,

            website:
              tags.website ||
              tags["contact:website"] ||
              null,
          };
        })
        .filter(Boolean);

      const uniqueFacilities =
        Array.from(
          new Map(
            mapped.map((item) => [
              `${item.name}-${item.lat}-${item.lon}`,
              item,
            ])
          ).values()
        );

      uniqueFacilities.sort(
        (a, b) =>
          a.distance - b.distance
      );

      setFacilities(
        uniqueFacilities.slice(0, 50)
      );

      setHasSearched(true);

      if (uniqueFacilities.length === 0) {
        setLocationMessage(
          "No healthcare facilities were found nearby. Try searching another area."
        );
      } else {
        setLocationMessage(
          `Found ${uniqueFacilities.length} healthcare facilities nearby.`
        );
      }
    } catch (error) {
      console.error(
        "Healthcare search error:",
        error
      );

      setFacilities([]);
      setHasSearched(true);

      setFacilityError(
        "We found your location, but the public healthcare service is temporarily unavailable. Please try again."
      );
    } finally {
      setLoadingFacilities(false);
    }
  };

  /* ----------------------------------------------------------------------
     USE MY LOCATION
  ---------------------------------------------------------------------- */

  const handleLocation = () => {
    setLocationMessage("");
    setFacilityError("");

    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser. Please search for a city or area instead."
      );

      return;
    }

    setLoadingFacilities(true);

    setLocationMessage(
      "Requesting your location..."
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const location = [
          latitude,
          longitude,
        ];

        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(14);

        setLocationMessage(
          "Location found. Searching nearby healthcare facilities..."
        );

        await fetchNearbyFacilities(
          latitude,
          longitude
        );
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setLoadingFacilities(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationMessage(
            "Location permission was denied. Please allow location access in your browser and try again."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationMessage(
            "Your browser could not determine your location. Please try again or search for your city."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          setLocationMessage(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationMessage(
            "We could not determine your location. Please search for a city or area instead."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      }
    );
  };

  /* ----------------------------------------------------------------------
     SEARCH LOCATION
  ---------------------------------------------------------------------- */

  const handleSearch = async () => {
    const query =
      search.trim();

    if (!query) {
      setLocationMessage(
        "Enter a city, area, hospital or location to search."
      );

      return;
    }

    try {
      setSearchingLocation(true);
      setLocationMessage("");
      setFacilityError("");

      const url =
        `${NOMINATIM_URL}?format=jsonv2` +
        `&q=${encodeURIComponent(query)}` +
        `&limit=1`;

      const response =
        await fetch(url, {
          headers: {
            Accept:
              "application/json",
          },
        });

      if (!response.ok) {
        throw new Error(
          "Location search failed."
        );
      }

      const results =
        await response.json();

      if (!results.length) {
        setLocationMessage(
          "Location not found. Try a city, locality or landmark."
        );

        return;
      }

      const latitude =
        Number(results[0].lat);

      const longitude =
        Number(results[0].lon);

      const location = [
        latitude,
        longitude,
      ];

      setMapCenter(location);
      setMapZoom(14);
      setUserLocation(null);

      setLocationMessage(
        `Showing healthcare facilities near ${results[0].display_name}.`
      );

      await fetchNearbyFacilities(
        latitude,
        longitude
      );
    } catch (error) {
      console.error(
        "Location search error:",
        error
      );

      setLocationMessage(
        "Could not search this location. Please try again."
      );
    } finally {
      setSearchingLocation(false);
    }
  };

  /* ----------------------------------------------------------------------
     ENTER KEY SEARCH
  ---------------------------------------------------------------------- */

  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  /* ----------------------------------------------------------------------
     FILTER FACILITIES
  ---------------------------------------------------------------------- */

  const filteredFacilities =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return facilities.filter(
        (facility) => {
          const matchesSearch =
            !query ||
            facility.name
              .toLowerCase()
              .includes(query) ||
            facility.specialty
              .toLowerCase()
              .includes(query) ||
            facility.address
              .toLowerCase()
              .includes(query);

          const matchesType =
            activeType === "All" ||
            facility.type ===
              activeType;

          /*
            For Diabetes Care we intentionally keep
            hospitals/clinics/specialists visible because
            OSM specialty tagging can be incomplete.
          */
          const matchesSpecialty =
            !selectedSpecialty ||
            selectedSpecialty ===
              "Diabetes Care"
              ? true
              : facility.specialty
                  .toLowerCase()
                  .includes(
                    selectedSpecialty.toLowerCase()
                  );

          return (
            matchesSearch &&
            matchesType &&
            matchesSpecialty
          );
        }
      );
    }, [
      facilities,
      search,
      activeType,
      selectedSpecialty,
    ]);

  /* ----------------------------------------------------------------------
     SELECT SPECIALTY
  ---------------------------------------------------------------------- */

  const handleSpecialtySelect = (
    specialty
  ) => {
    setSelectedSpecialty(specialty);
    setShowFilters(true);

    const slug = specialty
      .toLowerCase()
      .replace(/\s+/g, "-");

    setSearchParams({
      specialty: slug,
    });
  };

  /* ----------------------------------------------------------------------
     CLEAR SPECIALTY
  ---------------------------------------------------------------------- */

  const clearSpecialty = () => {
    setSelectedSpecialty("");

    const nextParams =
      new URLSearchParams(
        searchParams
      );

    nextParams.delete(
      "specialty"
    );

    setSearchParams(nextParams);
  };

  /* ----------------------------------------------------------------------
     RENDER
  ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ================================================================
          HERO
      ================================================================= */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-20">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-2 text-sm font-medium text-cyan-300">

              <MapPin size={16} />

              Healthcare Finder

            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">

              Find healthcare

              <span className="block text-cyan-400">
                when you need it.
              </span>

            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Explore nearby healthcare facilities
              using a real-time map powered by
              OpenStreetMap data.
            </p>

          </div>

          {/* SEARCH */}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search city, area or healthcare facility..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50"
                />

              </div>

              <button
                type="button"
                onClick={
                  handleSearch
                }
                disabled={
                  searchingLocation ||
                  loadingFacilities
                }
                className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Search size={18} />

                {searchingLocation
                  ? "Searching..."
                  : "Search"}

              </button>

              <button
                type="button"
                onClick={
                  handleLocation
                }
                disabled={
                  loadingFacilities
                }
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Navigation size={18} />

                {loadingFacilities
                  ? "Finding..."
                  : "Use my location"}

              </button>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(
                    (prev) => !prev
                  )
                }
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >

                <Filter size={18} />

                Filters

              </button>

            </div>

            {locationMessage && (
              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-300">
                {locationMessage}
              </div>
            )}

            {showFilters && (
              <div className="mt-4 border-t border-white/10 pt-4">

                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Facility type
                </p>

                <div className="flex flex-wrap gap-2">

                  {[
                    "All",
                    "Hospital",
                    "Clinic",
                    "Specialist",
                    "Diagnostics",
                    "Healthcare",
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setActiveType(
                          type
                        )
                      }
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        activeType ===
                        type
                          ? "bg-cyan-400 text-slate-950"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {type}
                    </button>
                  ))}

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* ================================================================
          AI CARE NAVIGATOR
      ================================================================= */}

      {selectedSpecialty ===
        "Diabetes Care" && (
        <section className="border-b border-cyan-400/20 bg-cyan-400/[0.04]">

          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 sm:p-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">

                    <Stethoscope
                      size={23}
                    />

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-[0.18em] text-cyan-400">
                      AI Care Navigator
                    </p>

                    <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                      Suggested specialty
                    </h2>

                    <p className="mt-1 font-medium text-white">
                      Endocrinology /
                      Diabetes Care
                    </p>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                      Your diabetes screening
                      result can help identify
                      an appropriate area of
                      healthcare to discuss.
                      This does not determine
                      that you require a specific
                      doctor.
                    </p>

                  </div>

                </div>

                <div className="flex shrink-0 flex-wrap gap-3">

                  <Link
                    to="/health-ai"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    View AI Result
                  </Link>

                  <Link
                    to="/assistant?topic=visit-prep"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Prepare for Visit
                    <ArrowRight
                      size={16}
                    />
                  </Link>

                </div>

              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                {[
                  "Discuss glucose or HbA1c testing",
                  "Ask about blood sugar monitoring",
                  "Discuss lifestyle factors",
                  "Review whether additional screening is appropriate",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400"
                    />

                    {item}
                  </div>
                ))}

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ================================================================
          MAIN WORKSPACE
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          {/* RESULTS */}

          <div>

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>

                <p className="text-sm font-medium text-cyan-400">
                  NEARBY HEALTHCARE
                </p>

                <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                  Healthcare options
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {loadingFacilities
                    ? "Searching nearby facilities..."
                    : `${filteredFacilities.length} facilities found`}
                </p>

              </div>

              {selectedSpecialty && (
                <button
                  type="button"
                  onClick={
                    clearSpecialty
                  }
                  className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                >
                  {selectedSpecialty}
                  <X size={14} />
                </button>
              )}

            </div>

            {facilityError && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                {facilityError}
              </div>
            )}

            {!hasSearched &&
              !loadingFacilities && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">

                  <MapPin
                    size={38}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 text-lg font-semibold">
                    Find nearby healthcare
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Click "Use my location"
                    to find healthcare
                    facilities near you, or
                    search for a city or area.
                  </p>

                </div>
              )}

            {loadingFacilities && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">

                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />

                <p className="mt-4 text-sm text-slate-400">
                  Finding nearby healthcare
                  facilities...
                </p>

              </div>
            )}

            {!loadingFacilities &&
              filteredFacilities.length >
                0 && (
                <div className="space-y-4">

                  {filteredFacilities.map(
                    (facility) => (
                      <FacilityCard
                        key={
                          facility.id
                        }
                        facility={
                          facility
                        }
                      />
                    )
                  )}

                </div>
              )}

            {!loadingFacilities &&
              hasSearched &&
              filteredFacilities.length ===
                0 && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center">

                  <Hospital
                    size={36}
                    className="mx-auto text-slate-600"
                  />

                  <h3 className="mt-4 text-lg font-semibold">
                    No matching facilities
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Try another location,
                    search term or facility
                    filter.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveType("All");
                    }}
                    className="mt-5 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                  >
                    Clear filters
                  </button>

                </div>
              )}

          </div>

          {/* REAL MAP */}

          <div className="lg:sticky lg:top-28 lg:self-start">

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                <div>

                  <p className="text-sm font-semibold text-white">
                    Healthcare map
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    OpenStreetMap • Live facility
                    data
                  </p>

                </div>

                <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-400">
                  <MapPin size={18} />
                </div>

              </div>

              <div className="h-[560px] overflow-hidden">

                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapController
                    center={mapCenter}
                    zoom={mapZoom}
                  />

                  {userLocation && (
                    <Marker
                      position={
                        userLocation
                      }
                    >
                      <Popup>

                        <div className="text-sm">

                          <strong>
                            Your location
                          </strong>

                          <br />

                          Nearby healthcare
                          facilities are shown
                          around this area.

                        </div>

                      </Popup>
                    </Marker>
                  )}

                  {facilities.map(
                    (facility) => (
                      <Marker
                        key={
                          facility.id
                        }
                        position={[
                          facility.lat,
                          facility.lon,
                        ]}
                      >

                        <Popup>

                          <div className="min-w-[230px]">

                            <h3 className="font-semibold">
                              {facility.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-600">
                              {facility.type}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {facility.specialty}
                            </p>

                            <p className="mt-2 text-xs text-gray-600">
                              {facility.address}
                            </p>

                            <p className="mt-2 text-xs font-medium">
                              {facility.distanceLabel}{" "}
                              away
                            </p>

                            <a
                              href={buildGoogleMapsUrl(
                                facility.lat,
                                facility.lon
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-block rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-white"
                            >
                              Open in Google Maps
                            </a>

                          </div>

                        </Popup>

                      </Marker>
                    )
                  )}

                </MapContainer>

              </div>

              <div className="border-t border-white/10 bg-slate-950/80 px-5 py-4">

                <div className="flex items-start gap-3">

                  <div className="rounded-xl bg-cyan-400/10 p-2 text-cyan-400">
                    <Navigation
                      size={17}
                    />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Location-aware discovery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Allow browser location
                      access to search
                      healthcare facilities
                      around your current
                      position. You can also
                      search for another city
                      or area.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================================
          SPECIALTIES
      ================================================================= */}

      <section className="border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-cyan-400">
              EXPLORE CARE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Find care by specialty
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Narrow healthcare discovery
              based on the type of support
              you want to explore.
            </p>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {specialties.map(
              (specialty) => {
                const Icon =
                  specialty.icon;

                return (
                  <button
                    key={
                      specialty.name
                    }
                    type="button"
                    onClick={() =>
                      handleSpecialtySelect(
                        specialty.name
                      )
                    }
                    className={`group rounded-2xl border p-5 text-left transition ${
                      selectedSpecialty ===
                      specialty.name
                        ? "border-cyan-400/30 bg-cyan-400/10"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-400/20 hover:bg-white/[0.05]"
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <Icon size={20} />
                      </div>

                      <ArrowRight
                        size={18}
                        className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400"
                      />

                    </div>

                    <h3 className="mt-5 font-semibold">
                      {specialty.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Find nearby healthcare
                      facilities related to
                      this specialty.
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* ================================================================
          HOW IT WORKS
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

        <div className="text-center">

          <p className="text-sm font-medium text-cyan-400">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Finding care made simpler
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            MediSense connects your health
            insight with location-aware
            healthcare discovery without
            pretending to replace a healthcare
            professional.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <StepCard
            number="01"
            icon={Search}
            title="Choose a location"
            text="Use your current location or search for a city, locality or area."
          />

          <StepCard
            number="02"
            icon={Filter}
            title="Refine your options"
            text="Use facility types and healthcare specialties to narrow your results."
          />

          <StepCard
            number="03"
            icon={Hospital}
            title="Explore nearby facilities"
            text="View real OpenStreetMap healthcare locations and open them in Google Maps for navigation."
          />

        </div>

      </section>

      {/* ================================================================
          CTA
      ================================================================= */}

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">

        <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-blue-500/10 p-8 sm:p-10 lg:p-14">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                <HeartPulse size={22} />
              </div>

              <h2 className="mt-6 max-w-2xl text-3xl font-bold sm:text-4xl">
                Turn your health insight
                into a prepared
                conversation.
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Review your diabetes
                screening, explore the
                suggested area of care, find
                nearby healthcare facilities,
                and prepare questions before
                speaking with a qualified
                healthcare professional.
              </p>

            </div>

            <Link
              to="/assistant?topic=visit-prep"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Prepare for Visit
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>

      {/* ================================================================
          DISCLAIMER
      ================================================================= */}

      <section className="border-t border-white/10">

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

          <div className="flex gap-4 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-5">

            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-amber-400"
            />

            <div>

              <h3 className="text-sm font-semibold text-amber-300">
                Healthcare information notice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Healthcare facility information
                is retrieved from OpenStreetMap
                data and may be incomplete or
                outdated. Facility availability,
                operating hours, services,
                contact information and provider
                details should be verified
                directly with the healthcare
                provider.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

/* --------------------------------------------------------------------------
   FACILITY CARD
-------------------------------------------------------------------------- */

function FacilityCard({ facility }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.045] sm:p-6">

      <div className="flex flex-col gap-5 sm:flex-row">

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">

          <Hospital size={25} />

        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-col justify-between gap-2 sm:flex-row">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="font-semibold text-white">
                  {facility.name}
                </h3>

                <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                  {facility.type}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                {facility.specialty}
              </p>

            </div>

            {facility.rating && (
              <div className="flex items-center gap-1 text-sm">

                <Star
                  size={15}
                  className="fill-current text-amber-400"
                />

                <span className="font-semibold">
                  {facility.rating}
                </span>

                {facility.reviews && (
                  <span className="text-slate-600">
                    ({facility.reviews})
                  </span>
                )}

              </div>
            )}

          </div>

          <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">

            <div className="flex items-start gap-2">

              <MapPin
                size={14}
                className="mt-0.5 shrink-0"
              />

              <span>
                {facility.address}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <Navigation size={14} />

              {facility.distanceLabel}
              {" "}away

            </div>

            <div className="flex items-start gap-2">

              <Clock3
                size={14}
                className="mt-0.5 shrink-0"
              />

              <span>
                {facility.hours}
              </span>

            </div>

            <div className="flex items-start gap-2">

              <Phone
                size={14}
                className="mt-0.5 shrink-0"
              />

              <span>
                {facility.phone}
              </span>

            </div>

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            {facility.tags.map(
              (tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-slate-400"
                >
                  {tag}
                </span>
              )
            )}

          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <a
              href={buildGoogleMapsUrl(
                facility.lat,
                facility.lon
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <Navigation size={14} />
              Open in Google Maps
            </a>

            {facility.website && (
              <a
                href={facility.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Visit website
              </a>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

/* --------------------------------------------------------------------------
   STEP CARD
-------------------------------------------------------------------------- */

function StepCard({
  number,
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">

          <Icon size={21} />

        </div>

        <span className="text-sm font-semibold text-slate-700">
          {number}
        </span>

      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}

export default Hospitals;