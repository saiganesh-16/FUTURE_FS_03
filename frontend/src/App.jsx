import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, MapPin, Phone, Clock, Star, X, ShoppingCart, Moon, Sun, Utensils } from 'lucide-react';
import axios from 'axios';
import './App.css';

function App() {
  // --- THEME ENGINE ---
  const [theme, setTheme] = useState('light');
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // --- STATE MANAGEMENT ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  const [aiStep, setAiStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedDish, setRecommendedDish] = useState(null);
  const [userAnswers, setUserAnswers] = useState({ cuisine: '', time: '', type: '', vibe: '' });

  // --- REFINED DATABASE (With Dietary Tags) ---
  const categories = ['All', 'Breakfast', 'Starters', 'Main Course', 'Biryanis', 'Rice Items', 'Noodles', 'Indian Breads', 'Snacks', 'Beverages', 'Desserts'];
  
  const menuItems = [
    // BREAKFAST
    { id: 101, category: 'Breakfast', title: "Classic English Breakfast", price: 349, diet: 'non-veg', img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop", desc: "Eggs, sausages, beans, and toasted sourdough." },
    { id: 102, category: 'Breakfast', title: "South Indian Platter", price: 199, diet: 'veg', img: "https://as2.ftcdn.net/jpg/05/34/92/27/1000_F_534922770_YSfdxV12F8LOmhEucbH7UQC0RlHYqf27.jpg", desc: "Idli, Vada, and Masala Dosa with Chutneys." },
    { id: 103, category: 'Breakfast', title: "Fluffy Buttermilk Pancakes", price: 249, diet: 'egg', img: "https://thumbs.dreamstime.com/b/fluffy-buttermilk-pancakes-stack-served-fresh-berries-maple-syrup-drizzle-mouthwatering-beautifully-plated-drizzled-377257020.jpg", desc: "Stacked high, served with maple syrup and berries." },
    { id: 104, category: 'Breakfast', title: "Smashed Avocado Toast", price: 299, diet: 'egg', img: "https://realfood.tesco.com/media/images/472x310-SMASHED-AVOCADO-ON-TOAST-BEST-6d287324-c881-44ba-9f3b-af8c771b0e59-0-472x310.jpg", desc: "Artisan sourdough topped with avocado and poached egg." },
    { id: 105, category: 'Breakfast', title: "French Herb Omelette", price: 229, diet: 'egg', img: "https://images.immediate.co.uk/production/volatile/sites/30/2024/01/Cheese-omelette-45155e3.jpg?quality=90&resize=556,505", desc: "Three-egg omelette with Gruyere cheese and chives." },
    { id: 106, category: 'Breakfast', title: "Belgian Waffles", price: 279, diet: 'egg', img: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/FOOD_CATALOG/IMAGES/CMS/2025/4/10/a524cd1d-a120-4a46-89ab-d1ae9cef862e_d672df9f-cec3-4ff0-b762-2b46a6dd6c37.png", desc: "Crispy waffles with whipped cream and chocolate drizzle." },

    // STARTERS
    { id: 201, category: 'Starters', title: "Truffle Parmesan Fries", price: 249, diet: 'veg', img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop", desc: "Crispy fries tossed in truffle oil and aged parmesan." },
    { id: 202, category: 'Starters', title: "Spicy Garlic Prawns", price: 499, diet: 'non-veg', img: "https://images.unsplash.com/photo-1559742811-822873691df8?q=80&w=800&auto=format&fit=crop", desc: "Pan-seared prawns in a buttery chili-garlic sauce." },
    { id: 203, category: 'Starters', title: "Paneer Tikka Skewers", price: 349, diet: 'veg', img: "https://www.shutterstock.com/image-photo/achari-paneer-tikka-tangy-spicy-600nw-2682177011.jpg", desc: "Charcoal-grilled cottage cheese marinated in Indian spices." },
    { id: 204, category: 'Starters', title: "Crispy Fried Calamari", price: 449, diet: 'non-veg', img: "https://images.getrecipekit.com/20240306110906-crispy-20calamari-20with-20lemon-pepper-20aioli-20image-203.jpg?aspect_ratio=16:9&quality=90&", desc: "Golden squid rings served with lemon aioli." },
    { id: 205, category: 'Starters', title: "BBQ Chicken Wings", price: 399, diet: 'non-veg', img: "https://cdn.shopify.com/s/files/1/0555/4585/6045/articles/Bulent_Email_Header-4_657eadaf-1f7c-48d2-b540-9fb14fb88fca.jpg?v=1743144994", desc: "Smoky, sticky, and perfectly charred chicken wings." },
    { id: 206, category: 'Starters', title: "Vegetable Spring Rolls", price: 229, diet: 'veg', img: "https://i2.wp.com/wp-backend.thefearlesscooking.com/wp-content/uploads/2021/10/WhatsApp-Image-2021-10-05-at-8.24.32-PM.jpeg?fit=1338%2C972&ssl=1", desc: "Crispy rolls stuffed with glass noodles and fresh veggies." },

    // MAIN COURSE
    { id: 301, category: 'Main Course', title: "Butter Chicken Masala", price: 399, diet: 'non-veg', img: "https://www.bharatmasala.com/wp-content/uploads/2024/06/buuter-chicken.jpg", desc: "Tender chicken cooked in a rich, creamy tomato gravy." },
    { id: 302, category: 'Main Course', title: "Grilled Atlantic Salmon", price: 899, diet: 'non-veg', img: "https://mealpractice.b-cdn.net/81437508239495168/pan-seared-salmon-with-lemon-butter-sauce-roasted-asparagus-and-garlic-parmesan-quinoa-MQHMeFj2PM.webp", desc: "Served with asparagus and lemon butter sauce." },
    { id: 303, category: 'Main Course', title: "Paneer Butter Masala", price: 349, diet: 'veg', img: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_960,w_960//InstamartAssets/Receipes/cheese_butter_masala.webp", desc: "Cottage cheese cubes in a rich cashew-tomato curry." },
    { id: 304, category: 'Main Course', title: "Ribeye Steak Frites", price: 1099, diet: 'non-veg', img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop", desc: "Premium cut steak cooked to your liking, with crispy fries." },
    { id: 305, category: 'Main Course', title: "Chicken Alfredo Pasta", price: 449, diet: 'non-veg', img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop", desc: "Fettuccine tossed in a rich parmesan and garlic cream sauce." },
    { id: 306, category: 'Main Course', title: "Wild Mushroom Risotto", price: 499, diet: 'veg', img: "https://marleysmenu.com/wp-content/uploads/2020/09/Gourmet-Truffle-Mushroom-Risotto-Featured-Image-1.jpg", desc: "Creamy Arborio rice with truffle oil and porcini mushrooms." },

    // BIRYANIS
    { id: 401, category: 'Biryanis', title: "Hyderabadi Dum Biryani", price: 349, diet: 'non-veg', img: "https://i1.wp.com/www.freshtohome.com/blog/wp-content/uploads/2024/08/Biryani.jpeg?w=1344&ssl=1", desc: "Authentic slow-cooked chicken biryani with raita." },
    { id: 402, category: 'Biryanis', title: "Lucknowi Mutton Biryani", price: 499, diet: 'non-veg', img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?q=80&w=800&auto=format&fit=crop", desc: "Aromatic Awadhi style biryani with tender mutton." },
    { id: 403, category: 'Biryanis', title: "Veg Dum Biryani", price: 299, diet: 'veg', img: "https://hogr.app/blog/wp-content/uploads/2022/10/1606114982_HyderabadiVeg.jpg", desc: "Fragrant basmati cooked with mixed seasonal vegetables." },
    { id: 404, category: 'Biryanis', title: "Coastal Prawn Biryani", price: 549, diet: 'non-veg', img: "https://i.pinimg.com/736x/b8/0b/ef/b80bef4880ab2f36be6098e75ea51e0f.jpg", desc: "Spicy coastal flavors tossed with fresh prawns and rice." },
    { id: 405, category: 'Biryanis', title: "Paneer Tikka Biryani", price: 329, diet: 'veg', img: "https://orders.popskitchen.in/storage/2024/09/image-285.png", desc: "Smoky paneer chunks layered with spiced saffron rice." },
    { id: 406, category: 'Biryanis', title: "Special Egg Biryani", price: 279, diet: 'egg', img: "https://media.istockphoto.com/id/979967968/photo/egg-biryani-basmati-rice-cooked-with-masala-roasted-eggs-and-spices-and-served-with-yogurt.jpg?s=612x612&w=0&k=20&c=BFn00VXEj0S2bC6SbB-J1SFYzSzzKAMJWUtZyam127g=", desc: "Roasted boiled eggs cooked in a spicy biryani masala." },

    // RICE ITEMS
    { id: 501, category: 'Rice Items', title: "Wok-Tossed Fried Rice", price: 229, diet: 'veg', img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop", desc: "Classic Asian fried rice with crunchy vegetables." },
    { id: 502, category: 'Rice Items', title: "Jeera Rice", price: 149, diet: 'veg', img: "https://lentillovingfamily.com/wp-content/uploads/2025/08/jeera-rice-1.jpg", desc: "Aromatic basmati rice tempered with roasted cumin." },
    { id: 503, category: 'Rice Items', title: "Lemon Rice", price: 129, diet: 'veg', img: "https://t3.ftcdn.net/jpg/04/29/25/72/360_F_429257288_Vjw9XLVCg7AacMNgfvmM2uCBb5xZxZ0J.jpg", desc: "Tangy South Indian rice dish with peanuts and curry leaves." },
    { id: 504, category: 'Rice Items', title: "Curd Rice", price: 149, diet: 'veg', img: "https://kohinoor-joy.com/wp-content/uploads/2020/08/curd-rice-recipe.jpg", desc: "Cooling yogurt rice tempered with mustard seeds." },
    { id: 505, category: 'Rice Items', title: "Schezwan Chicken Rice", price: 279, diet: 'non-veg', img: "https://www.maggi.in/sites/default/files/styles/home_stage_1500_700/public/srh_recipes/f6f14791459d6873db11a54ee5deea60.jpg?h=bfe0b221&itok=JAFLAlz-p", desc: "Spicy Indo-Chinese fried rice with chicken chunks." },
    { id: 506, category: 'Rice Items', title: "Green Peas Pulao", price: 179, diet: 'veg', img: "https://www.indianveggiedelight.com/wp-content/uploads/2017/10/instant-pot-green-peas-pulao-featured.jpg", desc: "Mildly spiced rice cooked with sweet green peas." },

    // NOODLES
    { id: 601, category: 'Noodles', title: "Spicy Hakka Noodles", price: 229, diet: 'veg', img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=800&auto=format&fit=crop", desc: "Wok-tossed noodles with fresh veggies and chili." },
    { id: 602, category: 'Noodles', title: "Authentic Pad Thai", price: 349, diet: 'veg', img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800&auto=format&fit=crop", desc: "Rice noodles with peanuts, tofu, and tamarind sauce." },
    { id: 603, category: 'Noodles', title: "Chilli Garlic Noodles", price: 249, diet: 'veg', img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=800&auto=format&fit=crop", desc: "Extra spicy noodles tossed in fiery garlic oil." },
    { id: 604, category: 'Noodles', title: "Singapore Rice Noodles", price: 279, diet: 'veg', img: "https://thedomesticman.com/wp-content/uploads/2017/12/53-singapore-rice-noodles.jpg", desc: "Vermicelli noodles flavored with yellow curry powder." },
    { id: 605, category: 'Noodles', title: "Udon Noodle Soup", price: 399, diet: 'veg', img: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop", desc: "Thick Japanese noodles in a rich umami broth." },
    { id: 606, category: 'Noodles', title: "Chicken Chow Mein", price: 299, diet: 'non-veg', img: "https://luckyboatnoodles.co.uk/wp-content/uploads/2020/03/Chow-mein_new.png", desc: "Classic stir-fried noodles with chicken and soy sauce." },

    // INDIAN BREADS
    { id: 701, category: 'Indian Breads', title: "Butter Naan", price: 69, diet: 'veg', img: "https://t4.ftcdn.net/jpg/17/15/16/93/360_F_1715169355_cAjyCT1V26tJbHqmlqqXT8rKNgRvFiHk.jpg", desc: "Soft tandoori bread brushed with clarified butter." },
    { id: 702, category: 'Indian Breads', title: "Garlic Naan", price: 89, diet: 'veg', img: "https://media.istockphoto.com/id/1143530040/photo/indian-naan-bread-with-garlic-butter-on-wooden-table.jpg?s=612x612&w=0&k=20&c=71SgbJtnfiHUiud1oGxnhiZsx5nuivWwZt8DlIk8hi0=", desc: "Naan topped with minced garlic and fresh cilantro." },
    { id: 703, category: 'Indian Breads', title: "Tandoori Roti", price: 49, diet: 'veg', img: "https://img.freepik.com/premium-photo/indian-cuisine-tandoori-roti-wooden-background_55610-461.jpg", desc: "Whole wheat bread baked in a traditional clay oven." },
    { id: 704, category: 'Indian Breads', title: "Lachha Paratha", price: 79, diet: 'veg', img: "https://www.whiskaffair.com/wp-content/uploads/2020/06/Lachha-Paratha-2-3.jpg", desc: "Multi-layered, crispy, and flaky whole wheat bread." },
    { id: 705, category: 'Indian Breads', title: "Cheese Stuffed Naan", price: 129, diet: 'veg', img: "https://media.istockphoto.com/id/2160723525/photo/tarragon-chicken-stuffed-naan-bread.jpg?s=612x612&w=0&k=20&c=gEI_ikWslpnQ3aq5CmUNmZNDBea_8eZKzQeZ3-2JqoI=", desc: "Indulgent bread stuffed with melting mozzarella." },
    { id: 706, category: 'Indian Breads', title: "Roomali Roti", price: 59, diet: 'veg', img: "https://www.greenchickchop.in/cdn/shop/files/RumaliRoti_result.webp?v=1682660083", desc: "Paper-thin soft bread, perfect for rich gravies." },

    // SNACKS
    { id: 801, category: 'Snacks', title: "Punjabi Samosa (2pcs)", price: 99, diet: 'veg', img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop", desc: "Crispy pastry stuffed with spiced potatoes and peas." },
    { id: 802, category: 'Snacks', title: "Mumbai Pav Bhaji", price: 179, diet: 'veg', img: "https://bhojmasale.com/cdn/shop/articles/bombay-style-pav-bhaji-recipe-733306_1024x1024.webp?v=1739152980", desc: "Spicy vegetable mash served with buttered buns." },
    { id: 803, category: 'Snacks', title: "Loaded Cheese Nachos", price: 249, diet: 'veg', img: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=800&auto=format&fit=crop", desc: "Tortilla chips smothered in cheese sauce and jalapenos." },
    { id: 804, category: 'Snacks', title: "Mini Chicken Sliders", price: 299, diet: 'non-veg', img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", desc: "Three bite-sized burgers with spicy mayo." },
    { id: 805, category: 'Snacks', title: "Tomato Basil Bruschetta", price: 199, diet: 'veg', img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?q=80&w=800&auto=format&fit=crop", desc: "Toasted baguette topped with fresh tomatoes and herbs." },
    { id: 806, category: 'Snacks', title: "Crispy Onion Rings", price: 149, diet: 'veg', img: "https://www.homecookingadventure.com/wp-content/uploads/2022/05/onion_rings_main2.webp", desc: "Beer-battered onion rings with a tangy dip." },

    // BEVERAGES
    { id: 901, category: 'Beverages', title: "Artisan Iced Latte", price: 199, diet: 'veg', img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop", desc: "Premium espresso poured over ice and milk." },
    { id: 902, category: 'Beverages', title: "Virgin Mint Mojito", price: 149, diet: 'veg', img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop", desc: "Refreshing blend of mint, lime, and sparkling water." },
    { id: 903, category: 'Beverages', title: "Classic Cappuccino", price: 179, diet: 'veg', img: "https://img.freepik.com/free-photo/cup-cappuccino-with-latte-art-cinnamon-sticks-rustic-surface_9975-124635.jpg?semt=ais_hybrid&w=740&q=80", desc: "Rich espresso topped with velvety steamed milk foam." },
    { id: 904, category: 'Beverages', title: "Fresh Lime Soda", price: 99, diet: 'veg', img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop", desc: "Sweet or salted, the ultimate thirst quencher." },
    { id: 905, category: 'Beverages', title: "Tropical Mango Smoothie", price: 229, diet: 'veg', img: "https://media.istockphoto.com/id/904617420/photo/fresh-mango-smoothie-in-the-glass.jpg?s=612x612&w=0&k=20&c=ogIRn5AfahJNU4W8UmQIZ-mJqL9tgOm9yH_-5WJmkSQ=", desc: "Thick, creamy blend of fresh Alphonso mangoes." },
    { id: 906, category: 'Beverages', title: "Hazelnut Cold Coffee", price: 249, diet: 'veg', img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop", desc: "Blended iced coffee with a shot of hazelnut syrup." },

    // DESSERTS
    { id: 1001, category: 'Desserts', title: "Dark Chocolate Lava Cake", price: 299, diet: 'egg', img: "https://images.getrecipekit.com/20250325120225-how-20to-20make-20chocolate-20molten-20lava-20cake-20in-20the-20microwave.png?width=650&quality=90&", desc: "Warm molten chocolate center with vanilla ice cream." },
    { id: 1002, category: 'Desserts', title: "Classic Italian Tiramisu", price: 349, diet: 'egg', img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=800&auto=format&fit=crop", desc: "Coffee-soaked ladyfingers layered with mascarpone." },
    { id: 1003, category: 'Desserts', title: "New York Cheesecake", price: 399, diet: 'egg', img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop", desc: "Rich, dense baked cheesecake with a berry compote." },
    { id: 1004, category: 'Desserts', title: "Sizzling Brownie", price: 279, diet: 'egg', img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800&auto=format&fit=crop", desc: "Served on a hot plate with melting chocolate sauce." },
    { id: 1005, category: 'Desserts', title: "Warm Gulab Jamun (2pcs)", price: 149, diet: 'veg', img: "https://133309359.cdn6.editmysite.com/uploads/1/3/3/3/133309359/VUGI5REHBAQJFGIYDDLJFXMQ.png", desc: "Deep-fried milk dumplings soaked in cardamom syrup." },
    { id: 1006, category: 'Desserts', title: "Vanilla Bean Panna Cotta", price: 329, diet: 'veg', img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop", desc: "Silky Italian dessert topped with fresh passionfruit." }
  ];

  const filteredMenu = activeCategory === 'All' ? menuItems : menuItems.filter(item => item.category === activeCategory);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop"
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => { setCurrentSlide((prev) => (prev + 1) % backgroundImages.length); }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  // --- SMART AI DISH SELECTOR LOGIC ---
  const handleAiAnswer = (answer, step) => {
    if (step === 0) setAiStep(1);
    else if (step === 1) { setUserAnswers({ ...userAnswers, cuisine: answer }); setAiStep(2); }
    else if (step === 2) { setUserAnswers({ ...userAnswers, time: answer }); setAiStep(3); }
    else if (step === 3) { setUserAnswers({ ...userAnswers, type: answer }); setAiStep(4); }
    else if (step === 4) {
      setUserAnswers({ ...userAnswers, vibe: answer });
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setIsAnalyzing(false); 
        setAiStep(5);
        
        const { cuisine, time, type } = userAnswers;
        let rec = null;

        if (time === 'Breakfast') rec = menuItems.find(i => i.id === 101);
        if (time === 'Late Night Snack') rec = menuItems.find(i => i.id === 803);

        if (!rec && type === 'Dessert') rec = menuItems.find(i => i.id === 1001);
        if (!rec && type === 'Beverage') rec = menuItems.find(i => i.id === 902);
        if (!rec && type === 'Starter') rec = menuItems.find(i => i.id === 201);

        if (!rec && type === 'Main Course') {
          if (cuisine === 'Indian') rec = menuItems.find(i => i.id === 301);
          else if (cuisine === 'Asian') rec = menuItems.find(i => i.id === 601);
          else if (cuisine === 'Italian') rec = menuItems.find(i => i.id === 305);
          else if (cuisine === 'Continental') rec = menuItems.find(i => i.id === 304);
        }

        if (!rec) rec = menuItems.find(i => i.id === 401);
        setRecommendedDish(rec);
      }, 1500);
    }
  };

  // --- E-COMMERCE LOGIC ---
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)); 
    else setCart([...cart, { ...product, qty: 1 }]);
    setIsCartOpen(true); setIsCheckout(false);
  };

  const updateQty = (id, amount) => { setCart(cart.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0)); };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const externalCharges = subtotal > 0 ? 20 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% Restaurant GST
  const grandTotal = subtotal + deliveryFee + externalCharges + gst;

  // --- BACKEND CONNECTIONS ---
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        customerName: e.target[0].value, email: e.target[1].value, phone: e.target[2].value, address: e.target[3].value,
        cartItems: cart.map(item => ({ title: item.title, price: item.price, qty: item.qty })), totalAmount: grandTotal
      };
      await axios.post('https://lumina-backend-h4n7.onrender.com/api/orders', orderData);
      alert("Order successfully placed!");
      setCart([]); setIsCartOpen(false); setIsCheckout(false);
    } catch (error) { alert("Error connecting to backend server."); }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        name: e.target[0].value, email: e.target[1].value, phone: e.target[2].value, timeSlot: e.target[3].value, guests: e.target[4].value
      };
      await axios.post('https://lumina-backend-h4n7.onrender.com/api/reservations', bookingData);
      alert("Table reserved successfully!");
      setIsBookingOpen(false);
    } catch (error) { alert("Error connecting to backend server."); }
  };

  return (
    <div>
      {/* --- NAVIGATION --- */}
      <nav className="full-width" style={{ padding: '15px 0', background: 'var(--nav-bg)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-soft)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--primary)' }}>
            AURA <span style={{ fontWeight: 400, color: 'var(--text-main)' }}>BISTRO</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a href="#services" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Services</a>
            <a href="#menu" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 500 }}>Order</a>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={18} /> {cart.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>{cart.length}</span>}
            </button>
            <button className="btn-primary" onClick={() => setIsBookingOpen(true)}>Book a Table</button>
          </div>
        </div>
      </nav>

      {/* --- SLIDE-OUT CART WIDGET --- */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{isCheckout ? 'Secure Checkout' : 'Your Order'}</h2>
              <button className="close-btn" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>
            {!isCheckout && (
              <>
                <div className="cart-body">
                  {cart.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '50px' }}>Your cart is empty.</p> : cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.img} alt={item.title} />
                      <div className="cart-item-info">
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {item.title}
                          {/* DIET DOT IN CART */}
                          <span title={item.diet === 'veg' ? 'Vegetarian' : item.diet === 'egg' ? 'Contains Egg' : 'Non-Vegetarian'} style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.diet === 'veg' ? '#16a34a' : item.diet === 'egg' ? '#eab308' : '#78350f' }}></span>
                        </div>
                        <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{item.price}</div>
                        <div className="qty-controls"><button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button><span>{item.qty}</span><button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button></div>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="cart-footer">
                    <div className="bill-row"><span>Item Total</span><span>₹{subtotal}</span></div>
                    <div className="bill-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
                    <div className="bill-row"><span>Restaurant Charges</span><span>₹{externalCharges}</span></div>
                    <div className="bill-row"><span>GST (5%)</span><span>₹{gst}</span></div>
                    <div className="bill-total"><span>Grand Total</span><span>₹{grandTotal}</span></div>
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '15px' }} onClick={() => setIsCheckout(true)}>Proceed to Checkout</button>
                  </div>
                )}
              </>
            )}
            {isCheckout && (
              <div className="cart-body" style={{ overflowY: 'auto' }}>
                <form onSubmit={handleCheckoutSubmit}>
                  <div className="form-group"><label>Full Name</label><input type="text" required placeholder="John Doe" /></div>
                  <div className="form-group"><label>Email</label><input type="email" required placeholder="john@example.com" /></div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" required placeholder="+91 90000 00000" /></div>
                  <div className="form-group"><label>Delivery Address</label><textarea required rows="3" placeholder="House No, Street, Landmark"></textarea></div>
                  <div className="cart-footer" style={{ margin: '20px -25px -25px -25px' }}>
                    <div className="bill-total" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}><span>Amount to Pay:</span><span>₹{grandTotal}</span></div>
                    <button type="button" className="btn-outline" style={{ width: '100%', marginBottom: '10px', padding: '12px' }} onClick={() => setIsCheckout(false)}>Back to Cart</button>
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Place Order</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TABLE BOOKING MODAL --- */}
      {isBookingOpen && (
        <div className="modal-overlay" onClick={() => setIsBookingOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsBookingOpen(false)}><X size={24} /></button>
            <h2 className="serif-text" style={{ fontSize: '2rem', marginBottom: '10px' }}>Reserve a Table</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Experience fine dining at Visakhapatnam's premier bistro.</p>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group"><label>Full Name</label><input type="text" required placeholder="John Doe" /></div>
              <div className="form-group"><label>Email Address</label><input type="email" required placeholder="john@example.com" /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" required placeholder="+91 90000 00000" /></div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1 }}><label>Time Slot</label><select><option>7:00 PM</option><option>8:00 PM</option><option>9:00 PM</option></select></div>
                <div className="form-group" style={{ flex: 1 }}><label>Guests</label><select><option>2 People</option><option>4 People</option><option>6+ People</option></select></div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Secure Your Table</button>
            </form>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="hero full-width">
        {backgroundImages.map((img, index) => ( <img key={index} src={img} alt="Restaurant Vibe" className={`hero-slide ${index === currentSlide ? 'active' : ''}`} /> ))}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Savor the Extraordinary.</h1>
          <p>A symphony of global flavors crafted with local passion. Welcome to Visakhapatnam's ultimate culinary destination.</p>
          <button className="btn-primary" onClick={() => setIsBookingOpen(true)}>Secure Your Table</button>
        </div>
      </section>

      {/* --- AI DISH SELECTOR --- */}
      <div className="full-width ai-widget-wrapper">
        <div className="container ai-widget">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <div className="ai-pulse"></div><h3 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>Aura AI Sommelier</h3>
          </div>
          {aiStep === 0 && (<div style={{ animation: 'fadeUp 0.5s ease-out' }}><h2 className="serif-text" style={{ fontSize: '2.2rem', marginBottom: '16px' }}>Undecided on what to eat?</h2><p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>Let our AI curate the perfect dish based on your cravings, vibe, and time of day.</p><button className="btn-primary" onClick={() => handleAiAnswer('start', 0)}><Utensils size={18} /> Find My Perfect Dish</button></div>)}
          {aiStep === 1 && (<div style={{ animation: 'fadeUp 0.5s ease-out' }}><h2 className="serif-text" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>What cuisine are you craving?</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>{['Indian', 'Asian', 'Continental', 'Italian'].map(opt => (<button key={opt} className="btn-outline" onClick={() => handleAiAnswer(opt, 1)}>{opt}</button>))}</div></div>)}
          {aiStep === 2 && (<div style={{ animation: 'fadeUp 0.5s ease-out' }}><h2 className="serif-text" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>What time of day is it?</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>{['Breakfast', 'Lunch', 'Dinner', 'Late Night Snack'].map(opt => (<button key={opt} className="btn-outline" onClick={() => handleAiAnswer(opt, 2)}>{opt}</button>))}</div></div>)}
          {aiStep === 3 && (<div style={{ animation: 'fadeUp 0.5s ease-out' }}><h2 className="serif-text" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>What type of dish?</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>{['Starter', 'Main Course', 'Dessert', 'Beverage'].map(opt => (<button key={opt} className="btn-outline" onClick={() => handleAiAnswer(opt, 3)}>{opt}</button>))}</div></div>)}
          {aiStep === 4 && (<div style={{ animation: 'fadeUp 0.5s ease-out' }}><h2 className="serif-text" style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Who are you dining with?</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>{['Date Night', 'Family Gathering', 'Solo Dining', 'Business Lunch'].map(opt => (<button key={opt} className="btn-outline" onClick={() => handleAiAnswer(opt, 4)}>{opt}</button>))}</div></div>)}
          
          {isAnalyzing && (<div style={{ textAlign: 'center', padding: '40px 0' }}><Sparkles size={40} color="var(--primary)" style={{ animation: 'pulse 1.5s infinite', margin: '0 auto 16px' }} /><h2 className="serif-text" style={{ fontSize: '1.5rem' }}>Curating your culinary experience...</h2></div>)}
          
          {aiStep === 5 && recommendedDish && (
            <div style={{ animation: 'fadeUp 0.5s ease-out', background: 'var(--bg-main)', padding: '30px', borderRadius: '12px', border: `1px solid var(--primary)` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}><CheckCircle color="var(--primary)" size={24} /> <h2 className="serif-text" style={{ fontSize: '1.5rem', margin: 0 }}>The Perfect Choice</h2></div>
              <img src={recommendedDish.img} alt={recommendedDish.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }} />
              
              {/* DIET DOT IN AI CARD */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <h3 className="serif-text" style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: 0 }}>{recommendedDish.title}</h3>
                <span title={recommendedDish.diet === 'veg' ? 'Vegetarian' : recommendedDish.diet === 'egg' ? 'Contains Egg' : 'Non-Vegetarian'} style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: recommendedDish.diet === 'veg' ? '#16a34a' : recommendedDish.diet === 'egg' ? '#eab308' : '#78350f', border: '1px solid rgba(0,0,0,0.1)' }}></span>
              </div>
              
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{recommendedDish.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button className="btn-primary" onClick={() => addToCart(recommendedDish)}>Add to Cart - ₹{recommendedDish.price}</button>
                <button className="btn-outline" onClick={() => {setAiStep(0); setRecommendedDish(null);}}>Retake</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- ABOUT US SECTION (NEW) --- */}
      <section className="section container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
          {/* Image Column */}
          <div style={{ flex: '1 1 400px', position: 'relative', padding: '20px 0 20px 20px' }}>
            {/* The offset shadow backdrop that mimics your reference image */}
            <div style={{ position: 'absolute', top: 0, bottom: '40px', left: 0, right: '40px', backgroundColor: 'var(--primary)', opacity: 0.1, borderRadius: '24px', zIndex: 0 }}></div>
            <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop" alt="Aura Bistro Chefs" style={{ position: 'relative', zIndex: 1, width: '100%', height: '450px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-hover)' }} />
          </div>
          
          {/* Text Column */}
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '15px' }}>Who We Are</div>
            <h2 className="serif-text" style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '25px', color: 'var(--text-main)' }}>
              A Legacy of <br/><span style={{ color: 'var(--primary)' }}>Exceptional Flavour</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '20px' }}>
              Established in Visakhapatnam, Aura Bistro was founded on a timeless belief — that exceptional cuisine, the finest fresh ingredients, and a hint of Vizag’s charm can elevate every dining experience into something truly memorable.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '40px' }}>
              At Aura Bistro, our kitchen is driven by curiosity and creativity. Every dish begins with a thoughtful pursuit — to honor classic multi-cuisine techniques while reimagining them with a distinct and contemporary touch.
            </p>
            
            {/* Stats Row */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '5px' }}>3+</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Years of Excellence</div>
              </div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '5px' }}>25+</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Expert Chefs</div>
              </div>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '5px' }}>5k+</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Guests</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PREMIUM DINING SERVICES --- */}
      <section id="services" className="section container" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header"><h2 className="serif-text">Premium Dining Experiences</h2><p>Elevate your celebrations with our bespoke hospitality services.</p></div>
        <div className="flip-grid">
          {[
            { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", title: "Rooftop Cabanas", price: "Romantic Dining", desc: "Private cabana setup under the stars with a dedicated butler and customized 5-course tasting menu." },
            { img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop", title: "Event Catering", price: "Corporate & Weddings", desc: "Bring the Aura experience to your venue with our elite live cooking stations and mixologists." },
            { img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop", title: "Chef's Tasting Table", price: "Exclusive Experience", desc: "Sit right next to the open kitchen and let our Executive Chef surprise you with off-menu creations." }
          ].map((srv, i) => (
            <div className="flip-card" key={i}>
              <div className="flip-card-inner">
                <div className="flip-card-front"><img src={srv.img} alt={srv.title} /><h3 className="serif-text">{srv.title}</h3><p style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '10px' }}>Hover to Explore</p></div>
                <div className="flip-card-back"><h3 className="serif-text" style={{ color: 'var(--primary)', marginBottom: '15px' }}>{srv.price}</h3><p style={{ marginBottom: '20px' }}>{srv.desc}</p><button className="btn-primary" onClick={() => setIsBookingOpen(true)}>Inquire Now</button></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- MASSIVE DYNAMIC MENU --- */}
      <section id="menu" className="section container" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header"><h2 className="serif-text">Explore Our Menu</h2><p>From sizzling starters to decadent desserts, order your favorites directly to your table or home.</p></div>
        
        {/* Filter Buttons */}
        <div className="category-filters">
          {categories.map(cat => (
            <button key={cat} className={`category-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredMenu.map((item) => (
            <div className="menu-item" key={item.id}>
              <img src={item.img} alt={item.title} />
              <div className="menu-info">
                
                {/* DIET DOT IN MENU GRID */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                  <span title={item.diet === 'veg' ? 'Vegetarian' : item.diet === 'egg' ? 'Contains Egg' : 'Non-Vegetarian'} style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.diet === 'veg' ? '#16a34a' : item.diet === 'egg' ? '#eab308' : '#78350f', flexShrink: 0, marginLeft: '10px', border: '1px solid rgba(0,0,0,0.1)' }}></span>
                </div>

                <p className="menu-desc">{item.desc}</p>
                <div className="menu-bottom">
                  <span className="menu-price">₹{item.price}</span>
                  <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }} onClick={() => addToCart(item)}>Add +</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEEDBACK SUMMARIZER --- */}
      <section className="section container" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="section-header"><h2 className="serif-text">Guest Testimonials</h2><p>See what Visakhapatnam is saying about Aura Bistro.</p></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {[
            { text: "The Truffle Fries and Butter Chicken are out of this world. The AI recommended the exact perfect dessert for our date night!", name: "Rahul S.", location: "MVP Colony" },
            { text: "The delivery was so fast and the packaging was premium. Felt like fine dining right in my living room.", name: "Priya V.", location: "Rushikonda" },
            { text: "Hosted my wife's birthday in the Rooftop Cabana. The staff, the food, and the ambiance were a 10/10 experience.", name: "Arjun M.", location: "Madhurawada" }
          ].map((review, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex' }}><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /><Star fill="currentColor" size={18} /></div>
              <p style={{ fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.6' }}>"{review.text}"</p>
              <h4 style={{ fontWeight: 600 }}>{review.name}</h4><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{review.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FORMSPREE SUPPORT DESK --- */}
      <section className="full-width support-section" style={{ background: 'var(--bg-card)', padding: '60px 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '30px' }}><h2 className="serif-text">We Value Your Feedback</h2><p>Tell us about your Aura Bistro experience.</p></div>
          <form className="support-form" action="https://formspree.io/f/mgongbbq" method="POST" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="form-group"><label>Your Name</label><input type="text" name="name" required placeholder="John Doe" /></div>
            <div className="form-group"><label>Email Address</label><input type="email" name="email" required placeholder="john@example.com" /></div>
            <div className="form-group"><label>Feedback / Suggestions</label><textarea name="message" rows="4" required placeholder="How was the food and service?"></textarea></div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* --- FOOTER & MAP --- */}
      <footer id="contact" className="full-width" style={{ background: '#111827', color: 'white', padding: '80px 0 40px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '60px', marginBottom: '40px', alignItems: 'start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.8rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#E67E22', letterSpacing: '1px', marginBottom: '20px' }}>
              AURA <span style={{ fontWeight: 400, color: 'white' }}>BISTRO</span>
            </div>
            <p style={{ color: '#9CA3AF', maxWidth: '320px', lineHeight: 1.6, margin: 0 }}>Visakhapatnam's premier destination for global cuisine and fine dining.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'white' }}>Visit Us</h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', color: '#9CA3AF' }}><MapPin size={22} color="#E67E22" style={{ flexShrink: 0, marginTop: '2px' }} /> <span style={{ lineHeight: 1.5 }}>Near Panorama Hills<br/>Madhurawada, Visakhapatnam, AP</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9CA3AF' }}><Phone size={20} color="#E67E22" style={{ flexShrink: 0 }} /> <span>+91 98765 43210</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9CA3AF' }}><Clock size={20} color="#E67E22" style={{ flexShrink: 0 }} /> <span>Mon-Sun: 11:00 AM - 11:00 PM</span></div>
          </div>
          <div style={{ width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: '1px solid rgba(230, 126, 34, 0.2)' }}>
            <iframe title="Restaurant Location" src="https://maps.google.com/maps?q=Panorama+Hills,+Madhurawada,+Visakhapatnam&t=&z=14&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>© 2026 Aura Bistro & Cafe Visakhapatnam. Developed by [Your Name].</div>
      </footer>
    </div>
  );
}

export default App;