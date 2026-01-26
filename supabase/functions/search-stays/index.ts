import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StaysSearchRequest {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

// Mock stays data as fallback
const mockStays = [
  {
    id: "stay-1",
    name: "The Table Bay Hotel",
    location: "Cape Town, South Africa",
    price: 3500,
    currency: "ZAR",
    rating: 4.8,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    amenities: ["Pool", "Spa", "Restaurant", "Ocean View"],
    type: "5-Star Hotel",
  },
  {
    id: "stay-2",
    name: "Singita Kruger National Park",
    location: "Kruger National Park, South Africa",
    price: 15000,
    currency: "ZAR",
    rating: 4.9,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400",
    amenities: ["Safari", "Pool", "Fine Dining", "Spa"],
    type: "Luxury Safari Lodge",
  },
  {
    id: "stay-3",
    name: "One&Only Cape Town",
    location: "V&A Waterfront, Cape Town",
    price: 8500,
    currency: "ZAR",
    rating: 4.9,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
    amenities: ["Pool", "Spa", "Private Island", "Restaurant"],
    type: "5-Star Resort",
  },
  {
    id: "stay-4",
    name: "Camps Bay Retreat",
    location: "Camps Bay, Cape Town",
    price: 4200,
    currency: "ZAR",
    rating: 4.7,
    reviews: 654,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    amenities: ["Pool", "Mountain Views", "Breakfast", "Garden"],
    type: "Boutique Hotel",
  },
  {
    id: "stay-5",
    name: "Saxon Hotel Johannesburg",
    location: "Johannesburg, South Africa",
    price: 6800,
    currency: "ZAR",
    rating: 4.8,
    reviews: 1123,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    amenities: ["Pool", "Spa", "Fine Dining", "Gardens"],
    type: "5-Star Boutique",
  },
];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const KIWI_API_KEY = Deno.env.get("KIWI_API_KEY");
    const data: StaysSearchRequest = await req.json();
    
    console.log("Searching stays with params:", data);

    // Try Kiwi API first if key is available
    if (KIWI_API_KEY) {
      try {
        // Kiwi uses the locations API to get location IDs first
        const locationParams = new URLSearchParams({
          term: data.location,
          location_types: "city,airport",
          limit: "1",
        });

        const locationResponse = await fetch(
          `https://api.tequila.kiwi.com/locations/query?${locationParams.toString()}`,
          {
            headers: {
              "apikey": KIWI_API_KEY,
            },
          }
        );

        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          const locationId = locationData.locations?.[0]?.id;

          if (locationId) {
            // Search for hotels using the location
            const staysParams = new URLSearchParams({
              location_id: locationId,
              checkin: data.checkIn,
              checkout: data.checkOut,
              adults: String(data.guests),
              limit: "30",
              sort: "price",
              order: "asc",
            });

            const staysResponse = await fetch(
              `https://api.tequila.kiwi.com/stays/search?${staysParams.toString()}`,
              {
                headers: {
                  "apikey": KIWI_API_KEY,
                },
              }
            );

            if (staysResponse.ok) {
              const staysData = await staysResponse.json();
              
              if (staysData.results && staysData.results.length > 0) {
                const stays = staysData.results.map((stay: any) => ({
                  id: stay.id,
                  name: stay.name,
                  location: stay.address || data.location,
                  price: stay.price?.amount || 0,
                  currency: stay.price?.currency || "ZAR",
                  rating: stay.rating || 4.0,
                  reviews: stay.reviews_count || 0,
                  image: stay.photos?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
                  amenities: stay.amenities?.slice(0, 4) || [],
                  type: stay.property_type || "Hotel",
                  deepLink: stay.deep_link,
                }));

                return new Response(
                  JSON.stringify({ success: true, stays, source: "kiwi" }),
                  { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
                );
              }
            }
          }
        }
      } catch (apiError) {
        console.error("Kiwi API error, falling back to mock data:", apiError);
      }
    }

    // Fallback to mock data
    console.log("Using mock stays data");
    const filteredStays = mockStays.filter(stay => 
      stay.location.toLowerCase().includes(data.location.toLowerCase()) ||
      stay.name.toLowerCase().includes(data.location.toLowerCase())
    );

    const results = filteredStays.length > 0 ? filteredStays : mockStays;

    return new Response(
      JSON.stringify({ 
        success: true, 
        stays: results.slice(0, 30),
        source: "mock" 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in search-stays function:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
