import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FlightSearchRequest {
  flyFrom: string;
  flyTo: string;
  dateFrom: string;
  dateTo?: string;
  adults: number;
  children?: number;
  infants?: number;
  returnFrom?: string;
  returnTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FlightSearchRequest = await req.json();
    
    // Try RateHawk/ETG API first
    const RATEHAWK_KEY_ID = Deno.env.get("RATEHAWK_KEY_ID");
    const RATEHAWK_API_KEY = Deno.env.get("RATEHAWK_API_KEY");
    
    if (RATEHAWK_KEY_ID && RATEHAWK_API_KEY) {
      try {
        console.log("Searching flights via RateHawk/ETG API");
        
        const authHeader = btoa(`${RATEHAWK_KEY_ID}:${RATEHAWK_API_KEY}`);
        
        // ETG doesn't have a direct flights API - it's primarily hotels
        // Fall through to Kiwi for flights
        console.log("RateHawk is hotel-focused, falling back to Kiwi for flights");
      } catch (apiError) {
        console.error("RateHawk API error:", apiError);
      }
    }

    // Use Kiwi API for flights
    const KIWI_API_KEY = Deno.env.get("KIWI_API_KEY");
    if (!KIWI_API_KEY) {
      throw new Error("No flight search API is configured. Please add KIWI_API_KEY.");
    }

    const params = new URLSearchParams({
      fly_from: data.flyFrom,
      fly_to: data.flyTo,
      date_from: data.dateFrom,
      date_to: data.dateTo || data.dateFrom,
      adults: String(data.adults || 1),
      children: String(data.children || 0),
      infants_in_lap: String(data.infants || 0),
      partner: "touringplacestpsa",
      curr: "ZAR",
      locale: "en",
      limit: "30",
      max_stopovers: "1",
      sort: "price",
      asc: "1",
    });

    if (data.returnFrom) params.set("return_from", data.returnFrom);
    if (data.returnTo) params.set("return_to", data.returnTo);

    console.log("Searching flights with Kiwi params:", Object.fromEntries(params));

    const response = await fetch(
      `https://api.tequila.kiwi.com/v2/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "apikey": KIWI_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kiwi API error:", response.status, errorText);
      if (response.status === 403) {
        throw new Error("Flight search API access denied. Please contact support.");
      }
      throw new Error(`Flight search failed: ${response.status}`);
    }

    const flightData = await response.json();

    const flights = flightData.data?.map((flight: any) => ({
      id: flight.id,
      flyFrom: flight.flyFrom,
      flyTo: flight.flyTo,
      cityFrom: flight.cityFrom,
      cityTo: flight.cityTo,
      countryFrom: flight.countryFrom?.name,
      countryTo: flight.countryTo?.name,
      price: flight.price,
      currency: flightData.currency || "ZAR",
      duration: {
        total: flight.duration?.total,
        departure: flight.duration?.departure,
        return: flight.duration?.return,
      },
      departureTime: flight.dTime,
      arrivalTime: flight.aTime,
      airlines: flight.airlines,
      route: flight.route?.map((r: any) => ({
        flyFrom: r.flyFrom,
        flyTo: r.flyTo,
        cityFrom: r.cityFrom,
        cityTo: r.cityTo,
        departureTime: r.dTime,
        arrivalTime: r.aTime,
        airline: r.airline,
        flightNo: r.flight_no,
      })),
      stops: flight.route?.length > 1 ? flight.route.length - 1 : 0,
      deepLink: flight.deep_link,
      bagsPrice: flight.bags_price,
      availability: flight.availability?.seats,
    })) || [];

    console.log(`Found ${flights.length} flights`);

    return new Response(
      JSON.stringify({ success: true, currency: flightData.currency || "ZAR", flights, searchId: flightData.search_id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in search-flights function:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
