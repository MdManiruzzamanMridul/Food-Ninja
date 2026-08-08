export type NavItem = {
  href: string;
  label: string;
  hint: string;
};

export const landingRestaurants = [
  { name: "Sushi Orbit", cuisine: "Japanese", eta: "18 min", rating: "4.9", accent: "from-cyan-500 to-blue-600" },
  { name: "Naan District", cuisine: "Indian", eta: "22 min", rating: "4.8", accent: "from-orange-500 to-amber-400" },
  { name: "Green Fork", cuisine: "Healthy", eta: "16 min", rating: "4.7", accent: "from-emerald-400 to-teal-500" },
];

export const customerCategories = ["Burgers", "Pizza", "Rice Bowls", "Desserts", "Coffee", "Healthy"];

export const customerRestaurants = [
  { id: "1", name: "Saffron House", cuisine: "Biryani", eta: "24 min", rating: "4.8", delivery: "Free delivery above $15", price: "$$", status: "Open now" },
  { id: "2", name: "Metro Burger", cuisine: "Burgers", eta: "19 min", rating: "4.6", delivery: "Fastest in your area", price: "$", status: "Top rated" },
  { id: "3", name: "Noodle Lane", cuisine: "Asian", eta: "21 min", rating: "4.9", delivery: "Live tracking enabled", price: "$$", status: "Popular" },
  { id: "4", name: "Garden Bowl", cuisine: "Healthy", eta: "27 min", rating: "4.7", delivery: "Contactless delivery", price: "$$", status: "New" },
  { id: "5", name: "Pizza Metro", cuisine: "Pizza", eta: "18 min", rating: "4.5", delivery: "Late night delivery", price: "$$", status: "Busy" },
  { id: "6", name: "Sweet Room", cuisine: "Dessert", eta: "14 min", rating: "4.9", delivery: "Trending nearby", price: "$", status: "Editor's pick" },
];

export const orderTimeline = [
  { label: "Confirmed", time: "2 min ago", tone: "success" },
  { label: "Preparing", time: "Kitchen live", tone: "warning" },
  { label: "Picked up", time: "Rider nearby", tone: "primary" },
  { label: "Arriving", time: "ETA 6 min", tone: "primary" },
  { label: "Delivered", time: "Pending", tone: "muted" },
];

export const restaurantMenu = [
  { name: "Signature Chicken Bowl", category: "Bowls", price: "$14", inventory: 24, status: "Active" },
  { name: "Firecracker Wings", category: "Sides", price: "$11", inventory: 18, status: "Active" },
  { name: "Citrus Lemonade", category: "Drinks", price: "$4", inventory: 42, status: "Low stock" },
  { name: "Smash Burger", category: "Mains", price: "$13", inventory: 12, status: "Active" },
  { name: "Chocolate Lava Cake", category: "Desserts", price: "$7", inventory: 8, status: "Featured" },
];

export const ownerOrders = [
  { id: "OD-9012", customer: "Maya", items: "2 x Wings, 1 x Bowl", status: "New", time: "Just now" },
  { id: "OD-9013", customer: "Khalid", items: "1 x Burger, 2 x Fries", status: "Preparing", time: "3 min ago" },
  { id: "OD-9014", customer: "Sofia", items: "1 x Pizza, 1 x Lemonade", status: "Ready", time: "7 min ago" },
];

export const ownerRevenue = [
  { label: "Today", value: "$1,280", delta: "+12%" },
  { label: "Week", value: "$8,940", delta: "+18%" },
  { label: "Avg basket", value: "$23", delta: "+4%" },
];

export const riderDeliveries = [
  { id: "R-1204", title: "Saffron House → Maya", status: "Picked Up", eta: "6 min", distance: "1.8 km" },
  { id: "R-1205", title: "Pizza Metro → Arjun", status: "Arrived", eta: "2 min", distance: "0.4 km" },
  { id: "R-1206", title: "Garden Bowl → Lina", status: "En route", eta: "11 min", distance: "3.2 km" },
];

