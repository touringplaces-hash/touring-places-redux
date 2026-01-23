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
    const KIWI_API_KEY = Deno.env.get("KIWI_API_KEY");
    if (!KIWI_API_KEY) {
      throw new Error("KIWI_API_KEY is not configured");
    }

    const data: FlightSearchRequest = await req.json();
    
    // Build Kiwi.com Tequila API URL
    const params = new URLSearchParams({
      fly_from: data.flyFrom,
      fly_to: data.flyTo,
      date_from: data.dateFrom,
      date_to: data.dateTo || data.dateFrom,
      adults: String(data.adults || 1),
      children: String(data.children || 0),
      infants_in_lap: String(data.infants || 0),
      partner: "touringplacesf2",
      curr: "ZAR",
      locale: "en",
      limit: "30", // Limit to 30 results as requested
      max_stopovers: "1", // Maximum 1 stop as requested
      sort: "price", // Sort by price (cheapest first)
      asc: "1",
    });

    // Add return dates if provided
    if (data.returnFrom) {
      params.set("return_from", data.returnFrom);
    }
    if (data.returnTo) {
      params.set("return_to", data.returnTo);
    }

    console.log("Searching flights with params:", Object.fromEntries(params));

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
        throw new Error("Flight search API access denied. Please contact support to verify your API key and partner credentials with Kiwi.com.");
      }
      
      throw new Error(`Flight search failed: ${response.status}`);
    }

    const flightData = await response.json();

    // Transform the response for our frontend
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
      departureTimeUtc: flight.dTimeUTC,
      arrivalTimeUtc: flight.aTimeUTC,
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
        operatingCarrier: r.operating_carrier,
      })),
      stops: flight.route?.length > 1 ? flight.route.length - 1 : 0,
      deepLink: flight.deep_link,
      bagsPrice: flight.bags_price,
      availability: flight.availability?.seats,
      quality: flight.quality,
    })) || [];

    console.log(`Found ${flights.length} flights`);

    return new Response(
      JSON.stringify({
        success: true,
        currency: flightData.currency || "ZAR",
        flights,
        searchId: flightData.search_id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in search-flights function:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
