export interface ReviewItem {
  id: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
  tripName: string;
  date: string;
  comment: string;
  images?: string[];
  verified: boolean;
}

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Shubham Rastogi",
    location: "Delhi NCR",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tripName: "Full Circuit Spiti",
    date: "August 2026",
    comment: "This was my first group trip as a solo traveler, and HumTripWale made it feel like a family vacation. Our trip captain Karan was phenomenal with safety, health, and local music nights at Tabo & Chandratal. Postcards from Hikkim arrived safely!",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Ananya Deshmukh",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tripName: "Ladakh Road Trip & Umling La",
    date: "July 2026",
    comment: "Reaching Umling La at 19,024 ft with HumTripWale was a dream fulfilled! The backup oxygen cylinders and constant checkups by the crew gave us 100% confidence. Pangong Tso camps were unexpectedly luxurious with delicious warm food.",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Vikram & Tanvi Mehta",
    location: "Bengaluru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tripName: "Bali Tropical Odyssey",
    date: "September 2026",
    comment: "Booked our honeymoon trip to Bali through HumTripWale. The private pool villa in Seminyak was breathtaking, and the speedboat Nusa Penida excursion went super smoothly. Truly luxury at an honest price.",
    verified: true,
  },
  {
    id: "rev-4",
    author: "Rahul Batra",
    location: "Chandigarh",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    tripName: "Jibhi & Tirthan Valley Weekend",
    date: "September 2026",
    comment: "The Friday night bus departure and Monday morning drop is the best thing ever for working professionals. Wooden cottages right beside the river, Serolsar lake hike, and zero work stress. Already planning my next trip with HumTripWale!",
    verified: true,
  },
];
