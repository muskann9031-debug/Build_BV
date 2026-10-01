export const cafes = [
  {
    id: "central",
    name: "Central Café",
    location: "Main Academic Block",
    status: "Open",
    categories: ["Fast Food", "Beverages"],
    preparationTime: "10–15 min",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "food-court",
    name: "Food Court",
    location: "Student Activity Center",
    status: "Open",
    categories: ["Meals", "Snacks"],
    preparationTime: "15–20 min",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "hostel",
    name: "Hostel Café",
    location: "Boys Hostel",
    status: "Open",
    categories: ["Snacks", "Beverages"],
    preparationTime: "5–10 min",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "annapurna",
    name: "Annapurna",
    location: "North Campus",
    status: "Closed",
    categories: ["Meals", "Indian"],
    preparationTime: "15–20 min",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  },
];

export const foods = [
  {
    id: "maggi",
    name: "Masala Maggi",
    description: "Hot and delicious masala noodles",
    price: 60,
    category: "Snacks",
    preparationTime: 7,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "burger",
    name: "Campus Burger",
    description: "Crispy burger with fresh vegetables",
    price: 80,
    category: "Snacks",
    preparationTime: 10,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "sandwich",
    name: "Veg Sandwich",
    description: "Fresh grilled sandwich",
    price: 70,
    category: "Meals",
    preparationTime: 8,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "coffee",
    name: "Cold Coffee",
    description: "Chilled creamy cold coffee",
    price: 50,
    category: "Beverages",
    preparationTime: 3,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "momos",
    name: "Veg Momos",
    description: "Steamed momos with spicy chutney",
    price: 80,
    category: "Snacks",
    preparationTime: 10,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "tea",
    name: "Masala Tea",
    description: "Hot aromatic campus chai",
    price: 20,
    category: "Beverages",
    preparationTime: 3,
    cafeId: "central",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=500&q=80",
  },
];

export const demoOrders = [
  {
    id: "A7K",
    cafeId: "central",
    cafeName: "Central Café",
    items: [
      {
        foodId: "maggi",
        name: "Masala Maggi",
        quantity: 1,
        price: 60,
      },
      {
        foodId: "coffee",
        name: "Cold Coffee",
        quantity: 1,
        price: 50,
      },
    ],
    total: 110,
    pickupTime: "4:30 PM",
    createdAt: new Date().toISOString(),
    expiryTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    status: "PREPARING",
    preparationTime: 10,
  },
];

export const notifications = [
  {
    id: 1,
    type: "accepted",
    title: "Order Accepted",
    message: "Order #A7K confirmed.",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "preparing",
    title: "Preparation Started",
    message: "Your order is being prepared.",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "ready",
    title: "Ready for Pickup",
    message: "Order #A7K is ready for pickup.",
    time: "12 minutes ago",
    read: true,
  },
];