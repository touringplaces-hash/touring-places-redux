import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Search, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "ultimate-cape-town-guide",
    title: "The Ultimate Cape Town Travel Guide 2024",
    excerpt: "Everything you need to know about visiting Cape Town - from Table Mountain adventures to the best wineries in Stellenbosch.",
    image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800",
    category: "Travel Guide",
    author: "Sarah Johnson",
    date: "2024-01-15",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "2",
    slug: "masai-mara-migration",
    title: "Witnessing the Great Migration: A Safari Guide",
    excerpt: "Plan your Masai Mara safari to witness one of nature's most spectacular events - the Great Wildebeest Migration.",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    category: "Safari",
    author: "David Okonkwo",
    date: "2024-01-10",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "3",
    slug: "cape-winelands-tour",
    title: "A Perfect Day in the Cape Winelands",
    excerpt: "Discover the best wineries, restaurants, and scenic drives in South Africa's premier wine region.",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800",
    category: "Wine & Food",
    author: "Emma van der Berg",
    date: "2024-01-08",
    readTime: "5 min read",
  },
  {
    id: "4",
    slug: "kruger-safari-tips",
    title: "10 Essential Tips for Your First Kruger Safari",
    excerpt: "First-time safari tips from our expert guides - maximize your chances of spotting the Big Five.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    category: "Safari",
    author: "Michael Nkosi",
    date: "2024-01-05",
    readTime: "7 min read",
  },
  {
    id: "5",
    slug: "zanzibar-beaches",
    title: "Zanzibar's Best Beaches: A Complete Guide",
    excerpt: "From pristine white sands to vibrant coral reefs - discover the best beaches in Zanzibar.",
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800",
    category: "Beach",
    author: "Amina Hassan",
    date: "2024-01-02",
    readTime: "6 min read",
  },
  {
    id: "6",
    slug: "garden-route-itinerary",
    title: "The Perfect 5-Day Garden Route Itinerary",
    excerpt: "Drive one of the world's most scenic coastal routes with our day-by-day travel guide.",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
    category: "Road Trip",
    author: "Sarah Johnson",
    date: "2023-12-28",
    readTime: "10 min read",
  },
];

const categories = ["All", "Travel Guide", "Safari", "Wine & Food", "Beach", "Road Trip", "Culture"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header onTripTypeChange={() => {}} activeTripType="tours" />
      
      <main className="pt-32 pb-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Travel <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert travel guides, insider tips, and inspiration for your next African adventure.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Posts */}
          {selectedCategory === "All" && !searchQuery && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Badge className="mb-3">{post.category}</Badge>
                    <h2 className="font-display text-2xl font-bold text-card mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-card/80 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-card/60 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
