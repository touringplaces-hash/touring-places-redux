import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEnquiryRequest {
  surname: string;
  firstNames: string;
  countryOfResidence: string;
  emailAddress: string;
  enquiryType: string;
  travelDate: string;
  duration: string;
  numberOfPersons: number;
  otherInformation: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactEnquiryRequest = await req.json();

    // Send notification to sales team
    const salesEmail = await resend.emails.send({
      from: "Touring Places <onboarding@resend.dev>",
      to: ["sales@touringplaces.co.za"],
      subject: `New ${data.enquiryType} Enquiry from ${data.firstNames} ${data.surname}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #D4A853; padding: 20px; text-align: center;">
            <h1 style="color: #1a1a1a; margin: 0;">New Enquiry Received</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; border-bottom: 2px solid #D4A853; padding-bottom: 10px;">
              ${data.enquiryType} Enquiry
            </h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.firstNames} ${data.surname}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Country:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.countryOfResidence}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">
                  <a href="mailto:${data.emailAddress}" style="color: #D4A853;">${data.emailAddress}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Travel Date:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.travelDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Duration:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.duration}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Number of Persons:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #ddd;">${data.numberOfPersons}</td>
              </tr>
            </table>

            ${data.otherInformation !== "None" ? `
              <h3 style="color: #333; margin-top: 20px;">Additional Information:</h3>
              <p style="background: #fff; padding: 15px; border-radius: 5px; border-left: 3px solid #D4A853;">
                ${data.otherInformation}
              </p>
            ` : ""}
          </div>
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #fff; margin: 0; font-size: 14px;">
              Touring Places | 10 Elephant Lane, Century City, Cape Town
            </p>
          </div>
        </div>
      `,
    });

    // Send confirmation to customer
    const customerEmail = await resend.emails.send({
      from: "Touring Places <onboarding@resend.dev>",
      to: [data.emailAddress],
      subject: "Thank you for your enquiry - Touring Places",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #D4A853; padding: 20px; text-align: center;">
            <h1 style="color: #1a1a1a; margin: 0;">Thank You!</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Dear ${data.firstNames},</p>
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Thank you for your ${data.enquiryType.toLowerCase()} enquiry. We have received your request and 
              our team will get back to you within 24-48 hours.
            </p>
            
            <h3 style="color: #333; border-bottom: 2px solid #D4A853; padding-bottom: 10px;">Your Enquiry Details:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li><strong>Enquiry Type:</strong> ${data.enquiryType}</li>
              <li><strong>Travel Date:</strong> ${data.travelDate}</li>
              <li><strong>Duration:</strong> ${data.duration}</li>
              <li><strong>Number of Persons:</strong> ${data.numberOfPersons}</li>
            </ul>

            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              If you have any urgent questions, please don't hesitate to call us at 
              <a href="tel:+27732373200" style="color: #D4A853;">+27 73 237 3200</a>.
            </p>

            <p style="font-size: 16px; color: #333;">
              Best regards,<br>
              <strong>The Touring Places Team</strong>
            </p>
          </div>
          <div style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #fff; margin: 0; font-size: 14px;">
              Touring Places | Travel with Us
            </p>
            <p style="color: #aaa; margin: 5px 0 0 0; font-size: 12px;">
              10 Elephant Lane, Century City, Cape Town, South Africa
            </p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { salesEmail, customerEmail });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact-enquiry function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
