const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const img = (label) =>
  `https://placehold.co/400x400/F7F6F1/1B2B22?font=roboto&text=${encodeURIComponent(label)}`;

const PRODUCTS = [
  {
    id: "olpers-milk-1l",
    name: "Olper's Milk 1L",
    category: "dairy-eggs",
    subCategory: "milk",
    price: 320,
    unit: "1 Litre",
    stock: 40,
    image: img("Olper's Milk"),
  },
  {
    id: "nestle-milk-1-5l",
    name: "Nestlé Fresh Milk 1.5L",
    category: "dairy-eggs",
    subCategory: "milk",
    price: 430,
    unit: "1.5 Litre",
    stock: 25,
    image: img("Nestlé Milk"),
  },
  {
    id: "meri-farm-butter-200g",
    name: "Meri Farm Butter 200g",
    category: "dairy-eggs",
    subCategory: "butter-cheese",
    price: 480,
    unit: "200g",
    stock: 15,
    image: img("Meri Farm Butter"),
  },
  {
    id: "nurpur-cheese-slices-200g",
    name: "Nurpur Cheese Slices 200g",
    category: "dairy-eggs",
    subCategory: "butter-cheese",
    price: 450,
    unit: "200g",
    stock: 0,
    image: img("Nurpur Cheese"),
  },
  {
    id: "lipton-yellow-label-475g",
    name: "Lipton Yellow Label Tea 475g",
    category: "beverages",
    subCategory: "tea-coffee",
    price: 950,
    unit: "475g",
    stock: 20,
    image: img("Lipton Tea"),
  },
  {
    id: "tapal-danedar-475g",
    name: "Tapal Danedar 475g",
    category: "beverages",
    subCategory: "tea-coffee",
    price: 980,
    unit: "475g",
    stock: 18,
    image: img("Tapal Danedar"),
  },
  {
    id: "national-ketchup-800g",
    name: "National Tomato Ketchup 800g",
    category: "pantry",
    subCategory: "sauces-spreads",
    price: 410,
    unit: "800g",
    stock: 22,
    image: img("National Ketchup"),
  },
  {
    id: "dalda-cooking-oil-1l",
    name: "Dalda Cooking Oil 1L",
    category: "pantry",
    subCategory: "cooking-oil",
    price: 650,
    unit: "1 Litre",
    stock: 12,
    image: img("Dalda Oil"),
  },
  {
    id: "lays-masala-40g",
    name: "Lay's Masala Chips 40g",
    category: "snacks-munchies",
    subCategory: "chips",
    price: 60,
    unit: "40g",
    stock: 100,
    image: img("Lay's Masala"),
  },
  {
    id: "peek-freans-sooper",
    name: "Peek Freans Sooper Biscuits",
    category: "snacks-munchies",
    subCategory: "biscuits",
    price: 130,
    unit: "148g",
    stock: 50,
    image: img("Sooper Biscuits"),
  },
  {
    id: "fresh-bananas-dozen",
    name: "Fresh Bananas (Dozen)",
    category: "fruits-vegetables",
    subCategory: "fresh-fruits",
    price: 220,
    unit: "1 Dozen",
    stock: 35,
    image: img("Fresh Bananas"),
  },
  {
    id: "fresh-tomatoes-1kg",
    name: "Fresh Tomatoes 1kg",
    category: "fruits-vegetables",
    subCategory: "fresh-vegetables",
    price: 180,
    unit: "1kg",
    stock: 40,
    image: img("Fresh Tomatoes"),
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateOrderId() {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${random}`;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET / — health check / sanity route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Quickmart API is running",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/products — optional ?category= and ?subCategory= filter
app.get("/api/products", (req, res) => {
  const { category, subCategory } = req.query;

  let filtered = PRODUCTS;

  if (category) {
    const catLower = String(category).toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.category.toLowerCase() === catLower ||
        product.category.toLowerCase().replace(/[^a-z]/g, "") === catLower.replace(/[^a-z]/g, "")
    );
  }

  if (subCategory) {
    const subCatLower = String(subCategory).toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.subCategory &&
        product.subCategory.toLowerCase() === subCatLower
    );
  }

  res.status(200).json({ count: filtered.length, products: filtered });
});

// POST /api/orders — create an order
app.post("/api/orders", (req, res) => {
  const { items, customerDetails, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "`items` must be a non-empty array of { id, quantity, price }.",
    });
  }

  const invalidItem = items.find(
    (item) =>
      !item ||
      typeof item.id === "undefined" ||
      typeof item.quantity !== "number" ||
      item.quantity <= 0 ||
      typeof item.price !== "number" ||
      item.price < 0
  );

  if (invalidItem) {
    return res.status(400).json({
      status: "error",
      message: "Each item requires a valid `id`, positive `quantity`, and non-negative `price`.",
    });
  }

  if (!customerDetails || !customerDetails.name || !customerDetails.address || !customerDetails.phone) {
    return res.status(400).json({
      status: "error",
      message: "`customerDetails` requires `name`, `address`, and `phone`.",
    });
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = {
    orderId: generateOrderId(),
    timestamp: new Date().toISOString(),
    items,
    customerDetails,
    paymentMethod: paymentMethod || "COD",
    totalAmount,
    deliveryETA: "20-30 mins",
    status: "confirmed",
  };

  res.status(201).json(order);
});

// 404 fallback for anything else
app.use((req, res) => {
  res.status(404).json({ status: "error", message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

// Run locally with `node api/index.js` (Vercel ignores this — it imports `app` directly)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Quickmart API listening on http://localhost:${PORT}`));
}

module.exports = app;
