import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqs = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          question: "How do I book a tour with Touring Places?",
          answer: "You can book a tour by browsing our destinations on the homepage, selecting your preferred tour, and clicking 'Book Now'. Fill in your details and we'll confirm your booking via email within 24 hours."
        },
        {
          question: "Can I modify or cancel my booking?",
          answer: "Yes, you can modify or cancel your booking up to 48 hours before the scheduled departure. Please contact our support team via the Contact Us form or email us directly. Cancellation fees may apply depending on the timing."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and selected mobile payment options. All transactions are secured with industry-standard encryption."
        },
        {
          question: "Do you offer group discounts?",
          answer: "Yes! We offer special rates for groups of 6 or more travelers. Contact us with your group size and preferred tour for a customized quote."
        }
      ]
    },
    {
      category: "Tours & Experiences",
      questions: [
        {
          question: "What types of tours do you offer?",
          answer: "We offer a wide range of experiences including safari adventures, wine tours in the Cape Winelands, city tours in Cape Town and Johannesburg, cultural experiences, and custom private tours across South Africa and beyond."
        },
        {
          question: "Are your tours suitable for children?",
          answer: "Many of our tours are family-friendly! Each tour description includes age recommendations. For safari tours, we recommend children be at least 6 years old. Contact us for family-specific recommendations."
        },
        {
          question: "What should I pack for a safari tour?",
          answer: "We recommend neutral-colored clothing (khaki, beige, olive), comfortable walking shoes, a wide-brimmed hat, sunscreen, insect repellent, binoculars, and a camera. We'll send a detailed packing list upon booking."
        },
        {
          question: "Do you provide travel insurance?",
          answer: "While we don't sell travel insurance directly, we strongly recommend purchasing comprehensive travel insurance before your trip. We can recommend trusted insurance providers upon request."
        }
      ]
    },
    {
      category: "Flights & Shuttles",
      questions: [
        {
          question: "How does your flight search work?",
          answer: "Our flight search integrates with major airlines to find you the best routes and prices. Simply enter your departure and arrival cities, dates, and number of passengers. We'll show you available options sorted by price."
        },
        {
          question: "Do you offer airport shuttle services?",
          answer: "Yes! We provide reliable airport transfers to and from major South African airports including OR Tambo (Johannesburg), Cape Town International, and King Shaka (Durban). Book through our Shuttles section."
        },
        {
          question: "Can I book a return shuttle?",
          answer: "Absolutely. When booking your shuttle, you can add a return trip. Our drivers will be there to pick you up at your scheduled time, tracking your flight for any delays."
        }
      ]
    },
    {
      category: "Accommodation",
      questions: [
        {
          question: "Do you help with accommodation bookings?",
          answer: "Yes, we can arrange accommodation as part of your tour package or separately. We partner with vetted hotels, lodges, and guesthouses across all price ranges."
        },
        {
          question: "What types of accommodation are available?",
          answer: "From luxury safari lodges and boutique hotels to comfortable guesthouses and budget-friendly options, we cater to all preferences and budgets. Each property is personally vetted by our team."
        }
      ]
    },
    {
      category: "Safety & Support",
      questions: [
        {
          question: "Is South Africa safe for tourists?",
          answer: "South Africa welcomes millions of tourists annually. Like any destination, we recommend common-sense precautions. Our tours are designed with safety in mind, using trusted operators and experienced guides."
        },
        {
          question: "Do you provide 24/7 support during my trip?",
          answer: "Yes! Once you book with us, you'll receive emergency contact numbers. Our support team is available around the clock to assist with any issues during your journey."
        },
        {
          question: "What COVID-19 measures are in place?",
          answer: "We follow all current health guidelines and work only with partners who maintain high hygiene standards. Check our latest travel advisories for up-to-date information before your trip."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-secondary to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center animate-fade-up">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Help Center
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 mb-6">
                Frequently Asked Questions
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Find answers to common questions about our tours, bookings, and travel services. 
                Can't find what you're looking for? Contact our friendly team.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-12 animate-fade-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                    {category.category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="bg-card rounded-xl px-6 border border-border shadow-soft"
                      >
                        <AccordionTrigger className="font-display text-left font-semibold hover:text-primary transition-colors py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-charcoal">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-card mb-6">
                Still Have Questions?
              </h2>
              <p className="font-body text-card/80 mb-8 text-lg">
                Our travel experts are here to help. Reach out and we'll get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#find-us">
                  <Button variant="hero" size="lg">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="border-card/30 text-card hover:bg-card/10">
                    Explore Tours
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
