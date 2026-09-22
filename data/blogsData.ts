export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: "Travel Guides" | "Itinerary" | "Food" | "Budget Travel" | "Adventure";
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  heroImage: string;
  content: string[];
}

export const BLOGS_DATA: BlogPost[] = [
  {
    id: "spiti-valley-ultimate-guide",
    slug: "spiti-valley-ultimate-guide",
    title: "The Ultimate Guide to Spiti Valley Circuit: Route, Acclimatization & Packing",
    category: "Travel Guides",
    excerpt: "Everything you must know before taking on the treacherous yet mesmerizing terrain of Spiti Valley via Shimla and Manali.",
    readTime: "6 min read",
    date: "Sep 14, 2026",
    author: "Karan Singh (Trip Captain)",
    heroImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
    content: [
      "Spiti, often called the 'Middle Land', is an enchanting paradise for those yearning for stark dramatic moonscapes and high-altitude solitude.",
      "Why travel via Shimla rather than Manali first? The golden rule of high altitude is gradual ascension. Shimla to Kinnaur to Spiti gently elevates you from 2,000 meters to 3,800 meters over 3 days, virtually eliminating Acute Mountain Sickness (AMS).",
      "Key stops you cannot miss: Chitkul (India's last inhabited village), Gue Mummy (500-year-old self-mummified monk), Key Gompa, and sending a handwritten letter from Hikkim at 14,567 ft.",
      "Always pack multiple warm layers, sturdy ankle-support boots, a high-capacity power bank, and sufficient cash as digital payments can be sporadic in remote corners.",
    ],
  },
  {
    id: "umling-la-highest-pass-tips",
    slug: "umling-la-highest-pass-tips",
    title: "Conquering Umling La (19,024 ft): How We Prepare Our Travelers",
    category: "Adventure",
    excerpt: "Standing higher than Everest Base Camp on wheels. How HumTripWale ensures seamless medical safety and unforgettable memories.",
    readTime: "5 min read",
    date: "Aug 29, 2026",
    author: "HumTripWale Expedition Team",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop",
    content: [
      "At 19,024 ft, Umling La in eastern Ladakh is the highest motorable road in the world. Oxygen levels here are only around 50% of sea level.",
      "Safety First: Our captains carry medical-grade oxygen canisters, pulse oximeters, and adhere to strict acclimatization schedules including two days in Leh and one in Hanle before attempting the summit.",
      "The thrill of arriving at the summit border milestone and holding your conquest certificate is a feeling that words rarely capture.",
    ],
  },
  {
    id: "jibhi-hidden-cafes-weekend",
    slug: "jibhi-hidden-cafes-weekend",
    title: "7 Hidden Cafes and Secret Riverside Trails in Jibhi & Tirthan Valley",
    category: "Food",
    excerpt: "Where to sip freshly brewed pour-overs, taste trout delicacies, and listen to the gushing river away from tourist crowds.",
    readTime: "4 min read",
    date: "Sep 02, 2026",
    author: "Priya Sharma",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    content: [
      "Tucked away in the Banjar valley of Himachal Pradesh, Jibhi is heaven for slow travelers and weekend backpackers.",
      "From traditional siddu served with pure ghee to wood-fired pizzas beside wooden bridges, Jibhi's culinary scene blends Himachali hospitality with cozy continental comforts.",
      "Take an early morning stroll to Chhoie waterfall in Tirthan and sit beside the pebble banks of the pristine river for tranquil rejuvenation.",
    ],
  },
];
