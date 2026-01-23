import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United Kingdom",
    rating: 5,
    text: "Our Cape Town wine tour was absolutely spectacular! The guide was knowledgeable and the views were breathtaking. Touring Places made everything seamless from start to finish.",
    tour: "Cape Winelands Tour",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    rating: 5,
    text: "The safari experience exceeded all expectations. We saw the Big Five within the first two days! The accommodation was luxurious and the staff were incredibly attentive.",
    tour: "Kruger Safari Adventure",
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "Australia",
    rating: 5,
    text: "I've traveled extensively, but the attention to detail by Touring Places is unmatched. From airport pickup to the final goodbye, every moment was carefully planned.",
    tour: "Garden Route Explorer",
  },
  {
    id: 4,
    name: "David Okonkwo",
    location: "Ghana",
    rating: 5,
    text: "As a local recommending tours to my international friends, I'm always confident suggesting Touring Places. They showcase Africa's beauty authentically and responsibly.",
    tour: "Ghana Heritage Tour",
  },
  {
    id: 5,
    name: "Maria Santos",
    location: "Brazil",
    rating: 5,
    text: "The airport shuttle service was punctual and comfortable. After a long flight, having a reliable transfer made all the difference. Highly recommend!",
    tour: "Airport Shuttle Service",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from travelers who have experienced the magic of Africa with Touring Places
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-background rounded-2xl p-6 h-full shadow-soft hover:shadow-medium transition-shadow duration-300">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-foreground/80 mb-6 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-border pt-4 mt-auto">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    <p className="text-xs text-primary mt-1">{testimonial.tour}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">5000+</p>
            <p className="text-sm text-muted-foreground">Happy Travelers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">4.9★</p>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">12+</p>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">Safe Journeys</p>
          </div>
        </div>
      </div>
    </section>
  );
};
