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

    // Validate required fields
    if (!data.flyFrom || !data.flyTo || !data.dateFrom) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: flyFrom, flyTo, dateFrom", success: false }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const KIWI_API_KEY = Deno.env.get("KIWI_API_KEY");
    if (!KIWI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Flight search is not configured. Please contact support.", success: false }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
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
        return new Response(
          JSON.stringify({ error: "Flight search API access denied. Please contact support.", success: false }),
          { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment.", success: false }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ error: `Flight search temporarily unavailable (${response.status}). Please try again.`, success: false }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const flightData = await response.json();

    // Log a sample raw flight to debug field names
    if (flightData.data?.length > 0) {
      const sample = flightData.data[0];
      console.log("Sample flight keys:", Object.keys(sample));
      console.log("Sample dTime:", sample.dTime, "aTime:", sample.aTime, "local_departure:", sample.local_departure, "local_arrival:", sample.local_arrival);
    }

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
        total: flight.duration?.total || 0,
        departure: flight.duration?.departure || 0,
        return: flight.duration?.return || 0,
      },
      // Kiwi returns dTime/aTime as unix timestamps, also local_departure/local_arrival as ISO strings
      departureTime: flight.dTime || flight.dTimeUTC || null,
      arrivalTime: flight.aTime || flight.aTimeUTC || null,
      localDeparture: flight.local_departure || null,
      localArrival: flight.local_arrival || null,
      airlines: flight.airlines || [],
      route: flight.route?.map((r: any) => ({
        flyFrom: r.flyFrom,
        flyTo: r.flyTo,
        cityFrom: r.cityFrom,
        cityTo: r.cityTo,
        departureTime: r.dTime || r.dTimeUTC || null,
        arrivalTime: r.aTime || r.aTimeUTC || null,
        localDeparture: r.local_departure || null,
        localArrival: r.local_arrival || null,
        airline: r.airline,
        flightNo: r.flight_no,
      })) || [],
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
      JSON.stringify({ error: error.message || "An unexpected error occurred", success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
