import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const GoogleMapSection = () => {
  return (
    <section id="find-us" className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-12 animate-fade-up">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Visit Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            How to Find Us
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Our office is conveniently located in Century City, Cape Town. Come visit us or reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Address</h3>
                  <p className="text-muted-foreground font-body">
                    10 Elephant Lane<br />
                    Century City<br />
                    Cape Town, 7441<br />
                    South Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Phone</h3>
                  <a 
                    href="tel:+27732373200" 
                    className="text-muted-foreground font-body hover:text-primary transition-colors"
                  >
                    +27 73 237 3200
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Email</h3>
                  <a 
                    href="mailto:sales@touringplaces.co.za" 
                    className="text-muted-foreground font-body hover:text-primary transition-colors"
                  >
                    sales@touringplaces.co.za
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-1">Business Hours</h3>
                  <p className="text-muted-foreground font-body">
                    Mon - Fri: 8:00 AM - 6:00 PM<br />
                    Sat: 9:00 AM - 2:00 PM<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-medium h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3310.8957091792866!2d18.52106!3d-33.88907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc5d0c3e2c5f51%3A0x0!2sElephant%20Lane%2C%20Century%20City%2C%20Cape%20Town%2C%207441!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Touring Places Location - 10 Elephant Lane, Century City, Cape Town"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
