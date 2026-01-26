import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ToursSearchRequest {
  destination: string;
  dateFrom?: string;
  dateTo?: string;
  travelers?: number;
}

// Curated tours data by destination
const toursByDestination: Record<string, any[]> = {
  "south africa": [
    { id: "za-1", name: "Cape Town City & Table Mountain Tour", destination: "Cape Town", duration: "Full Day", price: 1200, currency: "ZAR", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400", highlights: ["Table Mountain", "Bo-Kaap", "V&A Waterfront"] },
    { id: "za-2", name: "Cape Winelands Experience", destination: "Stellenbosch", duration: "Full Day", price: 1500, currency: "ZAR", rating: 4.8, reviews: 1823, image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400", highlights: ["Wine Tasting", "Franschhoek", "Cheese Pairing"] },
    { id: "za-3", name: "Garden Route 3-Day Adventure", destination: "Garden Route", duration: "3 Days", price: 8500, currency: "ZAR", rating: 4.9, reviews: 892, image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400", highlights: ["Tsitsikamma", "Knysna", "Plettenberg Bay"] },
    { id: "za-4", name: "Kruger Safari Experience", destination: "Kruger National Park", duration: "3 Days", price: 12000, currency: "ZAR", rating: 5.0, reviews: 3421, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Big Five", "Sunset Drives", "Bush Walks"] },
    { id: "za-5", name: "Cape Peninsula Tour", destination: "Cape Point", duration: "Full Day", price: 1100, currency: "ZAR", rating: 4.8, reviews: 2156, image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400", highlights: ["Penguins", "Cape Point", "Chapman's Peak"] },
    { id: "za-6", name: "Johannesburg City & Soweto Tour", destination: "Johannesburg", duration: "Full Day", price: 950, currency: "ZAR", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400", highlights: ["Apartheid Museum", "Soweto", "Mandela House"] },
    { id: "za-7", name: "Shark Cage Diving", destination: "Gansbaai", duration: "Full Day", price: 2500, currency: "ZAR", rating: 4.9, reviews: 987, image: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400", highlights: ["Great White Sharks", "Marine Wildlife", "Breakfast & Lunch"] },
    { id: "za-8", name: "Drakensberg Mountains Hike", destination: "Drakensberg", duration: "2 Days", price: 4500, currency: "ZAR", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Hiking", "Rock Art", "Amphitheatre"] },
    { id: "za-9", name: "Durban City & Beaches", destination: "Durban", duration: "Full Day", price: 850, currency: "ZAR", rating: 4.6, reviews: 543, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400", highlights: ["Golden Mile", "uShaka", "Indian Quarter"] },
    { id: "za-10", name: "Blyde River Canyon Tour", destination: "Mpumalanga", duration: "Full Day", price: 1800, currency: "ZAR", rating: 4.8, reviews: 876, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["God's Window", "Bourke's Luck Potholes", "Three Rondavels"] },
  ],
  "kenya": [
    { id: "ke-1", name: "Masai Mara Safari", destination: "Masai Mara", duration: "4 Days", price: 2500, currency: "USD", rating: 5.0, reviews: 4521, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Big Five", "Great Migration", "Hot Air Balloon"] },
    { id: "ke-2", name: "Nairobi City Tour", destination: "Nairobi", duration: "Full Day", price: 150, currency: "USD", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400", highlights: ["Giraffe Centre", "Elephant Orphanage", "Karen Blixen"] },
    { id: "ke-3", name: "Amboseli National Park", destination: "Amboseli", duration: "3 Days", price: 1800, currency: "USD", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400", highlights: ["Kilimanjaro Views", "Elephants", "Maasai Culture"] },
    { id: "ke-4", name: "Diani Beach Escape", destination: "Diani Beach", duration: "3 Days", price: 1200, currency: "USD", rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400", highlights: ["White Sand Beach", "Snorkeling", "Dolphin Safari"] },
    { id: "ke-5", name: "Lake Nakuru Safari", destination: "Lake Nakuru", duration: "2 Days", price: 800, currency: "USD", rating: 4.7, reviews: 765, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Flamingos", "Rhinos", "Bird Watching"] },
    { id: "ke-6", name: "Mount Kenya Trek", destination: "Mount Kenya", duration: "5 Days", price: 2000, currency: "USD", rating: 4.9, reviews: 543, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Summit", "Alpine Scenery", "Wildlife"] },
    { id: "ke-7", name: "Lamu Island Heritage Tour", destination: "Lamu", duration: "3 Days", price: 1500, currency: "USD", rating: 4.8, reviews: 432, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["UNESCO Site", "Dhow Sailing", "Swahili Culture"] },
    { id: "ke-8", name: "Hell's Gate Cycling Safari", destination: "Hell's Gate", duration: "Full Day", price: 120, currency: "USD", rating: 4.6, reviews: 654, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Cycling", "Rock Climbing", "Hot Springs"] },
    { id: "ke-9", name: "Samburu National Reserve", destination: "Samburu", duration: "3 Days", price: 1600, currency: "USD", rating: 4.8, reviews: 876, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Unique Wildlife", "Samburu Culture", "Ewaso Ng'iro River"] },
    { id: "ke-10", name: "Mombasa Old Town & Fort Jesus", destination: "Mombasa", duration: "Full Day", price: 100, currency: "USD", rating: 4.5, reviews: 543, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Fort Jesus", "Old Town", "Swahili History"] },
  ],
  "ghana": [
    { id: "gh-1", name: "Cape Coast Castle & Elmina Tour", destination: "Cape Coast", duration: "Full Day", price: 150, currency: "USD", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=400", highlights: ["Slave Castles", "History", "Kakum National Park"] },
    { id: "gh-2", name: "Accra City Experience", destination: "Accra", duration: "Full Day", price: 80, currency: "USD", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400", highlights: ["Independence Square", "Art Centre", "Jamestown"] },
    { id: "gh-3", name: "Kakum Canopy Walk", destination: "Kakum", duration: "Full Day", price: 120, currency: "USD", rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Canopy Walk", "Rainforest", "Wildlife"] },
    { id: "gh-4", name: "Ashanti Kingdom Tour", destination: "Kumasi", duration: "2 Days", price: 350, currency: "USD", rating: 4.8, reviews: 765, image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=400", highlights: ["Manhyia Palace", "Kente Weaving", "Cultural Heritage"] },
    { id: "gh-5", name: "Wli Waterfalls Trek", destination: "Volta Region", duration: "Full Day", price: 100, currency: "USD", rating: 4.7, reviews: 543, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Highest Waterfall", "Hiking", "Bat Colony"] },
    { id: "gh-6", name: "Mole National Park Safari", destination: "Mole", duration: "3 Days", price: 500, currency: "USD", rating: 4.8, reviews: 432, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Elephants", "Walking Safari", "Larabanga Mosque"] },
    { id: "gh-7", name: "Ada Foah Beach & Estuary", destination: "Ada Foah", duration: "2 Days", price: 200, currency: "USD", rating: 4.6, reviews: 321, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Beach", "Volta River", "Water Sports"] },
    { id: "gh-8", name: "Busua Beach Surf Trip", destination: "Busua", duration: "3 Days", price: 400, currency: "USD", rating: 4.7, reviews: 234, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400", highlights: ["Surfing", "Beach Life", "Fishing Villages"] },
    { id: "gh-9", name: "Shai Hills Nature Reserve", destination: "Shai Hills", duration: "Full Day", price: 90, currency: "USD", rating: 4.5, reviews: 432, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Baboons", "Caves", "Hiking"] },
    { id: "gh-10", name: "Volta Region Cultural Tour", destination: "Volta Region", duration: "3 Days", price: 450, currency: "USD", rating: 4.8, reviews: 321, image: "https://images.unsplash.com/photo-1590845947698-8924d7409b56?w=400", highlights: ["Tafi Atome Monkey Sanctuary", "Kente Village", "Mountain Views"] },
  ],
  "tanzania": [
    { id: "tz-1", name: "Serengeti Safari", destination: "Serengeti", duration: "4 Days", price: 3000, currency: "USD", rating: 5.0, reviews: 5234, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Great Migration", "Big Five", "Balloon Safari"] },
    { id: "tz-2", name: "Zanzibar Beach Holiday", destination: "Zanzibar", duration: "5 Days", price: 1500, currency: "USD", rating: 4.9, reviews: 3421, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Stone Town", "Spice Tour", "Beach"] },
    { id: "tz-3", name: "Kilimanjaro Trek", destination: "Mount Kilimanjaro", duration: "7 Days", price: 4500, currency: "USD", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Summit", "Multiple Routes", "Glaciers"] },
    { id: "tz-4", name: "Ngorongoro Crater Safari", destination: "Ngorongoro", duration: "2 Days", price: 1200, currency: "USD", rating: 4.9, reviews: 1987, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Crater Floor", "Black Rhino", "Maasai Village"] },
    { id: "tz-5", name: "Tarangire Elephant Safari", destination: "Tarangire", duration: "2 Days", price: 900, currency: "USD", rating: 4.8, reviews: 1234, image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400", highlights: ["Elephant Herds", "Baobab Trees", "Bird Life"] },
    { id: "tz-6", name: "Lake Manyara Day Trip", destination: "Lake Manyara", duration: "Full Day", price: 350, currency: "USD", rating: 4.7, reviews: 876, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Tree-Climbing Lions", "Flamingos", "Hot Springs"] },
    { id: "tz-7", name: "Dar es Salaam City Tour", destination: "Dar es Salaam", duration: "Full Day", price: 100, currency: "USD", rating: 4.5, reviews: 543, image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400", highlights: ["National Museum", "Fish Market", "Kariakoo"] },
    { id: "tz-8", name: "Selous Game Reserve", destination: "Selous", duration: "3 Days", price: 1800, currency: "USD", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Boat Safari", "Walking Safari", "Remote Wilderness"] },
    { id: "tz-9", name: "Pemba Island Diving", destination: "Pemba Island", duration: "4 Days", price: 1600, currency: "USD", rating: 4.9, reviews: 432, image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400", highlights: ["Diving", "Coral Reefs", "Untouched Paradise"] },
    { id: "tz-10", name: "Ruaha National Park", destination: "Ruaha", duration: "4 Days", price: 2200, currency: "USD", rating: 4.8, reviews: 321, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Off-the-Beaten-Path", "Great Ruaha River", "Lions"] },
  ],
  "botswana": [
    { id: "bw-1", name: "Okavango Delta Safari", destination: "Okavango Delta", duration: "4 Days", price: 4500, currency: "USD", rating: 5.0, reviews: 3421, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Mokoro Trips", "Wildlife", "Water Safari"] },
    { id: "bw-2", name: "Chobe National Park", destination: "Chobe", duration: "3 Days", price: 2500, currency: "USD", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400", highlights: ["Elephant Herds", "Boat Safari", "Sunset Cruise"] },
    { id: "bw-3", name: "Central Kalahari Adventure", destination: "Kalahari", duration: "4 Days", price: 3000, currency: "USD", rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["San Bushmen", "Desert Wildlife", "Star Gazing"] },
    { id: "bw-4", name: "Makgadikgadi Salt Pans", destination: "Makgadikgadi", duration: "3 Days", price: 2000, currency: "USD", rating: 4.8, reviews: 765, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Salt Pans", "Meerkats", "Quad Biking"] },
    { id: "bw-5", name: "Moremi Game Reserve", destination: "Moremi", duration: "3 Days", price: 2800, currency: "USD", rating: 4.9, reviews: 654, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Wild Dogs", "Leopards", "Diverse Habitats"] },
    { id: "bw-6", name: "Gaborone City & Culture", destination: "Gaborone", duration: "Full Day", price: 150, currency: "USD", rating: 4.5, reviews: 432, image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=400", highlights: ["National Museum", "Craft Markets", "Mokolodi Nature Reserve"] },
    { id: "bw-7", name: "Savuti Wildlife Adventure", destination: "Savuti", duration: "3 Days", price: 3200, currency: "USD", rating: 4.9, reviews: 543, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Predators", "Elephant Bulls", "Remote Camp"] },
    { id: "bw-8", name: "Nata Bird Sanctuary", destination: "Nata", duration: "2 Days", price: 800, currency: "USD", rating: 4.6, reviews: 321, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Flamingos", "Bird Watching", "Sunset"] },
    { id: "bw-9", name: "Khama Rhino Sanctuary", destination: "Serowe", duration: "Full Day", price: 200, currency: "USD", rating: 4.7, reviews: 234, image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=400", highlights: ["Rhino Conservation", "Walking Trails", "Bird Life"] },
    { id: "bw-10", name: "Tsodilo Hills Heritage Tour", destination: "Tsodilo", duration: "2 Days", price: 600, currency: "USD", rating: 4.8, reviews: 321, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Rock Art", "UNESCO Site", "San Culture"] },
  ],
  "united kingdom": [
    { id: "uk-1", name: "London Highlights Tour", destination: "London", duration: "Full Day", price: 120, currency: "GBP", rating: 4.8, reviews: 5432, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", highlights: ["Big Ben", "Tower of London", "Buckingham Palace"] },
    { id: "uk-2", name: "Stonehenge & Bath", destination: "Stonehenge", duration: "Full Day", price: 95, currency: "GBP", rating: 4.9, reviews: 4321, image: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=400", highlights: ["Stonehenge", "Roman Baths", "Jane Austen"] },
    { id: "uk-3", name: "Scottish Highlands Adventure", destination: "Scottish Highlands", duration: "3 Days", price: 450, currency: "GBP", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", highlights: ["Loch Ness", "Glencoe", "Castles"] },
    { id: "uk-4", name: "Edinburgh Castle & Royal Mile", destination: "Edinburgh", duration: "Full Day", price: 80, currency: "GBP", rating: 4.8, reviews: 1987, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", highlights: ["Edinburgh Castle", "Royal Mile", "Arthur's Seat"] },
    { id: "uk-5", name: "Cotswolds Villages Tour", destination: "Cotswolds", duration: "Full Day", price: 85, currency: "GBP", rating: 4.8, reviews: 1654, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Bibury", "Bourton-on-the-Water", "Tea & Scones"] },
    { id: "uk-6", name: "Oxford & Cambridge Tour", destination: "Oxford", duration: "Full Day", price: 90, currency: "GBP", rating: 4.7, reviews: 1432, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", highlights: ["Universities", "Punting", "Historic Colleges"] },
    { id: "uk-7", name: "Lake District Experience", destination: "Lake District", duration: "2 Days", price: 280, currency: "GBP", rating: 4.9, reviews: 987, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", highlights: ["Windermere", "Hiking", "Beatrix Potter"] },
    { id: "uk-8", name: "Windsor Castle & Hampton Court", destination: "Windsor", duration: "Full Day", price: 95, currency: "GBP", rating: 4.8, reviews: 876, image: "https://images.unsplash.com/photo-1599833975787-5c143f373c30?w=400", highlights: ["Royal Residences", "Gardens", "History"] },
    { id: "uk-9", name: "York & Yorkshire Dales", destination: "York", duration: "2 Days", price: 220, currency: "GBP", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["York Minster", "Shambles", "Dales"] },
    { id: "uk-10", name: "Liverpool Beatles Tour", destination: "Liverpool", duration: "Full Day", price: 75, currency: "GBP", rating: 4.7, reviews: 543, image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400", highlights: ["Cavern Club", "Penny Lane", "Beatles Story"] },
  ],
  "uae": [
    { id: "ae-1", name: "Dubai City Tour", destination: "Dubai", duration: "Full Day", price: 200, currency: "AED", rating: 4.8, reviews: 4532, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", highlights: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah"] },
    { id: "ae-2", name: "Desert Safari & BBQ", destination: "Dubai Desert", duration: "Half Day", price: 350, currency: "AED", rating: 4.9, reviews: 5643, image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400", highlights: ["Dune Bashing", "Camel Ride", "BBQ Dinner"] },
    { id: "ae-3", name: "Abu Dhabi Grand Mosque Tour", destination: "Abu Dhabi", duration: "Full Day", price: 400, currency: "AED", rating: 4.9, reviews: 3421, image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400", highlights: ["Sheikh Zayed Mosque", "Louvre", "Emirates Palace"] },
    { id: "ae-4", name: "Dubai Marina Yacht Cruise", destination: "Dubai Marina", duration: "3 Hours", price: 500, currency: "AED", rating: 4.8, reviews: 2341, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", highlights: ["Yacht Cruise", "Skyline Views", "Sunset"] },
    { id: "ae-5", name: "Burj Khalifa At The Top", destination: "Dubai", duration: "2 Hours", price: 250, currency: "AED", rating: 4.9, reviews: 6543, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", highlights: ["Observation Deck", "Views", "Photography"] },
    { id: "ae-6", name: "Ferrari World Abu Dhabi", destination: "Yas Island", duration: "Full Day", price: 600, currency: "AED", rating: 4.7, reviews: 1987, image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400", highlights: ["Roller Coasters", "Simulators", "Ferrari Museum"] },
    { id: "ae-7", name: "Old Dubai Walking Tour", destination: "Dubai", duration: "3 Hours", price: 150, currency: "AED", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", highlights: ["Gold Souk", "Spice Souk", "Abra Ride"] },
    { id: "ae-8", name: "Sharjah Cultural Tour", destination: "Sharjah", duration: "Half Day", price: 200, currency: "AED", rating: 4.6, reviews: 876, image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400", highlights: ["Museums", "Souks", "Heritage Area"] },
    { id: "ae-9", name: "Ras Al Khaimah Adventure", destination: "Ras Al Khaimah", duration: "Full Day", price: 450, currency: "AED", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400", highlights: ["Zip Line", "Jebel Jais", "Kayaking"] },
    { id: "ae-10", name: "Fujairah East Coast Tour", destination: "Fujairah", duration: "Full Day", price: 380, currency: "AED", rating: 4.7, reviews: 543, image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400", highlights: ["Beaches", "Mountains", "Fujairah Fort"] },
  ],
  "japan": [
    { id: "jp-1", name: "Tokyo Highlights Tour", destination: "Tokyo", duration: "Full Day", price: 15000, currency: "JPY", rating: 4.9, reviews: 5432, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", highlights: ["Shibuya", "Senso-ji", "Harajuku"] },
    { id: "jp-2", name: "Mount Fuji Day Trip", destination: "Mount Fuji", duration: "Full Day", price: 12000, currency: "JPY", rating: 4.9, reviews: 4321, image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400", highlights: ["5th Station", "Lake Kawaguchi", "Views"] },
    { id: "jp-3", name: "Kyoto Temples & Gardens", destination: "Kyoto", duration: "Full Day", price: 10000, currency: "JPY", rating: 4.9, reviews: 3987, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", highlights: ["Fushimi Inari", "Kinkaku-ji", "Geisha District"] },
    { id: "jp-4", name: "Osaka Food Tour", destination: "Osaka", duration: "4 Hours", price: 8000, currency: "JPY", rating: 4.8, reviews: 2341, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400", highlights: ["Street Food", "Dotonbori", "Local Markets"] },
    { id: "jp-5", name: "Hiroshima Peace Memorial", destination: "Hiroshima", duration: "Full Day", price: 18000, currency: "JPY", rating: 4.9, reviews: 1987, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", highlights: ["Peace Park", "Atomic Dome", "Miyajima"] },
    { id: "jp-6", name: "Nara Deer Park & Temples", destination: "Nara", duration: "Half Day", price: 6000, currency: "JPY", rating: 4.8, reviews: 1654, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", highlights: ["Friendly Deer", "Todai-ji", "Gardens"] },
    { id: "jp-7", name: "Hakone Hot Springs", destination: "Hakone", duration: "2 Days", price: 45000, currency: "JPY", rating: 4.9, reviews: 1234, image: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400", highlights: ["Onsen", "Open-Air Museum", "Fuji Views"] },
    { id: "jp-8", name: "Nikko World Heritage Tour", destination: "Nikko", duration: "Full Day", price: 14000, currency: "JPY", rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", highlights: ["Toshogu Shrine", "Waterfalls", "Mountains"] },
    { id: "jp-9", name: "Kanazawa Samurai District", destination: "Kanazawa", duration: "Full Day", price: 11000, currency: "JPY", rating: 4.7, reviews: 765, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400", highlights: ["Kenroku-en", "Geisha Districts", "Samurai Houses"] },
    { id: "jp-10", name: "Okinawa Island Paradise", destination: "Okinawa", duration: "3 Days", price: 85000, currency: "JPY", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Beaches", "Snorkeling", "Shuri Castle"] },
  ],
  "china": [
    { id: "cn-1", name: "Great Wall & Forbidden City", destination: "Beijing", duration: "Full Day", price: 800, currency: "CNY", rating: 4.9, reviews: 6543, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Great Wall", "Forbidden City", "Tiananmen"] },
    { id: "cn-2", name: "Terracotta Warriors Xi'an", destination: "Xi'an", duration: "Full Day", price: 600, currency: "CNY", rating: 4.9, reviews: 4321, image: "https://images.unsplash.com/photo-1529921879218-f99546d03a15?w=400", highlights: ["Terracotta Army", "City Wall", "Muslim Quarter"] },
    { id: "cn-3", name: "Shanghai Modern & Classic", destination: "Shanghai", duration: "Full Day", price: 500, currency: "CNY", rating: 4.8, reviews: 3421, image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400", highlights: ["The Bund", "Yu Garden", "Pudong"] },
    { id: "cn-4", name: "Guilin Li River Cruise", destination: "Guilin", duration: "Full Day", price: 900, currency: "CNY", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Li River", "Karst Mountains", "Yangshuo"] },
    { id: "cn-5", name: "Chengdu Panda Base", destination: "Chengdu", duration: "Half Day", price: 400, currency: "CNY", rating: 4.9, reviews: 5432, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Giant Pandas", "Red Pandas", "Conservation"] },
    { id: "cn-6", name: "Zhangjiajie Avatar Mountains", destination: "Zhangjiajie", duration: "2 Days", price: 1500, currency: "CNY", rating: 4.9, reviews: 1987, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Glass Bridge", "Avatar Mountains", "Cable Car"] },
    { id: "cn-7", name: "Hong Kong Island Tour", destination: "Hong Kong", duration: "Full Day", price: 700, currency: "HKD", rating: 4.8, reviews: 2341, image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400", highlights: ["Victoria Peak", "Star Ferry", "Markets"] },
    { id: "cn-8", name: "Suzhou Classical Gardens", destination: "Suzhou", duration: "Full Day", price: 450, currency: "CNY", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Gardens", "Silk Museum", "Canals"] },
    { id: "cn-9", name: "Hangzhou West Lake", destination: "Hangzhou", duration: "Full Day", price: 400, currency: "CNY", rating: 4.8, reviews: 987, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["West Lake", "Tea Plantations", "Pagodas"] },
    { id: "cn-10", name: "Yellow Mountains Trek", destination: "Huangshan", duration: "2 Days", price: 1200, currency: "CNY", rating: 4.9, reviews: 876, image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400", highlights: ["Sunrise", "Pine Trees", "Hot Springs"] },
  ],
  "brazil": [
    { id: "br-1", name: "Rio de Janeiro Highlights", destination: "Rio de Janeiro", duration: "Full Day", price: 400, currency: "BRL", rating: 4.9, reviews: 5432, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", highlights: ["Christ the Redeemer", "Sugarloaf", "Copacabana"] },
    { id: "br-2", name: "Iguazu Falls Adventure", destination: "Iguazu Falls", duration: "Full Day", price: 350, currency: "BRL", rating: 5.0, reviews: 4321, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", highlights: ["Waterfalls", "Boat Safari", "Wildlife"] },
    { id: "br-3", name: "Amazon Rainforest Expedition", destination: "Manaus", duration: "4 Days", price: 2500, currency: "BRL", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400", highlights: ["Jungle Lodge", "Wildlife", "Indigenous Villages"] },
    { id: "br-4", name: "Salvador Afro-Brazilian Culture", destination: "Salvador", duration: "Full Day", price: 250, currency: "BRL", rating: 4.8, reviews: 1987, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", highlights: ["Pelourinho", "Capoeira", "Cuisine"] },
    { id: "br-5", name: "Pantanal Wildlife Safari", destination: "Pantanal", duration: "4 Days", price: 3000, currency: "BRL", rating: 4.9, reviews: 1234, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400", highlights: ["Jaguars", "Caimans", "Bird Watching"] },
    { id: "br-6", name: "Lençóis Maranhenses", destination: "Maranhão", duration: "3 Days", price: 1800, currency: "BRL", rating: 4.9, reviews: 987, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Sand Dunes", "Lagoons", "4x4 Adventure"] },
    { id: "br-7", name: "São Paulo Food & Culture", destination: "São Paulo", duration: "Full Day", price: 300, currency: "BRL", rating: 4.7, reviews: 1654, image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400", highlights: ["Museums", "Food Markets", "Street Art"] },
    { id: "br-8", name: "Fernando de Noronha Diving", destination: "Fernando de Noronha", duration: "4 Days", price: 5000, currency: "BRL", rating: 5.0, reviews: 765, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["Diving", "Beaches", "Marine Life"] },
    { id: "br-9", name: "Chapada Diamantina Trekking", destination: "Chapada Diamantina", duration: "3 Days", price: 1500, currency: "BRL", rating: 4.8, reviews: 654, image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400", highlights: ["Waterfalls", "Caves", "Table Mountains"] },
    { id: "br-10", name: "Florianópolis Beach Hopping", destination: "Florianópolis", duration: "2 Days", price: 800, currency: "BRL", rating: 4.7, reviews: 543, image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400", highlights: ["42 Beaches", "Surfing", "Lagoons"] },
  ],
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ToursSearchRequest = await req.json();
    console.log("Searching tours with params:", data);

    const destination = data.destination?.toLowerCase() || "";
    
    // Find matching tours from our curated data
    let tours: any[] = [];
    
    // Check for country matches first
    for (const [country, countryTours] of Object.entries(toursByDestination)) {
      if (country.includes(destination) || destination.includes(country)) {
        tours = countryTours;
        break;
      }
    }
    
    // If no country match, search across all tours
    if (tours.length === 0 && destination) {
      for (const countryTours of Object.values(toursByDestination)) {
        const matchingTours = countryTours.filter(tour => 
          tour.destination.toLowerCase().includes(destination) ||
          tour.name.toLowerCase().includes(destination)
        );
        tours.push(...matchingTours);
      }
    }
    
    // If still no results, return featured tours from multiple destinations
    if (tours.length === 0) {
      tours = [
        ...toursByDestination["south africa"].slice(0, 3),
        ...toursByDestination["kenya"].slice(0, 2),
        ...toursByDestination["tanzania"].slice(0, 2),
        ...toursByDestination["uae"].slice(0, 2),
        ...toursByDestination["japan"].slice(0, 1),
      ];
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        tours: tours.slice(0, 30),
        totalResults: tours.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in search-tours function:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
