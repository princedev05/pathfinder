import axios from "axios";

// Fallback seeded data if backend is offline
const FALLBACK_CITIES = [
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    country: "India",
    center: { lat: 24.5854, lng: 73.7125 },
    zoom: 13,
    description: "The City of Lakes — famous for lavish royal palaces, serene lakes, and marble heritage.",
    places: [
      {
        id: "city-palace-udaipur",
        name: "City Palace Udaipur",
        lat: 24.5764,
        lng: 73.6835,
        category: "Royal Heritage",
        suggestedVisitMinutes: 120,
        description: "Monumental palace complex built over 400 years overlooking Lake Pichola.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "lake-pichola",
        name: "Lake Pichola & Jagmandir",
        lat: 24.5695,
        lng: 73.6791,
        category: "Scenic Lake",
        suggestedVisitMinutes: 75,
        description: "Picturesque artificial freshwater lake featuring island palaces and boat cruises.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "saheliyon-ki-bari",
        name: "Saheliyon Ki Bari",
        lat: 24.6009,
        lng: 73.6853,
        category: "Garden & Fountains",
        suggestedVisitMinutes: 45,
        description: "Historic courtyard garden built for royal ladies featuring marble fountains and lotus pools.",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "fateh-sagar-lake",
        name: "Fateh Sagar Lake",
        lat: 24.6041,
        lng: 73.6731,
        category: "Scenic Lake",
        suggestedVisitMinutes: 60,
        description: "Tranquil lake encircled by hills, featuring Nehru Park island and sunset promenades.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "monsoon-palace",
        name: "Sajjangarh Monsoon Palace",
        lat: 24.5896,
        lng: 73.6334,
        category: "Viewpoint & Fort",
        suggestedVisitMinutes: 60,
        description: "Hilltop palatial residence offering breathtaking sunset views over Udaipur's lakes.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "bagore-ki-haveli",
        name: "Bagore Ki Haveli",
        lat: 24.5795,
        lng: 73.6816,
        category: "Culture & Folk Dance",
        suggestedVisitMinutes: 60,
        description: "18th-century haveli at Gangaur Ghat hosting famous evening Rajasthani Dharohar folk dances.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jagdish-temple",
        name: "Jagdish Temple",
        lat: 24.5791,
        lng: 73.6839,
        category: "Temple & Sacred",
        suggestedVisitMinutes: 45,
        description: "Large Indo-Aryan temple dedicated to Lord Vishnu with intricate stone carvings.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    country: "India",
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
    description: "India's capital territory blending ancient Mughal heritage and vibrant modern metropolis.",
    places: [
      {
        id: "red-fort",
        name: "Red Fort (Lal Qila)",
        lat: 28.6562,
        lng: 77.2410,
        category: "Historic Fort",
        suggestedVisitMinutes: 90,
        description: "Massive 17th-century Mughal red sandstone fortress and UNESCO World Heritage site.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "qutub-minar",
        name: "Qutub Minar",
        lat: 28.5244,
        lng: 77.1855,
        category: "Historic Site",
        suggestedVisitMinutes: 75,
        description: "73-meter tall red sandstone victory tower built in 1193, surrounded by ancient ruins.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "india-gate",
        name: "India Gate & Kartavya Path",
        lat: 28.6129,
        lng: 77.2295,
        category: "National Monument",
        suggestedVisitMinutes: 45,
        description: "Triumphant archway war memorial surrounded by lush lawns and evening lightings.",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
];

export async function fetchCities() {
  try {
    const res = await axios.get("/api/cities");
    if (res.data && res.data.cities) {
      return res.data.cities;
    }
  } catch (err) {
    console.warn("Backend API not reached directly, using fallback cities data.", err.message);
  }
  return FALLBACK_CITIES;
}

export async function optimizeRouteApi(payload) {
  try {
    const res = await axios.post("/api/optimize", payload);
    return res.data;
  } catch (err) {
    console.warn("Backend API optimize error, executing client-side fallback solver.", err.message);
    return fallbackOptimizeClient(payload);
  }
}

export async function fetchRouteGeometryApi(payload) {
  try {
    const res = await axios.post("/api/route-geometry", payload);
    return res.data.geometry;
  } catch (err) {
    console.warn("Backend API geometry error, using straight line fallback.", err.message);
    if (payload.places) {
      return {
        type: "LineString",
        coordinates: payload.places.map((p) => [p.lng, p.lat])
      };
    }
    return null;
  }
}

export async function saveTripApi(payload) {
  try {
    const res = await axios.post("/api/trips", payload);
    return res.data;
  } catch (err) {
    console.warn("Save trip error:", err.message);
    throw err;
  }
}

export async function fetchSavedTripApi(tripId) {
  try {
    const res = await axios.get(`/api/trips/${tripId}`);
    return res.data.trip;
  } catch (err) {
    console.warn("Fetch saved trip error:", err.message);
    return null;
  }
}

export async function seedCitiesApi() {
  try {
    const res = await axios.post("/api/cities/seed");
    return res.data;
  } catch (err) {
    console.warn("Seed cities error:", err.message);
    throw err;
  }
}
