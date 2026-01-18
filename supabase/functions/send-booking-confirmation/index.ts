import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Get allowed origins from environment or use defaults
const ALLOWED_ORIGINS = [
  "https://touring-clone-charm.lovable.app",
  "https://id-preview--d307ba27-69c1-4b14-86de-caf76f9027c9.lovable.app",
];

const getCorsHeaders = (origin: string | null) => {
  // Check if origin is allowed
  const allowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.lovable.app')
  ) ? origin : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
};

// Input validation schema
interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  destination: string;
  travelDate: string;
  numberOfTravelers: number;
  bookingType: string;
}

// Validate input data
function validateInput(data: unknown): { valid: true; data: BookingEmailRequest } | { valid: false; error: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const input = data as Record<string, unknown>;

  // Validate customerName
  if (typeof input.customerName !== 'string' || input.customerName.length < 2 || input.customerName.length > 100) {
    return { valid: false, error: "Invalid customer name" };
  }

  // Validate customerEmail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof input.customerEmail !== 'string' || !emailRegex.test(input.customerEmail) || input.customerEmail.length > 255) {
    return { valid: false, error: "Invalid email address" };
  }

  // Validate bookingReference - must match pattern TP-xxxxxxxx
  const refRegex = /^TP-[a-f0-9]{8}$/;
  if (typeof input.bookingReference !== 'string' || !refRegex.test(input.bookingReference)) {
    return { valid: false, error: "Invalid booking reference" };
  }

  // Validate destination
  if (typeof input.destination !== 'string' || input.destination.length < 2 || input.destination.length > 200) {
    return { valid: false, error: "Invalid destination" };
  }

  // Validate travelDate
  if (typeof input.travelDate !== 'string' || input.travelDate.length < 5 || input.travelDate.length > 50) {
    return { valid: false, error: "Invalid travel date" };
  }

  // Validate numberOfTravelers
  if (typeof input.numberOfTravelers !== 'number' || input.numberOfTravelers < 1 || input.numberOfTravelers > 50) {
    return { valid: false, error: "Invalid number of travelers" };
  }

  // Validate bookingType
  if (typeof input.bookingType !== 'string' || !['tour', 'shuttle'].includes(input.bookingType)) {
    return { valid: false, error: "Invalid booking type" };
  }

  return {
    valid: true,
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      bookingReference: input.bookingReference,
      destination: input.destination,
      travelDate: input.travelDate,
      numberOfTravelers: input.numberOfTravelers,
      bookingType: input.bookingType,
    }
  };
}

// Sanitize string for HTML output to prevent XSS
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("Origin");
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Parse and validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      console.error("Validation error:", validation.error);
      return new Response(
        JSON.stringify({ success: false, error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const {
      customerName,
      customerEmail,
      bookingReference,
      destination,
      travelDate,
      numberOfTravelers,
      bookingType,
    } = validation.data;

    // Verify the booking exists in the database using service role for server-side validation
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify booking exists with matching reference and email
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, booking_reference, customer_email")
      .eq("booking_reference", bookingReference)
      .eq("customer_email", customerEmail.toLowerCase())
      .maybeSingle();

    if (bookingError) {
      console.error("Database error:", bookingError);
      return new Response(
        JSON.stringify({ success: false, error: "Unable to verify booking" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!booking) {
      console.error("Booking not found:", bookingReference, customerEmail);
      return new Response(
        JSON.stringify({ success: false, error: "Booking not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending confirmation email for booking:", bookingReference);

    // Sanitize all user input before including in HTML
    const safeCustomerName = sanitizeHtml(customerName);
    const safeDestination = sanitizeHtml(destination);
    const safeTravelDate = sanitizeHtml(travelDate);
    const safeBookingReference = sanitizeHtml(bookingReference);
    const safeBookingType = sanitizeHtml(bookingType.charAt(0).toUpperCase() + bookingType.slice(1));

    const emailResponse = await resend.emails.send({
      from: "Touring Places <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Booking Confirmation - ${safeBookingReference}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Georgia', serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #C9A962 0%, #B8963F 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; }
            .content { padding: 30px; background: #f9f9f9; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: bold; color: #333; }
            .reference { font-size: 24px; color: #C9A962; text-align: center; padding: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${safeCustomerName},</p>
              <p>Thank you for booking with Touring Places! Your ${safeBookingType.toLowerCase()} reservation has been confirmed.</p>
              
              <div class="reference">
                <strong>Booking Reference:</strong><br>
                ${safeBookingReference}
              </div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Destination</span>
                  <span class="detail-value">${safeDestination}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Travel Date</span>
                  <span class="detail-value">${safeTravelDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Travelers</span>
                  <span class="detail-value">${numberOfTravelers}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking Type</span>
                  <span class="detail-value">${safeBookingType}</span>
                </div>
              </div>
              
              <p>Please keep this reference number safe. You'll need it for any inquiries about your booking.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br><strong>The Touring Places Team</strong></p>
            </div>
            <div class="footer">
              <p>Touring Places | Your African Adventure Awaits</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully for booking:", bookingReference);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending confirmation email:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
