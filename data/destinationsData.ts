export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  tourCount: number;
  bestTime: string;
  idealDuration: string;
  avgBudget: string;
  attractions: { name: string; desc: string; icon: string }[];
  seoTitle?: string;
  seoDescription?: string;
}

export const DESTINATIONS_DATA: DestinationItem[] = [
  {
    id: "spiti",
    slug: "spiti",
    name: "Spiti Valley",
    tagline: "The Middle Land between India and Tibet",
    description: "A cold desert mountain valley located high in the Himalayas, renowned for its ancient cliffside monasteries, raw lunar topography, fossil villages, and breathtaking azure lakes.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
    tourCount: 4,
    bestTime: "May to October",
    idealDuration: "7 - 10 Days",
    avgBudget: "₹18,000 - ₹28,000",
    attractions: [
      { name: "Key Monastery", desc: "1000-year-old Tibetan Buddhist spiritual retreat perched at 13,668 ft.", icon: "mountain" },
      { name: "Chandratal Lake", desc: "Crystal clear crescent-shaped moon lake situated at 14,000 ft.", icon: "compass" },
      { name: "Hikkim Post Office", desc: "World's highest functioning post office where you can send postcards home.", icon: "mail" },
      { name: "Dhankar Monastery", desc: "Spectacular fortress monastery overlooking confluence of rivers.", icon: "shield" },
    ],
  },
  {
    id: "ladakh",
    slug: "ladakh",
    name: "Ladakh",
    tagline: "Land of High Passes & Cosmic Skies",
    description: "Towering snow-clad peaks, the azure expanses of Pangong Tso, the singing sand dunes of Nubra Valley, and the highest motorable road in human history: Umling La.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop",
    tourCount: 6,
    bestTime: "June to September",
    idealDuration: "8 - 12 Days",
    avgBudget: "₹24,000 - ₹38,000",
    attractions: [
      { name: "Umling La (19,024 ft)", desc: "World's highest motorable pass conquered by HumTripWale crews.", icon: "flag" },
      { name: "Pangong Tso", desc: "134 km long saltwater lake straddling India and Tibet.", icon: "sun" },
      { name: "Nubra Valley", desc: "High-altitude desert with double-humped Bactrian camels.", icon: "map-pin" },
    ],
  },
  {
    id: "kashmir",
    slug: "kashmir",
    name: "Kashmir",
    tagline: "Heaven on Earth",
    description: "Misty pine forests, traditional cedarwood houseboats on Dal Lake, golden saffron fields, and the snow slopes of Gulmarg.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop",
    tourCount: 5,
    bestTime: "March to October (Summer) & Dec to Feb (Snow)",
    idealDuration: "5 - 7 Days",
    avgBudget: "₹16,000 - ₹30,000",
    attractions: [
      { name: "Dal Lake Shikara", desc: "Iconic glide through floating lily pads and lotus gardens.", icon: "anchor" },
      { name: "Gulmarg Gondola", desc: "Sky-high cable car ride reaching Apharwat Peak.", icon: "cable-car" },
      { name: "Betaab Valley", desc: "Lush meadows flanked by pine forests and pristine streams.", icon: "trees" },
    ],
  },
  {
    id: "himachal",
    slug: "himachal",
    name: "Himachal Pradesh",
    tagline: "Apple Orchards, Waterfalls & Valley Cafes",
    description: "From the bohemian vibes of Kasol and Kheerganga hot springs to the serene wooden cottages of Jibhi and Tirthan Valley.",
    image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop",
    tourCount: 8,
    bestTime: "Throughout the year",
    idealDuration: "3 - 7 Days",
    avgBudget: "₹5,000 - ₹15,000",
    attractions: [
      { name: "Jibhi & Jalori Pass", desc: "Hidden Himalayan hamlets with crystal waterfalls and peaceful hikes.", icon: "mountain" },
      { name: "Kheerganga", desc: "Natural steaming sulphur springs atop high-altitude alpine meadows.", icon: "sun" },
      { name: "Solang & Atal Tunnel", desc: "Gateway to high adventure and snow valleys.", icon: "wind" },
    ],
  },
  {
    id: "bali",
    slug: "bali",
    name: "Bali",
    tagline: "Island of the Gods",
    description: "Emerald jungle rice terraces, cliffside ocean temples with Kecak fire dances, private pool villas, and white-sand Nusa Penida island hopping.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    tourCount: 3,
    bestTime: "April to October",
    idealDuration: "6 - 9 Days",
    avgBudget: "₹38,000 - ₹65,000",
    attractions: [
      { name: "Nusa Penida", desc: "Spectacular Kelingking dinosaur cliff and Manta ray snorkeling.", icon: "compass" },
      { name: "Uluwatu Sunset Temple", desc: "Dramatically perched 70 meters above roaring Indian Ocean waves.", icon: "sun" },
      { name: "Tegalalang Rice Terraces", desc: "Multi-tiered emerald greenery with iconic jungle swings.", icon: "trees" },
    ],
  },
  {
    id: "thailand",
    slug: "thailand",
    name: "Thailand",
    tagline: "Tropical Odyssey & Island Escapes",
    description: "Speedboat across turquoise waters of Maya Bay, emerald lagoons, vibrant night markets, and cliffside ocean resorts.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
    tourCount: 4,
    bestTime: "November to April",
    idealDuration: "5 - 8 Days",
    avgBudget: "₹32,000 - ₹55,000",
    attractions: [
      { name: "Phi Phi & Maya Bay", desc: "Unreal limestone karsts plunging into turquoise lagoons.", icon: "anchor" },
      { name: "Krabi 4 Islands", desc: "Walk along sea sandbars at low tide and watch sunset bioluminescence.", icon: "sun" },
    ],
  },
  {
    id: "goa",
    slug: "goa",
    name: "Goa",
    tagline: "Sun, Sand, Yachts & Heritage Villas",
    description: "Experience Goa beyond ordinary tourism: private heritage villas, sunset catamaran yacht sails, secluded southern beaches, and VIP club tables.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    tourCount: 3,
    bestTime: "October to April",
    idealDuration: "3 - 5 Days",
    avgBudget: "₹12,000 - ₹25,000",
    attractions: [
      { name: "Private Catamaran Cruise", desc: "2-hour sail along Mandovi river with music & refreshments.", icon: "anchor" },
      { name: "Cola Beach Lagoon", desc: "Emerald freshwater lagoon meeting sea waves.", icon: "sun" },
    ],
  },
  {
    id: "rajasthan",
    slug: "rajasthan",
    name: "Rajasthan",
    tagline: "The Royal Desert Kingdom",
    description: "Lakeside palace sunsets in Udaipur, Mehrangarh fort towering over indigo streets of Jodhpur, and starlit dune camps in Jaisalmer.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
    tourCount: 3,
    bestTime: "October to March",
    idealDuration: "5 - 8 Days",
    avgBudget: "₹18,000 - ₹32,000",
    attractions: [
      { name: "Sam Sand Dunes", desc: "Thrilling 4x4 dune bashing, camel safaris, and Rajasthani folk dances.", icon: "sun" },
      { name: "Lake Pichola", desc: "Romantic boat cruises surrounded by marble island palaces.", icon: "anchor" },
    ],
  },
];
