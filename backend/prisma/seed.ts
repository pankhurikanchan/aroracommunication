import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Arora Communication database...');

  // 1. Clear existing data in reverse dependency order
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.wishlist.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const customerPassword = await bcrypt.hash('Customer@123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@aroracommunication.com',
      password: adminPassword,
      name: 'Arora Admin',
      phone: '+91 98765 43210',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Rahul Sharma',
      phone: '+91 98111 22334',
      role: 'CUSTOMER',
    },
  });

  // Create Saved Address for Customer
  const customerAddress = await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Rahul Sharma',
      phone: '+91 98111 22334',
      email: 'customer@example.com',
      addressLine: 'Flat 402, Royal Residency, Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201301',
      isDefault: true,
    },
  });

  // 3. Create Categories
  const categoriesData = [
    { name: 'Smartphones', slug: 'smartphones', description: 'Latest 5G and 4G smartphones from top global brands' },
    { name: 'iPhones', slug: 'iphones', description: 'Apple iPhone series with iOS innovation and A-series Bionic chips' },
    { name: 'Android Phones', slug: 'android-phones', description: 'Flagship and budget Android devices with high refresh screens' },
    { name: 'Tablets', slug: 'tablets', description: 'iPads and Android tablets for work, study and entertainment' },
    { name: 'Laptops', slug: 'laptops', description: 'High-performance ultrabooks, gaming laptops, and MacBooks' },
    { name: 'Smartwatches', slug: 'smartwatches', description: 'Fitness trackers, AMOLED smartwatches and Apple Watch' },
    { name: 'Earphones', slug: 'earphones', description: 'True wireless stereo earbuds with Active Noise Cancellation' },
    { name: 'Headphones', slug: 'headphones', description: 'Over-ear and on-ear wireless high-fidelity headphones' },
    { name: 'Chargers', slug: 'chargers', description: 'GaN fast chargers, wireless charging pads, and adapters' },
    { name: 'Power Banks', slug: 'power-banks', description: 'High-capacity 10000mAh to 30000mAh fast charge power banks' },
    { name: 'Cables', slug: 'cables', description: 'Braided USB-C, Lightning, and Thunderbolt high-speed cables' },
    { name: 'Mobile Covers', slug: 'mobile-covers', description: 'Shockproof, leather, and magsafe protective phone cases' },
    { name: 'Screen Protectors', slug: 'screen-protectors', description: '9H tempered glass, matte, and privacy screen guards' },
    { name: 'Speakers', slug: 'speakers', description: 'Portable Bluetooth party speakers and smart home audio' },
    { name: 'Accessories', slug: 'accessories', description: 'Car mounts, OTG adapters, tripods, and tech essentials' },
    { name: 'Electronics', slug: 'electronics', description: 'Smart TVs, streaming sticks, and computer peripherals' },
  ];

  const categoryMap = new Map<string, any>();
  for (let i = 0; i < categoriesData.length; i++) {
    const cat = await prisma.category.create({
      data: {
        ...categoriesData[i],
        displayOrder: i + 1,
      },
    });
    categoryMap.set(cat.slug, cat);
  }

  // 4. Create Brands
  const brandsData = [
    { name: 'Apple', slug: 'apple', isFeatured: true, description: 'Designed in California' },
    { name: 'Samsung', slug: 'samsung', isFeatured: true, description: 'Galaxy Innovation' },
    { name: 'OnePlus', slug: 'oneplus', isFeatured: true, description: 'Never Settle' },
    { name: 'Google Pixel', slug: 'google-pixel', isFeatured: true, description: 'Powered by Google Tensor & AI' },
    { name: 'Xiaomi', slug: 'xiaomi', isFeatured: true, description: 'Innovation for Everyone' },
    { name: 'Realme', slug: 'realme', isFeatured: false, description: 'Dare to Leap' },
    { name: 'Motorola', slug: 'motorola', isFeatured: false, description: 'Hello Moto' },
    { name: 'Vivo', slug: 'vivo', isFeatured: true, description: 'Zeiss optics photography' },
    { name: 'Oppo', slug: 'oppo', isFeatured: false, description: 'Portrait Experts' },
    { name: 'Boat', slug: 'boat', isFeatured: true, description: 'India’s No.1 Audio & Wearable Brand' },
    { name: 'Sony', slug: 'sony', isFeatured: true, description: 'Industry Leading Sound' },
    { name: 'Anker', slug: 'anker', isFeatured: false, description: 'World leader in charging tech' },
    { name: 'Spigen', slug: 'spigen', isFeatured: false, description: 'Premium Armor Protection' },
  ];

  const brandMap = new Map<string, any>();
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brandMap.set(b.slug, brand);
  }

  // 5. Create 32+ Sample Products
  const productsSeed = [
    // --- Smartphones / iPhones ---
    {
      name: 'Apple iPhone 16 Pro Max',
      slug: 'apple-iphone-16-pro-max',
      brandSlug: 'apple',
      categorySlug: 'iphones',
      price: 144900,
      discountPrice: 139900,
      discountPercentage: 3,
      sku: 'IPH-16PM-256',
      stockQuantity: 25,
      rating: 4.9,
      numReviews: 84,
      isFeatured: true,
      isBestSeller: true,
      isPremium: true,
      description: 'Grade 5 Titanium design with Camera Control, 48MP Fusion camera, and A18 Pro chip. Incredible battery life and Super Retina XDR display with ProMotion.',
      specifications: JSON.stringify({
        Display: '6.9-inch Super Retina XDR OLED 120Hz',
        Processor: 'Apple A18 Pro 3nm',
        RAM: '8 GB',
        Storage: '256 GB / 512 GB / 1 TB',
        RearCamera: '48MP + 48MP Ultra-Wide + 12MP 5x Telephoto',
        FrontCamera: '12MP TrueDepth',
        Battery: '4685 mAh, MagSafe 25W',
        OS: 'iOS 18 with Apple Intelligence',
      }),
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Natural Titanium', colorCode: '#B9B4AA', storage: '256 GB', ram: '8 GB', price: 144900, discountPrice: 139900, sku: 'IPH-16PM-NT-256' },
        { color: 'Desert Titanium', colorCode: '#C8B39B', storage: '512 GB', ram: '8 GB', price: 164900, discountPrice: 159900, sku: 'IPH-16PM-DT-512' },
        { color: 'Black Titanium', colorCode: '#3A3B3C', storage: '256 GB', ram: '8 GB', price: 144900, discountPrice: 139900, sku: 'IPH-16PM-BT-256' }
      ]
    },
    {
      name: 'Apple iPhone 16',
      slug: 'apple-iphone-16',
      brandSlug: 'apple',
      categorySlug: 'iphones',
      price: 79900,
      discountPrice: 74900,
      discountPercentage: 6,
      sku: 'IPH-16-128',
      stockQuantity: 40,
      rating: 4.8,
      numReviews: 62,
      isFeatured: true,
      isNewArrival: true,
      description: 'Dynamic Island, innovative Camera Control button, 48MP Fusion camera with 2x Telephoto, and blazing fast A18 chip ready for Apple Intelligence.',
      specifications: JSON.stringify({
        Display: '6.1-inch Super Retina XDR OLED',
        Processor: 'Apple A18 Bionic',
        RAM: '8 GB',
        Storage: '128 GB / 256 GB',
        RearCamera: '48MP Main + 12MP Ultra-Wide',
        FrontCamera: '12MP TrueDepth',
        Battery: '3561 mAh',
        OS: 'iOS 18',
      }),
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Ultramarine Blue', colorCode: '#2563EB', storage: '128 GB', ram: '8 GB', price: 79900, discountPrice: 74900, sku: 'IPH-16-UM-128' },
        { color: 'Teal', colorCode: '#0D9488', storage: '128 GB', ram: '8 GB', price: 79900, discountPrice: 74900, sku: 'IPH-16-TL-128' },
        { color: 'Pink', colorCode: '#F472B6', storage: '256 GB', ram: '8 GB', price: 89900, discountPrice: 84900, sku: 'IPH-16-PK-256' }
      ]
    },
    {
      name: 'Samsung Galaxy S25 Ultra 5G',
      slug: 'samsung-galaxy-s25-ultra-5g',
      brandSlug: 'samsung',
      categorySlug: 'smartphones',
      price: 134999,
      discountPrice: 124999,
      discountPercentage: 7,
      sku: 'SAM-S25U-512',
      stockQuantity: 30,
      rating: 4.8,
      numReviews: 95,
      isFeatured: true,
      isBestSeller: true,
      isPremium: true,
      isDealsOffer: true,
      description: 'Next-generation Galaxy AI flagship. Titanium frame with built-in S-Pen, 200MP Quad-Telephoto zoom camera, Snapdragon 8 Elite for Galaxy, and anti-reflective display.',
      specifications: JSON.stringify({
        Display: '6.8-inch Dynamic AMOLED 2X 120Hz LTPO (2600 nits)',
        Processor: 'Qualcomm Snapdragon 8 Elite (3nm)',
        RAM: '12 GB / 16 GB LPDDR5X',
        Storage: '256 GB / 512 GB / 1 TB UFS 4.0',
        RearCamera: '200MP + 50MP 5x + 50MP Ultra-Wide + 10MP 3x',
        FrontCamera: '12MP Dual Pixel AF',
        Battery: '5000 mAh with 45W Fast Charging',
        OS: 'One UI 7 (Android 15)',
      }),
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Titanium Gray', colorCode: '#6B7280', storage: '512 GB', ram: '12 GB', price: 134999, discountPrice: 124999, sku: 'SAM-S25U-TG-512' },
        { color: 'Titanium Black', colorCode: '#1F2937', storage: '256 GB', ram: '12 GB', price: 124999, discountPrice: 114999, sku: 'SAM-S25U-TB-256' },
        { color: 'Titanium Silver', colorCode: '#E5E7EB', storage: '512 GB', ram: '16 GB', price: 144999, discountPrice: 134999, sku: 'SAM-S25U-TS-512' }
      ]
    },
    {
      name: 'OnePlus 13 5G',
      slug: 'oneplus-13-5g',
      brandSlug: 'oneplus',
      categorySlug: 'smartphones',
      price: 69999,
      discountPrice: 64999,
      discountPercentage: 7,
      sku: 'OP-13-256',
      stockQuantity: 35,
      rating: 4.7,
      numReviews: 48,
      isFeatured: true,
      isNewArrival: true,
      description: 'Hasselblad Camera for Mobile, Snapdragon 8 Elite, 6000mAh Glacier battery with 100W SUPERVOOC charging, and 2K 120Hz Oriental Screen.',
      specifications: JSON.stringify({
        Display: '6.82-inch 2K ProXDR AMOLED 120Hz LTPO 4.0',
        Processor: 'Qualcomm Snapdragon 8 Elite',
        RAM: '12 GB / 16 GB',
        Storage: '256 GB / 512 GB',
        RearCamera: '50MP Sony LYT-808 + 50MP Periscope + 50MP Ultra-Wide',
        FrontCamera: '32MP',
        Battery: '6000 mAh with 100W Wired + 50W AIRVOOC',
        OS: 'OxygenOS 15 (Android 15)',
      }),
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Midnight Black', colorCode: '#111827', storage: '256 GB', ram: '12 GB', price: 69999, discountPrice: 64999, sku: 'OP-13-MB-256' },
        { color: 'Emerald Green', colorCode: '#064E3B', storage: '512 GB', ram: '16 GB', price: 79999, discountPrice: 73999, sku: 'OP-13-EG-512' }
      ]
    },
    {
      name: 'Google Pixel 9 Pro XL',
      slug: 'google-pixel-9-pro-xl',
      brandSlug: 'google-pixel',
      categorySlug: 'smartphones',
      price: 124999,
      discountPrice: 112999,
      discountPercentage: 10,
      sku: 'GGL-PX9PXL-256',
      stockQuantity: 20,
      rating: 4.8,
      numReviews: 38,
      isFeatured: true,
      isPremium: true,
      description: 'The best of Google AI in your pocket. Tensor G4 processor with Gemini Live, 7 years of OS updates, and award-winning computational photography.',
      specifications: JSON.stringify({
        Display: '6.8-inch Super Actua LTPO OLED (up to 3000 nits)',
        Processor: 'Google Tensor G4 with Titan M2 security',
        RAM: '16 GB',
        Storage: '256 GB / 512 GB',
        RearCamera: '50MP Octa PD + 48MP Quad PD 5x + 48MP Quad PD Ultrawide',
        FrontCamera: '42MP Dual PD with AF',
        Battery: '5060 mAh with 37W Fast Charge',
        OS: 'Stock Android 15 with 7 Years Updates',
      }),
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Obsidian', colorCode: '#1C1917', storage: '256 GB', ram: '16 GB', price: 124999, discountPrice: 112999, sku: 'GGL-PX9-OBS-256' },
        { color: 'Porcelain', colorCode: '#F5F5F4', storage: '256 GB', ram: '16 GB', price: 124999, discountPrice: 112999, sku: 'GGL-PX9-POR-256' }
      ]
    },
    {
      name: 'Xiaomi 14 Ultra 5G',
      slug: 'xiaomi-14-ultra-5g',
      brandSlug: 'xiaomi',
      categorySlug: 'smartphones',
      price: 99999,
      discountPrice: 89999,
      discountPercentage: 10,
      sku: 'XIA-14U-512',
      stockQuantity: 18,
      rating: 4.7,
      numReviews: 29,
      isFeatured: false,
      isPremium: true,
      description: 'Leica Quad Camera system with 1-inch variable aperture main sensor, Snapdragon 8 Gen 3, and Xiaomi HyperOS for incredible creative photography.',
      specifications: JSON.stringify({
        Display: '6.73-inch WQHD+ AMOLED 120Hz',
        Processor: 'Snapdragon 8 Gen 3',
        RAM: '16 GB',
        Storage: '512 GB',
        RearCamera: '50MP LYT-900 (1-inch) + 50MP Telephoto + 50MP Periscope + 50MP Ultra-wide',
        FrontCamera: '32MP',
        Battery: '5000 mAh 90W HyperCharge',
        OS: 'Xiaomi HyperOS',
      }),
      images: [
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Black Vegan Leather', colorCode: '#18181B', storage: '512 GB', ram: '16 GB', price: 99999, discountPrice: 89999, sku: 'XIA-14U-BLK' }
      ]
    },
    {
      name: 'Vivo X200 Pro 5G',
      slug: 'vivo-x200-pro-5g',
      brandSlug: 'vivo',
      categorySlug: 'smartphones',
      price: 94999,
      discountPrice: 86999,
      discountPercentage: 8,
      sku: 'VIV-X200P-512',
      stockQuantity: 24,
      rating: 4.9,
      numReviews: 32,
      isFeatured: true,
      isNewArrival: true,
      description: 'Co-engineered with ZEISS. 200MP ZEISS APO Telephoto camera, MediaTek Dimensity 9400 flagship 3nm chip, and 6000mAh BlueVolt battery.',
      specifications: JSON.stringify({
        Display: '6.78-inch 1.5K 8T LTPO Eye-care OLED',
        Processor: 'MediaTek Dimensity 9400 (3nm)',
        RAM: '16 GB',
        Storage: '512 GB',
        RearCamera: '50MP ZEISS Main + 200MP APO Telephoto + 50MP Ultra-wide',
        FrontCamera: '32MP AF',
        Battery: '6000 mAh 90W FlashCharge',
        OS: 'Funtouch OS 15 (Android 15)',
      }),
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Titanium Blue', colorCode: '#1E3A8A', storage: '512 GB', ram: '16 GB', price: 94999, discountPrice: 86999, sku: 'VIV-X200-BLU' }
      ]
    },
    {
      name: 'Motorola Edge 50 Ultra',
      slug: 'motorola-edge-50-ultra',
      brandSlug: 'motorola',
      categorySlug: 'android-phones',
      price: 59999,
      discountPrice: 49999,
      discountPercentage: 17,
      sku: 'MOT-E50U-512',
      stockQuantity: 28,
      rating: 4.6,
      numReviews: 44,
      isDealsOffer: true,
      isBestSeller: true,
      description: 'Real wood and vegan leather backs, Pantone validated colors and camera, 144Hz pOLED curved screen, 125W TurboPower charging, and IP68 underwater protection.',
      specifications: JSON.stringify({
        Display: '6.7-inch Super HD (1220p) 144Hz pOLED',
        Processor: 'Snapdragon 8s Gen 3',
        RAM: '12 GB / 16 GB',
        Storage: '512 GB',
        RearCamera: '50MP OIS + 64MP 3x Periscope + 50MP Ultra-wide Macro',
        FrontCamera: '50MP with AF',
        Battery: '4500 mAh with 125W Wired + 50W Wireless',
        OS: 'Hello UI (Android 14)',
      }),
      images: [
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Nordic Wood', colorCode: '#B45309', storage: '512 GB', ram: '16 GB', price: 59999, discountPrice: 49999, sku: 'MOT-E50U-WOOD' },
        { color: 'Peach Fuzz', colorCode: '#FB923C', storage: '512 GB', ram: '12 GB', price: 54999, discountPrice: 46999, sku: 'MOT-E50U-PEACH' }
      ]
    },
    {
      name: 'Realme GT 6 5G',
      slug: 'realme-gt-6-5g',
      brandSlug: 'realme',
      categorySlug: 'android-phones',
      price: 40999,
      discountPrice: 35999,
      discountPercentage: 12,
      sku: 'RME-GT6-256',
      stockQuantity: 45,
      rating: 4.6,
      numReviews: 53,
      isDealsOffer: true,
      description: 'Top AI flagship killer with 6000-nit ultra-bright display, Snapdragon 8s Gen 3, Sony LYT-808 OIS camera, and 120W SuperVOOC charge.',
      specifications: JSON.stringify({
        Display: '6.78-inch 8T LTPO AMOLED 120Hz (6000 nits peak)',
        Processor: 'Snapdragon 8s Gen 3',
        RAM: '8 GB / 12 GB',
        Storage: '256 GB',
        RearCamera: '50MP OIS + 50MP Telephoto + 8MP Ultra-wide',
        FrontCamera: '32MP Sony',
        Battery: '5500 mAh with 120W SuperVOOC',
        OS: 'realme UI 5.0 (Android 14)',
      }),
      images: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Fluid Silver', colorCode: '#94A3B8', storage: '256 GB', ram: '12 GB', price: 40999, discountPrice: 35999, sku: 'RME-GT6-SLV' },
        { color: 'Razor Green', colorCode: '#065F46', storage: '256 GB', ram: '8 GB', price: 38999, discountPrice: 33999, sku: 'RME-GT6-GRN' }
      ]
    },
    {
      name: 'Redmi Note 14 Pro+ 5G',
      slug: 'redmi-note-14-pro-plus-5g',
      brandSlug: 'xiaomi',
      categorySlug: 'smartphones',
      price: 32999,
      discountPrice: 28999,
      discountPercentage: 12,
      sku: 'RED-N14PP-256',
      stockQuantity: 50,
      rating: 4.5,
      numReviews: 76,
      isBestSeller: true,
      description: 'India’s favorite mid-ranger! 6200mAh massive battery, 2.5x optical zoom camera with Light Hunter 800 sensor, IP68/IP69 water resistance, and 90W charging.',
      specifications: JSON.stringify({
        Display: '6.67-inch 1.5K Curved AMOLED 120Hz',
        Processor: 'Snapdragon 7s Gen 3',
        RAM: '8 GB / 12 GB',
        Storage: '256 GB / 512 GB',
        RearCamera: '50MP Light Hunter + 50MP Telephoto + 8MP Ultrawide',
        FrontCamera: '20MP',
        Battery: '6200 mAh Silicon-Carbon with 90W Fast Charging',
        OS: 'Xiaomi HyperOS',
      }),
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Midnight Black', colorCode: '#111827', storage: '256 GB', ram: '8 GB', price: 32999, discountPrice: 28999, sku: 'RED-N14-BLK-256' },
        { color: 'Frost Blue', colorCode: '#38BDF8', storage: '512 GB', ram: '12 GB', price: 35999, discountPrice: 31999, sku: 'RED-N14-BLU-512' }
      ]
    },
    {
      name: 'Oppo Find X8 5G',
      slug: 'oppo-find-x8-5g',
      brandSlug: 'oppo',
      categorySlug: 'smartphones',
      price: 69999,
      discountPrice: 62999,
      discountPercentage: 10,
      sku: 'OPP-X8-256',
      stockQuantity: 22,
      rating: 4.7,
      numReviews: 21,
      isNewArrival: true,
      description: 'Ultra-thin symmetrical bezel design with Hasselblad Master Camera System, Dimensity 9400, and AI Telescope Zoom.',
      specifications: JSON.stringify({
        Display: '6.59-inch 1.5K ProXDR AMOLED 120Hz',
        Processor: 'MediaTek Dimensity 9400',
        RAM: '12 GB / 16 GB',
        Storage: '256 GB',
        RearCamera: '50MP Sony LYT-700 + 50MP Periscope + 50MP Ultrawide',
        FrontCamera: '32MP Sony IMX615',
        Battery: '5630 mAh Glacier Battery 80W',
        OS: 'ColorOS 15',
      }),
      images: [
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Starry Grey', colorCode: '#4B5563', storage: '256 GB', ram: '12 GB', price: 69999, discountPrice: 62999, sku: 'OPP-X8-GRY' },
        { color: 'Space Black', colorCode: '#111827', storage: '256 GB', ram: '16 GB', price: 74999, discountPrice: 67999, sku: 'OPP-X8-BLK' }
      ]
    },

    // --- Audio: Earphones & Headphones ---
    {
      name: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-wireless-headphones',
      brandSlug: 'sony',
      categorySlug: 'headphones',
      price: 34990,
      discountPrice: 26990,
      discountPercentage: 23,
      sku: 'SNY-WHXM5-SLV',
      stockQuantity: 40,
      rating: 4.9,
      numReviews: 120,
      isFeatured: true,
      isBestSeller: true,
      isDealsOffer: true,
      description: 'Industry-leading noise canceling with two processors and 8 microphones. Hi-Res Audio wireless, crystal clear hands-free calling, and 30-hour battery life.',
      specifications: JSON.stringify({
        Type: 'Over-Ear Wireless ANC',
        Driver: '30mm carbon fiber composite',
        BatteryLife: 'Up to 30 hours with ANC on (40h off)',
        QuickCharge: '3 min charge = 3 hours playback',
        Codecs: 'LDAC, AAC, SBC',
        Weight: '250g lightweight design',
      }),
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Silver Platinum', colorCode: '#D1D5DB', price: 34990, discountPrice: 26990, sku: 'SNY-XM5-SLV' },
        { color: 'Black Onyx', colorCode: '#1F2937', price: 34990, discountPrice: 26990, sku: 'SNY-XM5-BLK' }
      ]
    },
    {
      name: 'Apple AirPods Pro (2nd Gen with USB-C)',
      slug: 'apple-airpods-pro-2nd-gen-usbc',
      brandSlug: 'apple',
      categorySlug: 'earphones',
      price: 24900,
      discountPrice: 21900,
      discountPercentage: 12,
      sku: 'APP-APP2-USBC',
      stockQuantity: 50,
      rating: 4.9,
      numReviews: 154,
      isFeatured: true,
      isBestSeller: true,
      description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking, and USB-C MagSafe Case.',
      specifications: JSON.stringify({
        Chip: 'Apple H2 headphone chip in bud, U1 chip in case',
        Audio: 'Custom high-excursion Apple driver & high dynamic range amplifier',
        Battery: 'Up to 6 hours listening (30 hours total with case)',
        Resistance: 'Dust, sweat, and water resistant (IP54)',
        Case: 'USB-C with built-in speaker and lanyard loop',
      }),
      images: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'White', colorCode: '#FFFFFF', price: 24900, discountPrice: 21900, sku: 'APP-APP2-WHT' }
      ]
    },
    {
      name: 'boAt Airdopes 141 ANC TWS',
      slug: 'boat-airdopes-141-anc-tws',
      brandSlug: 'boat',
      categorySlug: 'earphones',
      price: 3990,
      discountPrice: 1499,
      discountPercentage: 62,
      sku: 'BOAT-AD141-ANC',
      stockQuantity: 120,
      rating: 4.4,
      numReviews: 310,
      isBestSeller: true,
      isDealsOffer: true,
      description: 'Budget champion with 32dB Active Noise Cancellation, 42 hours total playtime, ENx quad mic technology for crystal calls, and ASAP Charge.',
      specifications: JSON.stringify({
        Driver: '10mm drivers with boAt Signature Sound',
        ANC: 'Up to 32dB Active Noise Cancellation',
        Playtime: '42 Hours Playback',
        Latency: '50ms Low Latency BEAST Mode',
        WaterResistance: 'IPX5 Sweat & Water Resistance',
      }),
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Gunmetal Black', colorCode: '#1E293B', price: 3990, discountPrice: 1499, sku: 'BOAT-141-BLK' },
        { color: 'Cider Cyan', colorCode: '#06B6D4', price: 3990, discountPrice: 1499, sku: 'BOAT-141-CYN' }
      ]
    },
    {
      name: 'OnePlus Buds Pro 3',
      slug: 'oneplus-buds-pro-3',
      brandSlug: 'oneplus',
      categorySlug: 'earphones',
      price: 13999,
      discountPrice: 11999,
      discountPercentage: 14,
      sku: 'OP-BP3-GLD',
      stockQuantity: 45,
      rating: 4.7,
      numReviews: 58,
      isNewArrival: true,
      description: 'Co-created with Dynaudio. Dual drivers (11mm woofer + 6mm tweeter), 50dB adaptive noise cancellation, spatial audio, and premium leatherette charging case.',
      specifications: JSON.stringify({
        Drivers: 'Dual DACs + 11mm Woofer + 6mm Tweeter Dynaudio tuned',
        ANC: 'Real-time 50dB Adaptive Noise Cancellation',
        Battery: '43 Hours total with case',
        Codecs: 'LHDC 5.0, AAC, SBC (Hi-Res Wireless certified)',
      }),
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Lunar Radiance', colorCode: '#F3F4F6', price: 13999, discountPrice: 11999, sku: 'OP-BP3-RAD' },
        { color: 'Midnight Opus', colorCode: '#111827', price: 13999, discountPrice: 11999, sku: 'OP-BP3-MID' }
      ]
    },

    // --- Smartwatches ---
    {
      name: 'Apple Watch Series 10 GPS',
      slug: 'apple-watch-series-10-gps',
      brandSlug: 'apple',
      categorySlug: 'smartwatches',
      price: 46900,
      discountPrice: 42900,
      discountPercentage: 9,
      sku: 'APP-W10-46',
      stockQuantity: 25,
      rating: 4.9,
      numReviews: 64,
      isFeatured: true,
      isPremium: true,
      description: 'Thinnest Apple Watch ever with the biggest wide-angle OLED display, sleep apnea notifications, faster charging, water temperature and depth gauge.',
      specifications: JSON.stringify({
        Display: 'Always-On Retina wide-angle OLED (up to 2000 nits)',
        Size: '46mm / 42mm Aerospace-grade aluminum',
        Sensors: 'ECG, Blood Oxygen, Temperature sensing, Depth gauge to 6m',
        Charging: 'Fast charge to 80% in about 30 minutes',
        WaterResistance: '50m water resistant, swimproof',
      }),
      images: [
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Jet Black', colorCode: '#0A0A0A', price: 46900, discountPrice: 42900, sku: 'APP-W10-JB-46' },
        { color: 'Rose Gold', colorCode: '#FBCFE8', price: 46900, discountPrice: 42900, sku: 'APP-W10-RG-46' },
        { color: 'Silver', colorCode: '#E5E7EB', price: 46900, discountPrice: 42900, sku: 'APP-W10-SL-46' }
      ]
    },
    {
      name: 'Samsung Galaxy Watch Ultra 47mm',
      slug: 'samsung-galaxy-watch-ultra-47mm',
      brandSlug: 'samsung',
      categorySlug: 'smartwatches',
      price: 59999,
      discountPrice: 53999,
      discountPercentage: 10,
      sku: 'SAM-GWU-47',
      stockQuantity: 15,
      rating: 4.8,
      numReviews: 27,
      isPremium: true,
      description: 'Rugged Grade 4 titanium design, 100-hour battery power-saving mode, 3000 nits sapphire crystal, dual-frequency GPS, and Galaxy AI health coaching.',
      specifications: JSON.stringify({
        Body: 'Titanium Grade 4 cushion design with 10ATM & IP68 resistance',
        Display: '1.5-inch Super AMOLED 3000 nits sapphire glass',
        Sensors: 'BioActive sensor, Dual-frequency GPS (L1+L5), Siren 86dB',
        Battery: '590 mAh with WPC wireless charging',
      }),
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Titanium Gray', colorCode: '#4B5563', price: 59999, discountPrice: 53999, sku: 'SAM-GWU-GRY' },
        { color: 'Titanium White', colorCode: '#F3F4F6', price: 59999, discountPrice: 53999, sku: 'SAM-GWU-WHT' }
      ]
    },
    {
      name: 'boAt Wave Call 2 Plus Smartwatch',
      slug: 'boat-wave-call-2-plus-smartwatch',
      brandSlug: 'boat',
      categorySlug: 'smartwatches',
      price: 6990,
      discountPrice: 1799,
      discountPercentage: 74,
      sku: 'BOAT-WC2P-BLK',
      stockQuantity: 95,
      rating: 4.3,
      numReviews: 189,
      isBestSeller: true,
      isDealsOffer: true,
      description: '1.96-inch HD display, advanced Bluetooth calling with dial pad, 100+ sports modes, 7 days battery, and functional crown control.',
      specifications: JSON.stringify({
        Display: '1.96-inch HD Vivid Screen 550 nits',
        Calling: 'Bluetooth Calling with built-in mic and speaker',
        Health: 'Heart Rate, SpO2, Sleep Tracker, Menstrual Cycle tracking',
        Battery: 'Up to 7 days normal usage',
      }),
      images: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Active Black', colorCode: '#111827', price: 6990, discountPrice: 1799, sku: 'BOAT-WC2-BLK' },
        { color: 'Deep Blue', colorCode: '#1E3A8A', price: 6990, discountPrice: 1799, sku: 'BOAT-WC2-BLU' }
      ]
    },

    // --- Laptops & Tablets ---
    {
      name: 'Apple MacBook Air 13-inch M3',
      slug: 'apple-macbook-air-13-inch-m3',
      brandSlug: 'apple',
      categorySlug: 'laptops',
      price: 114900,
      discountPrice: 104900,
      discountPercentage: 9,
      sku: 'APP-MBA-M3-256',
      stockQuantity: 18,
      rating: 4.9,
      numReviews: 45,
      isFeatured: true,
      isPremium: true,
      description: 'Lean. Mean. M3 machine. Liquid Retina display, MagSafe 3 charging, dual external display support, and up to 18 hours of battery life in a silent fanless aluminum chassis.',
      specifications: JSON.stringify({
        Processor: 'Apple M3 chip (8-core CPU, 8-core or 10-core GPU, 16-core Neural Engine)',
        Display: '13.6-inch Liquid Retina LED-backlit display with True Tone',
        Memory: '16 GB unified memory',
        Storage: '256 GB / 512 GB SSD',
        Battery: 'Up to 18 hours Apple TV app movie playback',
        Ports: 'MagSafe 3, two Thunderbolt / USB 4 ports, 3.5mm headphone jack',
      }),
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Midnight', colorCode: '#191C24', storage: '256 GB', ram: '16 GB', price: 114900, discountPrice: 104900, sku: 'MBA-M3-MID-256' },
        { color: 'Starlight', colorCode: '#EFEFEA', storage: '512 GB', ram: '16 GB', price: 134900, discountPrice: 124900, sku: 'MBA-M3-STR-512' },
        { color: 'Space Grey', colorCode: '#53565A', storage: '256 GB', ram: '16 GB', price: 114900, discountPrice: 104900, sku: 'MBA-M3-GRY-256' }
      ]
    },
    {
      name: 'Samsung Galaxy Tab S9 FE+ 5G',
      slug: 'samsung-galaxy-tab-s9-fe-plus-5g',
      brandSlug: 'samsung',
      categorySlug: 'tablets',
      price: 54999,
      discountPrice: 47999,
      discountPercentage: 13,
      sku: 'SAM-TS9FE-128',
      stockQuantity: 20,
      rating: 4.7,
      numReviews: 36,
      isFeatured: false,
      description: '12.4-inch expansive display with IP68 water & dust resistance, bundled low-latency S Pen, dual AKG tuned speakers, and 10090mAh long battery with 45W fast charge.',
      specifications: JSON.stringify({
        Display: '12.4-inch WQXGA 90Hz Vision Booster',
        Processor: 'Exynos 1380 Octa-core',
        RAM: '8 GB / 12 GB',
        Storage: '128 GB / 256 GB (microSD up to 1TB)',
        Stylus: 'In-box IP68 rated S Pen included',
        Battery: '10090 mAh 45W Fast Charging',
      }),
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Gray', colorCode: '#374151', storage: '128 GB', ram: '8 GB', price: 54999, discountPrice: 47999, sku: 'SAM-TS9-GRY' },
        { color: 'Mint', colorCode: '#6EE7B7', storage: '256 GB', ram: '12 GB', price: 62999, discountPrice: 54999, sku: 'SAM-TS9-MNT' }
      ]
    },
    {
      name: 'Apple iPad Air 11-inch M2',
      slug: 'apple-ipad-air-11-inch-m2',
      brandSlug: 'apple',
      categorySlug: 'tablets',
      price: 59900,
      discountPrice: 55900,
      discountPercentage: 7,
      sku: 'APP-IPAD-AIR-M2',
      stockQuantity: 28,
      rating: 4.8,
      numReviews: 42,
      isFeatured: true,
      description: 'Redesigned iPad Air turbocharged by Apple M2 chip. Landscape 12MP Center Stage camera, Liquid Retina display, Wi-Fi 6E, and Apple Pencil Pro support.',
      specifications: JSON.stringify({
        Display: '11-inch Liquid Retina with P3 wide color and anti-reflective coating',
        Processor: 'Apple M2 (8-core CPU, 10-core GPU)',
        Storage: '128 GB / 256 GB',
        Connectivity: 'Wi-Fi 6E + Bluetooth 5.3',
        Camera: '12MP Wide back camera, 12MP Ultra Wide landscape front camera',
      }),
      images: [
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Space Grey', colorCode: '#4B5563', storage: '128 GB', price: 59900, discountPrice: 55900, sku: 'IPAD-M2-GRY-128' },
        { color: 'Blue', colorCode: '#93C5FD', storage: '256 GB', price: 69900, discountPrice: 64900, sku: 'IPAD-M2-BLU-256' }
      ]
    },

    // --- Chargers, Power Banks & Cables ---
    {
      name: 'Anker 735 GaNPrime 65W 3-Port Fast Charger',
      slug: 'anker-735-ganprime-65w-fast-charger',
      brandSlug: 'anker',
      categorySlug: 'chargers',
      price: 5499,
      discountPrice: 3999,
      discountPercentage: 27,
      sku: 'ANK-735-65W',
      stockQuantity: 65,
      rating: 4.8,
      numReviews: 79,
      isBestSeller: true,
      description: 'GaNPrime high-speed charging. 2x USB-C and 1x USB-A ports to charge phone, tablet, and laptop simultaneously with Dynamic Power Distribution and ActiveShield 2.0.',
      specifications: JSON.stringify({
        TotalWattage: '65W Max',
        Ports: '2x USB-C + 1x USB-A',
        Technology: 'GaNPrime with PowerIQ 4.0',
        Safety: 'ActiveShield 2.0 Real-time temperature sensor',
        Compatibility: 'iPhone, Galaxy, MacBook, iPad, OnePlus',
      }),
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Matte Black', colorCode: '#111827', price: 5499, discountPrice: 3999, sku: 'ANK-735-BLK' }
      ]
    },
    {
      name: 'Anker 337 Power Bank 26800mAh High Capacity',
      slug: 'anker-337-power-bank-26800mah',
      brandSlug: 'anker',
      categorySlug: 'power-banks',
      price: 6999,
      discountPrice: 4799,
      discountPercentage: 31,
      sku: 'ANK-PB-26800',
      stockQuantity: 40,
      rating: 4.7,
      numReviews: 61,
      isDealsOffer: true,
      description: 'Massive 26800mAh capacity to power your iPhone over 6 times or Galaxy phone 5 times. 3 high-speed USB output ports with PowerIQ technology.',
      specifications: JSON.stringify({
        Capacity: '26,800 mAh / 96.48 Wh (Flight approved)',
        Outputs: '3x USB-A output up to 5V/6A (3A max per port)',
        Input: 'Dual Micro USB input (6-hour ultra fast recharge)',
        Protection: 'MultiProtect 11-point safety system',
      }),
      images: [
        'https://images.unsplash.com/photo-1609592424364-58a4369a8b19?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Black', colorCode: '#18181B', price: 6999, discountPrice: 4799, sku: 'ANK-26800-BLK' }
      ]
    },
    {
      name: 'Xiaomi 20000mAh 33W Fast Charging Power Bank',
      slug: 'xiaomi-20000mah-33w-power-bank',
      brandSlug: 'xiaomi',
      categorySlug: 'power-banks',
      price: 3499,
      discountPrice: 2299,
      discountPercentage: 34,
      sku: 'XIA-PB-20000-33W',
      stockQuantity: 80,
      rating: 4.6,
      numReviews: 142,
      isBestSeller: true,
      description: 'Pocket-sized powerhouse with 33W max fast output. Type-C two-way fast charging, triple port output, and low-current mode for smart bands and TWS earbuds.',
      specifications: JSON.stringify({
        Capacity: '20,000 mAh 74Wh',
        ChargingSpeed: '33W Super Fast Charge (USB-C + USB-A)',
        Ports: '1x Type-C + 2x Type-A',
        Safety: '12 layers of advanced circuit chip protection',
      }),
      images: [
        'https://images.unsplash.com/photo-1609592424364-58a4369a8b19?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Ivory White', colorCode: '#F3F4F6', price: 3499, discountPrice: 2299, sku: 'XIA-PB20-WHT' },
        { color: 'Charcoal Black', colorCode: '#1F2937', price: 3499, discountPrice: 2299, sku: 'XIA-PB20-BLK' }
      ]
    },
    {
      name: 'Spigen DuraSync 60W USB-C to USB-C Braided Cable 1.5m',
      slug: 'spigen-durasync-60w-usbc-cable-15m',
      brandSlug: 'spigen',
      categorySlug: 'cables',
      price: 1499,
      discountPrice: 699,
      discountPercentage: 53,
      sku: 'SPG-CABLE-60W',
      stockQuantity: 150,
      rating: 4.8,
      numReviews: 215,
      isBestSeller: true,
      description: 'Double braided nylon jacket tested for 30,000+ bends. Supports USB Power Delivery up to 60W and 480Mbps fast data transmission for phones, tablets, and laptops.',
      specifications: JSON.stringify({
        Length: '1.5 Meters (5 Feet)',
        PowerDelivery: '60W (20V/3A) Fast Charging',
        Material: 'Tangle-free double braided nylon with aluminum connector shells',
        Compatibility: 'Universal USB-C laptops, iPad, iPhone 15/16, Android',
      }),
      images: [
        'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Graphite Grey', colorCode: '#4B5563', price: 1499, discountPrice: 699, sku: 'SPG-CB60-GRY' },
        { color: 'Classic Black', colorCode: '#111827', price: 1499, discountPrice: 699, sku: 'SPG-CB60-BLK' }
      ]
    },

    // --- Mobile Covers & Screen Protectors ---
    {
      name: 'Spigen Ultra Hybrid MagFit Case for iPhone 16 Pro Max',
      slug: 'spigen-ultra-hybrid-magfit-case-iphone-16-pro-max',
      brandSlug: 'spigen',
      categorySlug: 'mobile-covers',
      price: 2999,
      discountPrice: 1699,
      discountPercentage: 43,
      sku: 'SPG-UH-16PM',
      stockQuantity: 70,
      rating: 4.8,
      numReviews: 88,
      isBestSeller: true,
      description: 'Crystal clear back with anti-yellowing blue resin. Integrated magnetic ring for strong MagSafe attachment, Air Cushion Technology on all corners for military-grade drop defense.',
      specifications: JSON.stringify({
        Material: 'Polycarbonate back + TPU bumper',
        DropProtection: 'Air Cushion Military Grade Certified',
        MagSafe: 'Compatible with MagSafe chargers, wallets, and car mounts',
        CameraProtection: 'Raised bezels around camera island and display',
      }),
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'White Frost MagSafe', colorCode: '#E5E7EB', price: 2999, discountPrice: 1699, sku: 'SPG-UH-WHT-16PM' },
        { color: 'Carbon Black MagSafe', colorCode: '#111827', price: 2999, discountPrice: 1699, sku: 'SPG-UH-BLK-16PM' }
      ]
    },
    {
      name: 'Spigen Glas.tR EZ Fit 9H Tempered Glass (2-Pack)',
      slug: 'spigen-glastr-ezfit-tempered-glass-iphone-16',
      brandSlug: 'spigen',
      categorySlug: 'screen-protectors',
      price: 1999,
      discountPrice: 1199,
      discountPercentage: 40,
      sku: 'SPG-EZFIT-9H',
      stockQuantity: 110,
      rating: 4.9,
      numReviews: 164,
      isBestSeller: true,
      description: 'Auto-alignment installation tray guarantees flawless zero-bubble alignment in seconds. 9H hardness tempered glass with oleophobic anti-fingerprint coating.',
      specifications: JSON.stringify({
        Hardness: '9H Tempered Glass',
        Package: 'Includes 2 Screen Protectors + 1 EZ Fit Alignment Tray + Cleaning Kit',
        Coating: 'Oleophobic coating prevents oily fingerprints and smudges',
        TouchSensitivity: '100% true touch response and crystal clear transparency',
      }),
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Crystal Clear (2-Pack)', colorCode: '#F3F4F6', price: 1999, discountPrice: 1199, sku: 'SPG-EZFIT-CLR' }
      ]
    },

    // --- Speakers ---
    {
      name: 'boAt Stone 1800 90W Bluetooth Party Speaker',
      slug: 'boat-stone-1800-90w-party-speaker',
      brandSlug: 'boat',
      categorySlug: 'speakers',
      price: 12990,
      discountPrice: 6999,
      discountPercentage: 46,
      sku: 'BOAT-ST1800-90W',
      stockQuantity: 30,
      rating: 4.6,
      numReviews: 73,
      isDealsOffer: true,
      description: 'Monstrous 90W RMS sound output with dynamic RGB LED flame lights, karaoke mic input, TWS pairing for double loudness, and 6 hours of non-stop party playback.',
      specifications: JSON.stringify({
        SoundOutput: '90W RMS with Signature Bass Boost',
        Lights: 'Dynamic Multi-Mode RGB LED Party Lights',
        Playtime: 'Up to 6 Hours with Type-C Quick Charging',
        Connectivity: 'Bluetooth v5.3, AUX, USB Drive, TF Card, Mic Input',
        WaterResistance: 'IPX6 Splash and Spill Resistance',
      }),
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Midnight Black', colorCode: '#111827', price: 12990, discountPrice: 6999, sku: 'BOAT-ST1800-BLK' }
      ]
    },
    {
      name: 'Sony SRS-XB100 Wireless Portable Speaker',
      slug: 'sony-srs-xb100-wireless-portable-speaker',
      brandSlug: 'sony',
      categorySlug: 'speakers',
      price: 4990,
      discountPrice: 3990,
      discountPercentage: 20,
      sku: 'SNY-XB100-BLK',
      stockQuantity: 45,
      rating: 4.7,
      numReviews: 52,
      isFeatured: false,
      description: 'Compact body with big Extra Bass sound! Sound Diffusion Processor expands sound in any space. IP67 waterproof and dustproof with up to 16 hours of battery life.',
      specifications: JSON.stringify({
        BatteryLife: 'Up to 16 hours with battery status indicator',
        Durability: 'IP67 Waterproof, Dustproof, and UV Coating',
        Microphone: 'Built-in mic with Echo Canceling for hands-free calls',
        Strap: 'Multiway strap to hang from backpack or bicycle',
      }),
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Black', colorCode: '#18181B', price: 4990, discountPrice: 3990, sku: 'SNY-XB100-BLK' },
        { color: 'Ocean Blue', colorCode: '#0284C7', price: 4990, discountPrice: 3990, sku: 'SNY-XB100-BLU' }
      ]
    },

    // --- Electronics & Accessories ---
    {
      name: 'Xiaomi Smart TV X Pro 55-inch 4K Dolby Vision',
      slug: 'xiaomi-smart-tv-x-pro-55-inch-4k',
      brandSlug: 'xiaomi',
      categorySlug: 'electronics',
      price: 49999,
      discountPrice: 41999,
      discountPercentage: 16,
      sku: 'XIA-TV-55XP',
      stockQuantity: 15,
      rating: 4.7,
      numReviews: 40,
      isPremium: true,
      description: 'Flagship 4K HDR display with Dolby Vision IQ, 30W speaker with Dolby Audio, Google TV with Hands-Free Google Assistant, and metallic bezel-less design.',
      specifications: JSON.stringify({
        Screen: '55-inch 4K Ultra HD (3840 x 2160) 60Hz Vivid Picture Engine 2',
        Audio: '30W Stereo Speakers with Dolby Atmos & DTS:X',
        OS: 'Google TV with PatchWall UI',
        Connectivity: '3x HDMI 2.1 (eARC), 2x USB, Dual Band Wi-Fi, Bluetooth 5.0',
      }),
      images: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Metallic Gray Bezel', colorCode: '#4B5563', price: 49999, discountPrice: 41999, sku: 'XIA-TV55-GRY' }
      ]
    },
    {
      name: 'Spigen OneTap Pro MagSafe Magnetic Car Mount Charger',
      slug: 'spigen-onetap-pro-magsafe-car-mount-charger',
      brandSlug: 'spigen',
      categorySlug: 'accessories',
      price: 3999,
      discountPrice: 2499,
      discountPercentage: 38,
      sku: 'SPG-ONETAP-CAR',
      stockQuantity: 55,
      rating: 4.8,
      numReviews: 69,
      isBestSeller: true,
      description: 'OneTap Technology securely mounts iPhone in one second with powerful MagSafe neodymium magnets. Fast 15W wireless charging on AC air vent or dashboard.',
      specifications: JSON.stringify({
        MountType: 'Air Vent & Dashboard dual mount adapter',
        WirelessCharging: 'Up to 15W Qi wireless fast charging',
        Compatibility: 'MagSafe compatible with iPhone 12/13/14/15/16 and MagSafe cases',
        Adjustability: '360-degree ball joint for landscape GPS or portrait calls',
      }),
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
      ],
      variants: [
        { color: 'Matte Black', colorCode: '#111827', price: 3999, discountPrice: 2499, sku: 'SPG-ONETAP-BLK' }
      ]
    }
  ];

  console.log(`Creating ${productsSeed.length} sample products...`);

  for (const item of productsSeed) {
    const brand = brandMap.get(item.brandSlug);
    const category = categoryMap.get(item.categorySlug);

    if (!brand || !category) {
      console.warn(`Skipping ${item.name}: brand or category not found`);
      continue;
    }

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        brandId: brand.id,
        categoryId: category.id,
        price: item.price,
        discountPrice: item.discountPrice,
        discountPercentage: item.discountPercentage,
        sku: item.sku,
        stockQuantity: item.stockQuantity,
        rating: item.rating,
        numReviews: item.numReviews,
        isFeatured: item.isFeatured ?? false,
        isBestSeller: item.isBestSeller ?? false,
        isNewArrival: item.isNewArrival ?? false,
        isDealsOffer: item.isDealsOffer ?? false,
        isPremium: item.isPremium ?? false,
        description: item.description,
        specifications: item.specifications,
        warrantyInfo: '1 Year Brand Manufacturer Warranty',
        boxContents: 'Handset/Product, Power Adapter/Cable, Documentation, Warranty Card',
        deliveryInfo: 'Fast delivery in 2-3 business days across India. Same day dispatch for orders before 2 PM.',
        returnPolicy: '7 Days Replacement Guarantee if defective or damaged in transit.',
      },
    });

    // Create Images
    for (let i = 0; i < item.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.images[i],
          altText: `${item.name} - View ${i + 1}`,
          isPrimary: i === 0,
        },
      });
    }

    // Create Variants
    if (item.variants && item.variants.length > 0) {
      for (const v of item.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            color: v.color,
            colorCode: v.colorCode,
            ram: (v as any).ram || null,
            storage: (v as any).storage || null,
            price: v.price,
            discountPrice: v.discountPrice || null,
            stockQuantity: 15,
            sku: v.sku,
          },
        });
      }
    }
  }

  // 6. Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'ARORA10',
        discountType: 'PERCENTAGE',
        value: 10,
        minSpend: 1999,
        maxDiscount: 1000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'WELCOME500',
        discountType: 'FLAT',
        value: 500,
        minSpend: 4999,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FESTIVE25',
        discountType: 'PERCENTAGE',
        value: 25,
        minSpend: 999,
        maxDiscount: 750,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });

  // 7. Create Homepage Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Latest Smartphones at Great Prices',
        subtitle: 'Explore. Compare. Buy. Genuine Warranty & Same-Day Dispatch from Arora Communication.',
        badge: 'FLAT 10% OFF WITH CODE: ARORA10',
        buttonText: 'Shop Smartphones',
        buttonLink: '/category/smartphones',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
        bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
        displayOrder: 1,
        isActive: true,
      },
      {
        title: 'Flagship Audio & Smart Wearables',
        subtitle: 'Immerse in true fidelity with top Sony, Apple AirPods & boAt noise cancelling gear.',
        badge: 'UP TO 60% OFF',
        buttonText: 'Explore Audio',
        buttonLink: '/category/earphones',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        bgGradient: 'from-purple-900 via-indigo-900 to-slate-900',
        displayOrder: 2,
        isActive: true,
      },
      {
        title: 'GaN Chargers & Armor Protection',
        subtitle: 'Keep your gear energized and protected with Spigen and Anker certified accessories.',
        badge: 'ACCESSORIES FESTIVAL',
        buttonText: 'Shop Accessories',
        buttonLink: '/category/accessories',
        imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
        bgGradient: 'from-cyan-950 via-slate-900 to-indigo-950',
        displayOrder: 3,
        isActive: true,
      }
    ],
  });

  // 8. Create Sample Order for Customer
  const firstProduct = await prisma.product.findFirst({
    where: { slug: 'samsung-galaxy-s25-ultra-5g' },
  });

  if (firstProduct) {
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: 'ARC-2026-98124',
        userId: customer.id,
        addressId: customerAddress.id,
        status: 'PROCESSING',
        paymentMethod: 'UPI',
        paymentStatus: 'COMPLETED',
        subtotal: 124999,
        discount: 1000,
        deliveryCharge: 0,
        totalAmount: 123999,
        couponCode: 'ARORA10',
        trackingNumber: 'DELHIVERY-98172648',
        notes: 'Please call before delivery',
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: sampleOrder.id,
        productId: firstProduct.id,
        productName: firstProduct.name,
        productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        quantity: 1,
        price: 124999,
      },
    });

    await prisma.payment.create({
      data: {
        orderId: sampleOrder.id,
        transactionId: 'UPI-TXN-98218736412',
        gateway: 'RAZORPAY',
        amount: 123999,
        status: 'COMPLETED',
        method: 'UPI',
      },
    });

    // Add Review
    await prisma.review.create({
      data: {
        productId: firstProduct.id,
        userId: customer.id,
        rating: 5,
        title: 'Outstanding phone and superb service by Arora Communication!',
        comment: 'Received the phone within 24 hours in Delhi NCR with genuine brand warranty seal intact. Highly recommend Arora Communication for all electronics!',
        isVerifiedPurchase: true,
      },
    });
  }

  console.log('Database seeded successfully with Arora Communication products, categories, coupons, and sample users!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