export const adminMetrics = [
  { label: "Orders today", value: "12,430", delta: "+8.2%" },
  { label: "Active users", value: "4,118", delta: "+6.4%" },
  { label: "Online riders", value: "918", delta: "+3.1%" },
  { label: "GMV", value: "$84k", delta: "+14%" },
];

export const adminUsers = [
  { name: "Ava Johnson", role: "Customer", email: "ava@example.com", status: "Active", lastSeen: "2 min ago" },
  { name: "Noah Patel", role: "Customer", email: "noah@example.com", status: "Flagged", lastSeen: "12 min ago" },
  { name: "Mina Chen", role: "Restaurant owner", email: "mina@example.com", status: "Verified", lastSeen: "5 min ago" },
  { name: "Omar Ali", role: "Rider", email: "omar@example.com", status: "On trip", lastSeen: "Now" },
];

export const adminRestaurants = [
  { name: "Spice Harbor", city: "Dhaka", status: "Pending review", owner: "Irfan", rating: "4.7" },
  { name: "Crave Lab", city: "Chattogram", status: "Approved", owner: "Rita", rating: "4.8" },
  { name: "Urban Wok", city: "Sylhet", status: "Suspended", owner: "Hassan", rating: "4.2" },
];

export const adminRiders = [
  { name: "Rahim", city: "Dhaka", status: "Approved", vehicle: "Bike", trips: "182" },
  { name: "Tania", city: "Dhaka", status: "Pending review", vehicle: "Scooter", trips: "41" },
  { name: "Imran", city: "Chattogram", status: "Suspended", vehicle: "Bike", trips: "219" },
];

export const adminOrders = [
  { id: "FN-3001", customer: "Maya", restaurant: "Saffron House", rider: "Rahim", status: "Delivered", value: "$28" },
  { id: "FN-3002", customer: "Khalid", restaurant: "Metro Burger", rider: "Tania", status: "In transit", value: "$16" },
  { id: "FN-3003", customer: "Sofia", restaurant: "Green Fork", rider: "Imran", status: "Canceled", value: "$22" },
];

export const adminPayments = [
  { ref: "TX-421", type: "Card payment", amount: "$28.00", fee: "$2.10", status: "Captured" },
  { ref: "TX-422", type: "Restaurant payout", amount: "$1,204.00", fee: "$32.00", status: "Scheduled" },
  { ref: "TX-423", type: "Rider payout", amount: "$418.00", fee: "$0.00", status: "Completed" },
];

export const ownerNav: NavItem[] = [
  { href: "/owner/dashboard", label: "Dashboard", hint: "Orders and revenue" },
  { href: "/owner/menu", label: "Menu", hint: "Food_category and Foods" },
  { href: "/owner/orders", label: "Orders", hint: "History and transactions" },
  { href: "/owner/settings", label: "Settings", hint: "Hours and banking" },
];

export const riderNav: NavItem[] = [
  { href: "/rider/dashboard", label: "Dashboard", hint: "Availability and map" },
  { href: "/rider/earnings", label: "Earnings", hint: "Trips and balances" },
  { href: "/rider/profile", label: "Profile", hint: "Vehicle and rating" },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", hint: "Platform metrics" },
  { href: "/admin/users", label: "Users", hint: "Customer accounts" },
  { href: "/admin/restaurants", label: "Restaurants", hint: "Approve and suspend" },
  { href: "/admin/riders", label: "Riders", hint: "Onboarding review" },
  { href: "/admin/orders", label: "Orders", hint: "Global activity" },
  { href: "/admin/payments", label: "Payments", hint: "Fees and payouts" },
];

export const customerNav: NavItem[] = [
  { href: "/home", label: "Home", hint: "Feed and search" },
  { href: "/checkout", label: "Checkout", hint: "Cart review" },
  { href: "/orders/FD-2025", label: "Track order", hint: "Live delivery" },
  { href: "/profile", label: "Profile", hint: "Saved details" },
];
