import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  bookingReference: string;
  destination: string;
  travelDate: string;
  numberOfTravelers: number;
  bookingType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      customerName,
      customerEmail,
      bookingReference,
      destination,
      travelDate,
      numberOfTravelers,
      bookingType,
    }: BookingEmailRequest = await req.json();

    console.log("Sending confirmation email to:", customerEmail);

    const emailResponse = await resend.emails.send({
      from: "Touring Places <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Booking Confirmation - ${bookingReference}`,
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
              <p>Dear ${customerName},</p>
              <p>Thank you for booking with Touring Places! Your ${bookingType} reservation has been confirmed.</p>
              
              <div class="reference">
                <strong>Booking Reference:</strong><br>
                ${bookingReference}
              </div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Destination</span>
                  <span class="detail-value">${destination}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Travel Date</span>
                  <span class="detail-value">${travelDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Travelers</span>
                  <span class="detail-value">${numberOfTravelers}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booking Type</span>
                  <span class="detail-value">${bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}</span>
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

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
