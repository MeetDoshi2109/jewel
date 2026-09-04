import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────────
// CURATED IMAGE LIBRARY — local public/images assets
// ─────────────────────────────────────────────────────────────────
const IMAGE_LIBRARY: Record<string, string[]> = {
  rings: [
    '/images/2ring.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/2ring.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
  ],
  necklaces: [
    '/images/necklace.jpg',
    '/images/3.jpg',
    '/images/mangalsutra.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/necklace.jpg',
    '/images/3.jpg',
  ],
  earrings: [
    '/images/5.jpg',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/6.jpg',
  ],
  bangles: [
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
  ],
  mangalsutra: [
    '/images/mangalsutra.jpg',
    '/images/necklace.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
    '/images/mangalsutra.jpg',
  ],
  anklets: [
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/4.jpg',
  ],
  nosepins: [
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
  ],
  mens: [
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.jpg',
    '/images/2.webp',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.jpg',
  ],
}

// Returns count images for a product — offset by `id` so each product
// gets a different starting image from its category pool
function imgs(category: string, id: number, count = 3): string {
  const pool = IMAGE_LIBRARY[category] || IMAGE_LIBRARY.rings
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    result.push(pool[(id + i) % pool.length])
  }
  return JSON.stringify(result)
}

const products = [
  // ─── RINGS (18) ───────────────────────────────────────────────
  {
    sku: 'AUR-RNG-001', name: 'Lumière Solitaire Ring', slug: 'lumiere-solitaire-ring',
    category: 'rings', price: 14999, material: '18k Gold with Diamond',
    isPremium: true, isFeatured: true, isBestseller: true, stock: 3,
    description: 'A single, brilliant-cut diamond rests at the heart of this refined solitaire, set in luminous 18k gold. The slender band tapers elegantly to cradle the stone, making this a timeless choice for engagements or personal milestones. Each piece is certified and hallmarked.',
    tags: JSON.stringify(['diamond', 'solitaire', 'engagement', 'premium']),
  },
  {
    sku: 'AUR-RNG-002', name: 'Constellation Band', slug: 'constellation-band',
    category: 'rings', price: 18500, material: '18k White Gold with Diamonds',
    isPremium: true, isFeatured: true, stock: 2,
    description: 'Seven princess-cut diamonds trace a celestial arc across this white gold eternity band. The channel setting keeps each stone flush and secure, creating a seamless ribbon of light around your finger. A modern heirloom for extraordinary moments.',
    tags: JSON.stringify(['diamond', 'eternity', 'white gold', 'premium']),
  },
  {
    sku: 'AUR-RNG-003', name: 'Rose Bloom Ring', slug: 'rose-bloom-ring',
    category: 'rings', price: 3499, material: '925 Sterling Silver with Rose Gold Plating',
    isPremium: false, isFeatured: false, isBestseller: true, stock: 24,
    description: 'Delicate petals rendered in rose-gold-plated sterling silver bloom into a sculptural ring that catches every angle of light. Lightweight and comfortable for daily wear, this piece pairs beautifully with casual and formal looks alike.',
    tags: JSON.stringify(['rose gold', 'floral', 'silver', 'everyday']),
  },
  {
    sku: 'AUR-RNG-004', name: 'Vintage Filigree Ring', slug: 'vintage-filigree-ring',
    category: 'rings', price: 4299, material: 'Gold-Plated Brass with CZ',
    isPremium: false, stock: 18,
    description: 'Intricate filigree lacework frames a cushion-cut cubic zirconia in this vintage-inspired ring. The warm gold plating evokes the craftsmanship of a bygone era while the CZ centre stone sparkles with impressive clarity.',
    tags: JSON.stringify(['filigree', 'vintage', 'gold plated', 'cz']),
  },
  {
    sku: 'AUR-RNG-005', name: 'Minimal Stack Ring', slug: 'minimal-stack-ring',
    category: 'rings', price: 1299, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 45,
    description: 'A whisper-thin sterling silver band designed for the art of stacking. Wear it alone for effortless minimalism or layer three together for a modern editorial look. Comes in a set of two for versatile styling.',
    tags: JSON.stringify(['minimal', 'stack', 'silver', 'everyday']),
  },
  {
    sku: 'AUR-RNG-006', name: 'Emerald Halo Ring', slug: 'emerald-halo-ring',
    category: 'rings', price: 6999, material: 'Gold-Plated Silver with Emerald CZ',
    isPremium: false, isFeatured: true, stock: 11,
    description: 'A vibrant green emerald-cut CZ is encircled by a delicate halo of white stones in this striking statement ring. The pavé band adds additional sparkle, making this piece a standout for evening occasions.',
    tags: JSON.stringify(['emerald', 'halo', 'statement', 'cocktail']),
  },
  {
    sku: 'AUR-RNG-007', name: 'Twisted Vine Ring', slug: 'twisted-vine-ring',
    category: 'rings', price: 2199, material: '925 Sterling Silver',
    isPremium: false, stock: 32,
    description: 'Two finely twisted silver wires intertwine in a graceful vine motif, creating a ring that is both organic and modern. The open-weave design catches light beautifully and sits comfortably on any finger.',
    tags: JSON.stringify(['twisted', 'vine', 'silver', 'organic']),
  },
  {
    sku: 'AUR-RNG-008', name: 'Pearl Embrace Ring', slug: 'pearl-embrace-ring',
    category: 'rings', price: 5499, material: 'Gold-Plated Silver with Freshwater Pearl',
    isPremium: false, stock: 9,
    description: 'A lustrous freshwater pearl, hand-selected for its even nacre, rests in a sculptural gold-plated prong setting that gently embraces it. This ring blends classical pearl elegance with a contemporary silhouette.',
    tags: JSON.stringify(['pearl', 'gold plated', 'classic', 'elegant']),
  },
  {
    sku: 'AUR-RNG-009', name: 'Infinity Love Ring', slug: 'infinity-love-ring',
    category: 'rings', price: 3799, material: 'Rose Gold-Plated Silver with CZ',
    isPremium: false, isBestseller: true, stock: 27,
    description: 'The infinity symbol, rendered in rose-gold-plated silver and traced with brilliant CZ stones, makes this ring an ideal gift for someone you cherish endlessly. Comfort-fit inner band ensures all-day wearability.',
    tags: JSON.stringify(['infinity', 'rose gold', 'romantic', 'gift']),
  },
  {
    sku: 'AUR-RNG-010', name: 'Geometric Sculptural Ring', slug: 'geometric-sculptural-ring',
    category: 'rings', price: 4799, material: '925 Sterling Silver',
    isPremium: false, stock: 14,
    description: 'Bold angular facets cut into solid sterling silver create a ring that is as much sculpture as jewellery. The wide statement band catches light from multiple planes, making this a conversation piece for design-conscious wearers.',
    tags: JSON.stringify(['geometric', 'statement', 'bold', 'silver']),
  },
  {
    sku: 'AUR-RNG-011', name: 'Diamond Pear Drop Ring', slug: 'diamond-pear-drop-ring',
    category: 'rings', price: 22000, material: '18k Gold with Pear Diamond',
    isPremium: true, isFeatured: true, stock: 2,
    description: 'A pear-shaped diamond of exceptional brilliance is suspended in a delicate 18k gold prong setting. The elongated silhouette of the stone flatters the hand beautifully. Accompanied by a full GIA certificate.',
    tags: JSON.stringify(['diamond', 'pear', 'luxury', 'premium', 'gift']),
  },
  {
    sku: 'AUR-RNG-012', name: 'Moonstone Cabochon Ring', slug: 'moonstone-cabochon-ring',
    category: 'rings', price: 7499, material: '925 Sterling Silver with Moonstone',
    isPremium: false, stock: 8,
    description: 'A smooth moonstone cabochon with its signature adularescent glow sits in a hand-forged sterling silver bezel. No two moonstones are identical, making each ring a unique piece with its own subtle shifting light.',
    tags: JSON.stringify(['moonstone', 'gemstone', 'silver', 'natural']),
  },
  {
    sku: 'AUR-RNG-013', name: 'Channel Set Eternity Band', slug: 'channel-set-eternity-band',
    category: 'rings', price: 8999, material: 'Gold-Plated Silver with CZ',
    isPremium: false, stock: 16,
    description: 'Channel-set round CZ stones run the full circumference of this polished eternity band, catching light with every movement. The sleek, borderless design makes it ideal as a wedding band or a standalone statement.',
    tags: JSON.stringify(['eternity', 'channel set', 'wedding', 'cz']),
  },
  {
    sku: 'AUR-RNG-014', name: 'Open Cuff Ring', slug: 'open-cuff-ring',
    category: 'rings', price: 1899, material: '925 Sterling Silver',
    isPremium: false, stock: 38,
    description: 'A minimalist open-ended band in polished sterling silver that adjusts gently to fit any finger size. The clean, unadorned surface catches the light beautifully, proving that true luxury lies in restraint.',
    tags: JSON.stringify(['minimal', 'open', 'adjustable', 'silver']),
  },
  {
    sku: 'AUR-RNG-015', name: 'Tri-Stone Trilogy Ring', slug: 'tri-stone-trilogy-ring',
    category: 'rings', price: 9499, material: 'Gold-Plated Silver with White CZ',
    isPremium: false, isFeatured: true, stock: 12,
    description: 'Three graduated oval CZ stones represent past, present, and future in this romantically symbolic trilogy ring. Set in warm gold-plated silver with a polished shank, this ring makes a meaningful engagement alternative.',
    tags: JSON.stringify(['trilogy', 'three stone', 'romantic', 'cz']),
  },
  {
    sku: 'AUR-RNG-016', name: 'Hammered Boho Ring', slug: 'hammered-boho-ring',
    category: 'rings', price: 1599, material: '925 Sterling Silver',
    isPremium: false, stock: 42,
    description: 'Gently hammered texture gives this simple silver band an artisanal, handcrafted quality. The organic surface catches light in a way that a polished band cannot, adding subtle visual depth to any ring stack.',
    tags: JSON.stringify(['hammered', 'boho', 'artisan', 'silver']),
  },
  {
    sku: 'AUR-RNG-017', name: 'Amethyst Oval Ring', slug: 'amethyst-oval-ring',
    category: 'rings', price: 5999, material: 'Gold-Plated Silver with Amethyst',
    isPremium: false, stock: 7,
    description: 'A rich purple amethyst, oval-faceted and set in a fine claw setting of gold-plated silver, brings a touch of royalty to the hand. The warm tones of the amethyst complement both yellow and rose-gold settings beautifully.',
    tags: JSON.stringify(['amethyst', 'purple', 'gemstone', 'gold plated']),
  },
  {
    sku: 'AUR-RNG-018', name: 'Snake Coil Ring', slug: 'snake-coil-ring',
    category: 'rings', price: 3299, material: 'Gold-Plated Brass with Black Enamel',
    isPremium: false, stock: 20,
    description: 'A sleek serpent coils twice around the finger, its scales rendered in lustrous gold-plated brass with a black enamel eye. Bold and symbolic, this ring draws from ancient jewellery traditions reimagined for the modern wardrobe.',
    tags: JSON.stringify(['snake', 'enamel', 'statement', 'bold']),
  },

  // ─── NECKLACES & PENDANTS (18) ───────────────────────────────
  {
    sku: 'AUR-NCK-001', name: 'Diamond Solitaire Pendant', slug: 'diamond-solitaire-pendant',
    category: 'necklaces', price: 16500, material: '18k Gold with Diamond',
    isPremium: true, isFeatured: true, isBestseller: true, stock: 4,
    description: 'A single brilliant-cut diamond suspended on an 18k gold trace chain — the jewellery wardrobe essential. Light and weightless against the skin, the pendant sits perfectly at the collarbone. Available in yellow, white, or rose gold.',
    tags: JSON.stringify(['diamond', 'pendant', 'classic', 'premium']),
  },
  {
    sku: 'AUR-NCK-002', name: 'Royal Kundan Choker', slug: 'royal-kundan-choker',
    category: 'necklaces', price: 24000, material: '22k Gold-Plated with Kundan & Meenakari',
    isPremium: true, isFeatured: true, stock: 2,
    description: 'Handcrafted over six days by Jaipur artisans, this elaborate Kundan choker features a central floral medallion surrounded by intricate meenakari enamel work on the reverse. Each stone is set in the traditional uncut Kundan fashion for an authentic heirloom quality.',
    tags: JSON.stringify(['kundan', 'choker', 'bridal', 'premium', 'handcrafted']),
  },
  {
    sku: 'AUR-NCK-003', name: 'Gold Layered Chain Set', slug: 'gold-layered-chain-set',
    category: 'necklaces', price: 12500, material: '18k Gold',
    isPremium: true, isFeatured: true, stock: 5,
    description: 'Three delicate 18k gold chains — a simple trace, a paperclip link, and a beaded strand — designed to be worn individually or layered together for a curated, editorial look. Lobster clasps ensure a secure fit at every length.',
    tags: JSON.stringify(['gold', 'layered', 'chain', 'premium']),
  },
  {
    sku: 'AUR-NCK-004', name: 'Pearl Strand Necklace', slug: 'pearl-strand-necklace',
    category: 'necklaces', price: 8999, material: 'Freshwater Pearls with Gold Clasp',
    isPremium: false, isFeatured: true, stock: 8,
    description: 'A single strand of graduated freshwater pearls, each hand-knotted on silk thread for security and drape, finished with an 18k-gold-plated box clasp. A timeless classic that transitions from boardroom to gala effortlessly.',
    tags: JSON.stringify(['pearl', 'classic', 'strand', 'elegant']),
  },
  {
    sku: 'AUR-NCK-005', name: 'Crescent Moon Pendant', slug: 'crescent-moon-pendant',
    category: 'necklaces', price: 2799, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 36,
    description: 'A delicate crescent moon in polished sterling silver hangs from a fine 45cm chain. The celestial motif has long symbolised intuition and feminine energy — wear it as a daily talisman or layer it with the Star Pendant for a complete sky story.',
    tags: JSON.stringify(['moon', 'celestial', 'silver', 'everyday']),
  },
  {
    sku: 'AUR-NCK-006', name: 'Mangalsutra Pendant Necklace', slug: 'mangalsutra-pendant-necklace',
    category: 'necklaces', price: 4999, material: 'Gold-Plated Silver with Black Beads',
    isPremium: false, stock: 22,
    description: 'A contemporary take on the traditional mangalsutra, this pendant features a geometric gold-plated motif on a slim chain interspersed with black beads. It honours tradition while fitting seamlessly into modern, everyday wear.',
    tags: JSON.stringify(['mangalsutra', 'traditional', 'modern', 'gold plated']),
  },
  {
    sku: 'AUR-NCK-007', name: 'Hexagon Pendant Necklace', slug: 'hexagon-pendant-necklace',
    category: 'necklaces', price: 3299, material: 'Rose Gold-Plated Silver',
    isPremium: false, isBestseller: true, stock: 28,
    description: 'A clean geometric hexagon frame in rose-gold-plated silver encloses a single, perfect CZ stone. The angular form contrasts beautifully with soft necklines, making this pendant a versatile everyday favourite.',
    tags: JSON.stringify(['geometric', 'hexagon', 'rose gold', 'pendant']),
  },
  {
    sku: 'AUR-NCK-008', name: 'Layered Tassel Necklace', slug: 'layered-tassel-necklace',
    category: 'necklaces', price: 5299, material: 'Gold-Plated Brass with Crystal Tassels',
    isPremium: false, stock: 13,
    description: 'Three layers of delicate chain cascade into a fringe of crystal-tipped tassels for a necklace that moves and catches light with every step. Bohemian at heart but polished enough for a formal occasion.',
    tags: JSON.stringify(['tassel', 'layered', 'boho', 'statement']),
  },
  {
    sku: 'AUR-NCK-009', name: 'Initial Letter Pendant', slug: 'initial-letter-pendant',
    category: 'necklaces', price: 2499, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 50,
    description: 'Personalise your look with this hand-finished initial letter pendant in sterling silver, available in all 26 letters. The elegant script typeface gives each letter an organic, artisan quality. A thoughtful gift that feels genuinely personal.',
    tags: JSON.stringify(['initial', 'personalised', 'silver', 'gift']),
  },
  {
    sku: 'AUR-NCK-010', name: 'Topaz Drop Necklace', slug: 'topaz-drop-necklace',
    category: 'necklaces', price: 6799, material: 'Gold-Plated Silver with Blue Topaz',
    isPremium: false, stock: 10,
    description: 'A faceted teardrop of sky-blue topaz is prong-set in gold-plated silver and suspended on a fine cable chain. The vivid blue stone sits beautifully against both warm and cool skin tones, adding a pop of colour to any neckline.',
    tags: JSON.stringify(['topaz', 'blue', 'gemstone', 'drop pendant']),
  },
  {
    sku: 'AUR-NCK-011', name: 'Diamond Tennis Necklace', slug: 'diamond-tennis-necklace',
    category: 'necklaces', price: 45000, material: '18k White Gold with Diamonds',
    isPremium: true, isFeatured: true, stock: 1,
    description: 'Forty-two round brilliant diamonds totalling 3.5 carats are channel-set in a continuous line of 18k white gold, creating the iconic tennis necklace silhouette. A statement piece of extraordinary luxury, this is jewellery to be passed down through generations.',
    tags: JSON.stringify(['diamond', 'tennis', 'luxury', 'premium', 'white gold']),
  },
  {
    sku: 'AUR-NCK-012', name: 'Oxidised Tribal Pendant', slug: 'oxidised-tribal-pendant',
    category: 'necklaces', price: 1899, material: 'Oxidised Silver',
    isPremium: false, stock: 40,
    description: 'A bold tribal-inspired pendant in oxidised sterling silver, detailed with traditional motifs and finished with a matte black patina. The strong geometric design pairs effortlessly with ethnic kurtas and casual Western wear.',
    tags: JSON.stringify(['oxidised', 'tribal', 'silver', 'ethnic']),
  },
  {
    sku: 'AUR-NCK-013', name: 'Floating Diamond Necklace', slug: 'floating-diamond-necklace',
    category: 'necklaces', price: 9999, material: '14k Gold with Illusion-Set Diamonds',
    isPremium: false, isFeatured: true, stock: 6,
    description: 'Three diamonds appear to float along a near-invisible 14k gold chain, thanks to their illusion settings. The effect is impossibly delicate and modern, creating the illusion of light dancing at your neckline.',
    tags: JSON.stringify(['diamond', 'floating', 'illusion', 'delicate']),
  },
  {
    sku: 'AUR-NCK-014', name: 'Choker Collar Necklace', slug: 'choker-collar-necklace',
    category: 'necklaces', price: 3999, material: 'Gold-Plated Brass',
    isPremium: false, stock: 17,
    description: 'A structured collar-style choker in polished gold-plated brass sits snugly at the base of the throat. The rigid form-fitting silhouette gives an editorial edge to any look, whether worn with a plunging neckline or a high collar.',
    tags: JSON.stringify(['choker', 'collar', 'statement', 'gold plated']),
  },
  {
    sku: 'AUR-NCK-015', name: 'Floral Motif Long Necklace', slug: 'floral-motif-long-necklace',
    category: 'necklaces', price: 7299, material: 'Gold-Plated Silver with CZ',
    isPremium: false, stock: 9,
    description: 'An intricate floral medallion pendant hangs at opera length from a gold-plated silver chain, perfect for layering or wearing alone over a plain blouse. The CZ-studded petals catch the light as beautifully as real gemstones.',
    tags: JSON.stringify(['floral', 'long', 'opera', 'pendant']),
  },
  {
    sku: 'AUR-NCK-016', name: 'Herringbone Chain', slug: 'herringbone-chain',
    category: 'necklaces', price: 5999, material: '925 Sterling Silver',
    isPremium: false, stock: 15,
    description: 'The herringbone weave creates a liquid, ribbon-like chain that drapes flat against the skin. This sterling silver version is polished to a high mirror finish, creating a visual impact that rivals far more expensive pieces.',
    tags: JSON.stringify(['chain', 'herringbone', 'silver', 'modern']),
  },
  {
    sku: 'AUR-NCK-017', name: 'Ruby Halo Pendant', slug: 'ruby-halo-pendant',
    category: 'necklaces', price: 7999, material: 'Gold-Plated Silver with Ruby CZ',
    isPremium: false, isFeatured: true, stock: 11,
    description: 'A rich crimson ruby CZ, encircled by a halo of white pavé stones, makes this pendant a bold declaration of colour. The warm gold setting intensifies the red, creating a piece that commands attention from across the room.',
    tags: JSON.stringify(['ruby', 'red', 'halo', 'pendant']),
  },
  {
    sku: 'AUR-NCK-018', name: 'Bar & Chain Necklace', slug: 'bar-chain-necklace',
    category: 'necklaces', price: 2199, material: 'Rose Gold-Plated Silver',
    isPremium: false, isBestseller: true, stock: 33,
    description: 'A slim horizontal bar in rose-gold-plated silver hangs from a delicate trace chain — a modern classic that pairs with everything from a white T-shirt to an evening gown. The clean lines and warm metal tone make this a perennial best-seller.',
    tags: JSON.stringify(['bar', 'minimal', 'rose gold', 'everyday']),
  },

  // ─── EARRINGS (18) ───────────────────────────────────────────
  {
    sku: 'AUR-EAR-001', name: 'Diamond Stud Earrings', slug: 'diamond-stud-earrings',
    category: 'earrings', price: 12999, material: '18k Gold with Diamonds',
    isPremium: true, isFeatured: true, isBestseller: true, stock: 5,
    description: 'A matched pair of round brilliant diamonds, each 0.25 carats, set in classic four-claw 18k gold settings. Diamond studs are the cornerstone of every fine jewellery collection — these are the pair you will wear every single day.',
    tags: JSON.stringify(['diamond', 'stud', 'classic', 'premium']),
  },
  {
    sku: 'AUR-EAR-002', name: 'Pearl Drop Earrings', slug: 'pearl-drop-earrings',
    category: 'earrings', price: 4799, material: 'Gold-Plated Silver with Freshwater Pearls',
    isPremium: false, isBestseller: true, stock: 22,
    description: 'Lustrous freshwater pearls dangle from slender gold-plated hooks, swaying gently with every movement. The elongated drop silhouette is universally flattering and lends effortless elegance to any occasion from office to celebration.',
    tags: JSON.stringify(['pearl', 'drop', 'elegant', 'classic']),
  },
  {
    sku: 'AUR-EAR-003', name: 'Geometric Hoop Earrings', slug: 'geometric-hoop-earrings',
    category: 'earrings', price: 2299, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 38,
    description: 'Angular cutouts transform a classic hoop into a modern geometric statement. These sterling silver hoops are lightweight enough for all-day wear and substantial enough to be the focal point of your look.',
    tags: JSON.stringify(['hoop', 'geometric', 'silver', 'statement']),
  },
  {
    sku: 'AUR-EAR-004', name: 'Chandelier Jhumka', slug: 'chandelier-jhumka',
    category: 'earrings', price: 3499, material: 'Gold-Plated Brass with CZ',
    isPremium: false, isFeatured: true, stock: 19,
    description: 'The traditional jhumka bell reimagined with contemporary proportions and a full pavé of CZ stones that cascade from a hemispherical dome. These versatile earrings bridge the gap between traditional and modern Indian style with effortless grace.',
    tags: JSON.stringify(['jhumka', 'indian', 'traditional', 'chandelier']),
  },
  {
    sku: 'AUR-EAR-005', name: 'Celestial Star Studs', slug: 'celestial-star-studs',
    category: 'earrings', price: 1799, material: '925 Sterling Silver with CZ',
    isPremium: false, isBestseller: true, stock: 55,
    description: 'Five-pointed star studs encrusted with micro-pavé CZ stones that catch the light beautifully. These small, refined studs are perfect for those who prefer subtle sparkle without overstatement.',
    tags: JSON.stringify(['star', 'celestial', 'stud', 'silver']),
  },
  {
    sku: 'AUR-EAR-006', name: 'Threader Chain Earrings', slug: 'threader-chain-earrings',
    category: 'earrings', price: 2099, material: '925 Sterling Silver',
    isPremium: false, stock: 26,
    description: 'A fine silver chain threads through the piercing and hangs at different lengths either side of the ear, creating an asymmetric, architectural effect. Minimalist and striking, this is the earring for a woman who values a considered edge.',
    tags: JSON.stringify(['threader', 'minimal', 'architectural', 'silver']),
  },
  {
    sku: 'AUR-EAR-007', name: 'Ruby Teardrop Earrings', slug: 'ruby-teardrop-earrings',
    category: 'earrings', price: 5299, material: 'Gold-Plated Silver with Ruby CZ',
    isPremium: false, stock: 14,
    description: 'Faceted ruby-red teardrops in vivid CZ catch the light from every angle, suspended from gold-plated hooks with a single round white CZ connector. The contrast of red and gold is deeply luxurious and entirely timeless.',
    tags: JSON.stringify(['ruby', 'red', 'teardrop', 'gold plated']),
  },
  {
    sku: 'AUR-EAR-008', name: 'Huggie Hoop Earrings', slug: 'huggie-hoop-earrings',
    category: 'earrings', price: 3299, material: 'Gold-Plated Silver with CZ',
    isPremium: false, isBestseller: true, stock: 30,
    description: 'Small, perfectly proportioned hoops hug the earlobe snugly while a pavé of CZ stones lines the outer face. The huggie style is endlessly wearable — smart enough for a meeting, cool enough for a weekend brunch.',
    tags: JSON.stringify(['huggie', 'hoop', 'cz', 'everyday']),
  },
  {
    sku: 'AUR-EAR-009', name: 'Tassel Fringe Earrings', slug: 'tassel-fringe-earrings',
    category: 'earrings', price: 2899, material: 'Gold-Plated Brass with Crystal',
    isPremium: false, stock: 16,
    description: 'Long crystal-tipped tassels fall from a circular pavé disc, creating earrings that move and sparkle with every turn of the head. Wear these with a simple dress to let the earrings do all the talking.',
    tags: JSON.stringify(['tassel', 'fringe', 'statement', 'crystal']),
  },
  {
    sku: 'AUR-EAR-010', name: 'Ear Cuff Set', slug: 'ear-cuff-set',
    category: 'earrings', price: 1999, material: '925 Sterling Silver',
    isPremium: false, stock: 25,
    description: 'A set of three sterling silver ear cuffs — one plain, one twisted, one set with a single CZ — designed to be worn together up the cartilage for an editorial, multi-pierced look. No piercing required for two of the three pieces.',
    tags: JSON.stringify(['ear cuff', 'cartilage', 'set', 'silver']),
  },
  {
    sku: 'AUR-EAR-011', name: 'Emerald Marquise Earrings', slug: 'emerald-marquise-earrings',
    category: 'earrings', price: 6499, material: 'Gold-Plated Silver with Emerald CZ',
    isPremium: false, stock: 8,
    description: 'Marquise-cut emerald CZ stones in a deep forest green are set east-west in polished gold-plated silver. The horizontal orientation of the marquise cut makes these earrings look wider on the earlobe, adding visual drama without excessive length.',
    tags: JSON.stringify(['emerald', 'marquise', 'green', 'statement']),
  },
  {
    sku: 'AUR-EAR-012', name: 'Oxidised Tribal Jhumka', slug: 'oxidised-tribal-jhumka',
    category: 'earrings', price: 1499, material: 'Oxidised Silver with Turquoise',
    isPremium: false, stock: 45,
    description: 'Heavy oxidised silver bells are embellished with turquoise stone inlays and tribal motifs inspired by Rajasthani craft traditions. These earrings are handmade, so each pair carries slight variations that only add to their character.',
    tags: JSON.stringify(['oxidised', 'tribal', 'jhumka', 'turquoise', 'ethnic']),
  },
  {
    sku: 'AUR-EAR-013', name: 'Diamond Halo Drop Earrings', slug: 'diamond-halo-drop-earrings',
    category: 'earrings', price: 28000, material: '18k Gold with Diamonds',
    isPremium: true, isFeatured: true, stock: 2,
    description: 'Each earring features a halo of nine brilliant-cut diamonds surrounding a central princess-cut stone, all set in lustrous 18k yellow gold. These drop earrings transform any face, adding elegance and light that no photographer can resist.',
    tags: JSON.stringify(['diamond', 'halo', 'drop', 'premium', 'luxury']),
  },
  {
    sku: 'AUR-EAR-014', name: 'Twisted Hoop Earrings', slug: 'twisted-hoop-earrings',
    category: 'earrings', price: 2599, material: '925 Sterling Silver',
    isPremium: false, stock: 29,
    description: 'A classic round hoop is given texture and dimension through a precisely twisted wire construction. In polished sterling silver, these earrings suit anyone and any occasion — the perfect answer when you cannot decide what to wear.',
    tags: JSON.stringify(['hoop', 'twisted', 'silver', 'classic']),
  },
  {
    sku: 'AUR-EAR-015', name: 'Sapphire Cluster Studs', slug: 'sapphire-cluster-studs',
    category: 'earrings', price: 5799, material: 'Gold-Plated Silver with Blue Sapphire CZ',
    isPremium: false, stock: 11,
    description: 'Seven sapphire-blue CZ stones are clustered in a floral formation, creating studs that offer the visual impact of a much larger stone. Set in warm gold-plated silver, the vivid blue adds colour without being overpowering.',
    tags: JSON.stringify(['sapphire', 'blue', 'cluster', 'stud']),
  },
  {
    sku: 'AUR-EAR-016', name: 'Feather Drop Earrings', slug: 'feather-drop-earrings',
    category: 'earrings', price: 3799, material: 'Gold-Plated Brass',
    isPremium: false, stock: 18,
    description: 'Long, slender feather-shaped drops in polished gold-plated brass taper to a fine point, catching light as they swing. These earrings reference the boho-luxe aesthetic — free-spirited but deeply considered in their craftsmanship.',
    tags: JSON.stringify(['feather', 'drop', 'boho', 'gold plated']),
  },
  {
    sku: 'AUR-EAR-017', name: 'Enamel Floral Studs', slug: 'enamel-floral-studs',
    category: 'earrings', price: 1299, material: 'Gold-Plated Brass with Enamel',
    isPremium: false, isBestseller: true, stock: 60,
    description: 'Cheerful flower-shaped studs with colourful enamel petals and a CZ centre — available in five colour options. These are the earrings for colour lovers who want a pop of joy in their everyday jewellery rotation.',
    tags: JSON.stringify(['enamel', 'floral', 'colourful', 'stud']),
  },
  {
    sku: 'AUR-EAR-018', name: 'Asymmetric Mismatch Set', slug: 'asymmetric-mismatch-set',
    category: 'earrings', price: 4199, material: '925 Sterling Silver with CZ',
    isPremium: false, stock: 21,
    description: 'One delicate stud and one longer chain drop are sold as a deliberate pair in this fashion-forward set. The intentional asymmetry references the editorial style of high-fashion jewellery, giving your look a curated, considered edge.',
    tags: JSON.stringify(['asymmetric', 'mismatch', 'fashion', 'silver']),
  },

  // ─── BANGLES & BRACELETS (15) ─────────────────────────────────
  {
    sku: 'AUR-BNG-001', name: 'Solid Gold Kangan Bangle', slug: 'solid-gold-kangan-bangle',
    category: 'bangles', price: 35000, material: '22k Gold',
    isPremium: true, isFeatured: true, stock: 2,
    description: 'Crafted from solid 22-karat gold, this traditional kangan-style bangle features a finely engraved floral border running its full circumference. A genuine investment piece that accrues value over time and is intended to be worn for a lifetime.',
    tags: JSON.stringify(['gold', 'bangle', 'solid gold', 'traditional', 'premium']),
  },
  {
    sku: 'AUR-BNG-002', name: 'Diamond Bangle', slug: 'diamond-bangle',
    category: 'bangles', price: 42000, material: '18k Gold with Diamonds',
    isPremium: true, isFeatured: true, stock: 1,
    description: 'Fifty-six round brilliant diamonds totalling 2.8 carats are channel-set around the full diameter of this rigid 18k gold bangle. The continuous circle of diamonds creates an unbroken ribbon of brilliance — a true collector\'s piece.',
    tags: JSON.stringify(['diamond', 'bangle', 'luxury', 'premium', 'channel set']),
  },
  {
    sku: 'AUR-BNG-003', name: 'Silver Kadha Bangle', slug: 'silver-kadha-bangle',
    category: 'bangles', price: 3999, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 22,
    description: 'A broad sterling silver kadha with an engraved geometric border — sturdy and substantial enough to wear as a standalone statement. The high-polished surface catches light beautifully and the wide form makes it a versatile everyday accessory.',
    tags: JSON.stringify(['kadha', 'silver', 'bangle', 'everyday']),
  },
  {
    sku: 'AUR-BNG-004', name: 'Glass Bangle Set', slug: 'glass-bangle-set',
    category: 'bangles', price: 899, material: 'Coloured Glass with Gold Trim',
    isPremium: false, isBestseller: true, stock: 70,
    description: 'A set of twelve handmade glass bangles in a curated mix of jewel tones and nude shades, each with a delicate gold-painted rim. Stack the entire set for a traditional look or mix a few with your metal bangles for an eclectic, contemporary vibe.',
    tags: JSON.stringify(['glass', 'set', 'colourful', 'traditional']),
  },
  {
    sku: 'AUR-BNG-005', name: 'Tennis Bracelet', slug: 'tennis-bracelet',
    category: 'bangles', price: 9499, material: 'Gold-Plated Silver with CZ',
    isPremium: false, isFeatured: true, stock: 12,
    description: 'The iconic tennis bracelet silhouette, rendered in gold-plated silver and set with a continuous line of round CZ stones. A classic that never dates, this bracelet suits every wrist and every occasion from casual to formal.',
    tags: JSON.stringify(['tennis', 'bracelet', 'cz', 'classic']),
  },
  {
    sku: 'AUR-BNG-006', name: 'Charm Bracelet', slug: 'charm-bracelet',
    category: 'bangles', price: 5499, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 16,
    description: 'A sterling silver cable chain bracelet comes pre-loaded with five signature Aurelia charms: a crescent moon, a tiny heart, a star, an evil eye bead, and a small flower. Add more charms over time to build a story on your wrist.',
    tags: JSON.stringify(['charm', 'bracelet', 'silver', 'gift']),
  },
  {
    sku: 'AUR-BNG-007', name: 'Cuff Bracelet Wide', slug: 'cuff-bracelet-wide',
    category: 'bangles', price: 4299, material: 'Gold-Plated Brass',
    isPremium: false, stock: 14,
    description: 'A wide, open cuff in hammered gold-plated brass makes a powerful statement on the wrist. The organic hammered texture mimics the work of a traditional goldsmith, giving this modern piece an artisanal quality.',
    tags: JSON.stringify(['cuff', 'wide', 'hammered', 'gold plated']),
  },
  {
    sku: 'AUR-BNG-008', name: 'Beaded Gemstone Bracelet', slug: 'beaded-gemstone-bracelet',
    category: 'bangles', price: 2499, material: 'Natural Gemstone Beads with Silver Clasp',
    isPremium: false, stock: 28,
    description: 'Natural semi-precious stone beads — amethyst, rose quartz, and clear crystal — are strung on an elastic thread for an easy-on-off fit. The combination of stones is said to promote calm and clarity, making this a bracelet for mindful dressing.',
    tags: JSON.stringify(['beaded', 'gemstone', 'crystal', 'natural']),
  },
  {
    sku: 'AUR-BNG-009', name: 'Link Chain Bracelet', slug: 'link-chain-bracelet',
    category: 'bangles', price: 3799, material: '925 Sterling Silver',
    isPremium: false, stock: 20,
    description: 'A bold paper-clip chain bracelet in polished sterling silver — the chain jewellery trend translated to the wrist. The oversized oval links have a tactile, weighty quality that makes this bracelet feel substantial and luxurious.',
    tags: JSON.stringify(['chain', 'link', 'paperclip', 'silver']),
  },
  {
    sku: 'AUR-BNG-010', name: 'Kundan Bangle Set', slug: 'kundan-bangle-set',
    category: 'bangles', price: 7999, material: 'Gold-Plated Brass with Kundan',
    isPremium: false, isFeatured: true, stock: 6,
    description: 'A pair of intricate Kundan-work bangles in gold-plated brass, featuring uncut stones arranged in traditional floral and paisley patterns. The meenakari enamel detailing on the inner face reveals a hidden artistry seen only when you remove them.',
    tags: JSON.stringify(['kundan', 'bangle', 'traditional', 'bridal']),
  },
  {
    sku: 'AUR-BNG-011', name: 'Skinny Stack Bangles Set', slug: 'skinny-stack-bangles-set',
    category: 'bangles', price: 2299, material: 'Gold-Plated Brass',
    isPremium: false, isBestseller: true, stock: 35,
    description: 'A set of five ultra-thin bangles in assorted finishes — two plain, two hammered, one twisted — designed to be worn stacked together or mixed with other pieces. The set comes in a lovely gift box.',
    tags: JSON.stringify(['stack', 'bangle', 'set', 'thin']),
  },
  {
    sku: 'AUR-BNG-012', name: 'Evil Eye Bracelet', slug: 'evil-eye-bracelet',
    category: 'bangles', price: 1999, material: 'Gold-Plated Silver with Enamel',
    isPremium: false, isBestseller: true, stock: 50,
    description: 'The ancient evil-eye talisman is rendered in vibrant blue enamel, suspended from a delicate gold-plated chain bracelet. Wear it as a daily protective amulet and a beautiful accent piece — spiritual and stylish in equal measure.',
    tags: JSON.stringify(['evil eye', 'talisman', 'enamel', 'gold plated']),
  },
  {
    sku: 'AUR-BNG-013', name: 'Vintage Pearl Bracelet', slug: 'vintage-pearl-bracelet',
    category: 'bangles', price: 6299, material: 'Gold-Plated Silver with Freshwater Pearls',
    isPremium: false, stock: 9,
    description: 'Freshwater pearls are individually knotted on a gold-plated chain, creating a bracelet with the drape and elegance of a vintage European piece. The lobster clasp closes with a satisfying click, holding everything securely in place.',
    tags: JSON.stringify(['pearl', 'vintage', 'classic', 'bracelet']),
  },
  {
    sku: 'AUR-BNG-014', name: 'Adjustable Dainty Bracelet', slug: 'adjustable-dainty-bracelet',
    category: 'bangles', price: 1299, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 60,
    description: 'A whisper-thin sterling silver chain bracelet with an extender for a custom fit, finished with a tiny heart charm at the end. Dainty but durable, this is the bracelet you never take off.',
    tags: JSON.stringify(['dainty', 'adjustable', 'silver', 'everyday']),
  },
  {
    sku: 'AUR-BNG-015', name: 'Oxidised Kada Set', slug: 'oxidised-kada-set',
    category: 'bangles', price: 2799, material: 'Oxidised Silver',
    isPremium: false, stock: 24,
    description: 'A pair of oxidised silver kadas engraved with traditional motifs — peacocks, lotuses, and geometric borders — that reference India\'s rich craft heritage. The dark patina throws the engraved details into sharp relief.',
    tags: JSON.stringify(['oxidised', 'kada', 'traditional', 'silver', 'ethnic']),
  },

  // ─── MANGALSUTRA (8) ─────────────────────────────────────────
  {
    sku: 'AUR-MNG-001', name: 'Classic Gold Mangalsutra', slug: 'classic-gold-mangalsutra',
    category: 'mangalsutra', price: 8999, material: '22k Gold with Black Beads',
    isPremium: false, isFeatured: true, stock: 10,
    description: 'A traditional yet refined mangalsutra featuring black and gold beads strung on a 22k gold chain, finished with a classic double-disc pendant. The elegant simplicity of this design makes it suitable for both daily wear and special occasions.',
    tags: JSON.stringify(['mangalsutra', 'gold', 'traditional', 'daily wear']),
  },
  {
    sku: 'AUR-MNG-002', name: 'Modern Solitaire Mangalsutra', slug: 'modern-solitaire-mangalsutra',
    category: 'mangalsutra', price: 5999, material: 'Gold-Plated Silver with CZ',
    isPremium: false, isBestseller: true, stock: 15,
    description: 'This contemporary mangalsutra replaces the traditional pendant with a single brilliant CZ solitaire, making it virtually indistinguishable from a modern fine-jewellery necklace while retaining its sacred symbolism.',
    tags: JSON.stringify(['mangalsutra', 'modern', 'solitaire', 'everyday']),
  },
  {
    sku: 'AUR-MNG-003', name: 'Diamond Mangalsutra', slug: 'diamond-mangalsutra',
    category: 'mangalsutra', price: 19500, material: '18k Gold with Diamonds',
    isPremium: true, isFeatured: true, stock: 3,
    description: 'A contemporary mangalsutra pendant set with four round brilliant diamonds totalling 0.40 carats in 18k white and yellow gold. The pendant\'s geometric design gives a modern edge to this sacred piece, making it feel as at home at a corporate meeting as at a wedding.',
    tags: JSON.stringify(['mangalsutra', 'diamond', 'premium', 'modern']),
  },
  {
    sku: 'AUR-MNG-004', name: 'Wati Pendant Mangalsutra', slug: 'wati-pendant-mangalsutra',
    category: 'mangalsutra', price: 4499, material: 'Gold-Plated Silver with Black Beads',
    isPremium: false, stock: 20,
    description: 'A wati (bowl-shaped) pendant in gold-plated silver hangs from a chain interspersed with traditional black and gold beads. The bowl shape is considered auspicious and holds deep cultural significance in Indian wedding traditions.',
    tags: JSON.stringify(['mangalsutra', 'wati', 'traditional', 'gold plated']),
  },
  {
    sku: 'AUR-MNG-005', name: 'Thin Chain Mangalsutra', slug: 'thin-chain-mangalsutra',
    category: 'mangalsutra', price: 3299, material: 'Gold-Plated Silver',
    isPremium: false, isBestseller: true, stock: 28,
    description: 'A barely-there mangalsutra for the minimalist bride — a whisper-thin gold-plated chain with the tiniest black bead pattern and a small, polished pendant. Wear it every day without thinking about it.',
    tags: JSON.stringify(['mangalsutra', 'minimal', 'thin', 'everyday']),
  },
  {
    sku: 'AUR-MNG-006', name: 'South Indian Thali', slug: 'south-indian-thali',
    category: 'mangalsutra', price: 6499, material: '22k Gold-Plated with Yellow Cord',
    isPremium: false, stock: 12,
    description: 'A traditional South Indian thali pendant in 22k gold-plated brass, strung on the auspicious yellow turmeric cord. The two-piece pendant design follows Brahminical tradition, with each side representing the joining of two families.',
    tags: JSON.stringify(['thali', 'south indian', 'traditional', 'wedding']),
  },
  {
    sku: 'AUR-MNG-007', name: 'Floral Disc Mangalsutra', slug: 'floral-disc-mangalsutra',
    category: 'mangalsutra', price: 4999, material: 'Gold-Plated Silver with CZ',
    isPremium: false, stock: 17,
    description: 'A circular pendant engraved with a delicate lotus motif and studded with CZ stones makes this mangalsutra feel like a jewellery piece first and a marital symbol second. For the modern bride who wants beauty with meaning.',
    tags: JSON.stringify(['mangalsutra', 'floral', 'lotus', 'modern']),
  },
  {
    sku: 'AUR-MNG-008', name: 'Kundan Bridal Mangalsutra', slug: 'kundan-bridal-mangalsutra',
    category: 'mangalsutra', price: 9499, material: 'Gold-Plated Brass with Kundan',
    isPremium: false, isFeatured: true, stock: 8,
    description: 'An elaborate Kundan-set mangalsutra pendant featuring a peacock motif with vibrant meenakari enamel work on the reverse. This bridal statement piece pairs beautifully with a heavy lehenga or saree at a traditional Indian wedding.',
    tags: JSON.stringify(['mangalsutra', 'kundan', 'bridal', 'peacock']),
  },

  // ─── ANKLETS (6) ─────────────────────────────────────────────
  {
    sku: 'AUR-ANK-001', name: 'Silver Payal Anklet', slug: 'silver-payal-anklet',
    category: 'anklets', price: 1999, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 40,
    description: 'A fine sterling silver chain anklet with tiny bell charms that chime softly with each step — the traditional payal brought to life in pure silver. The classic design works with both ethnic and contemporary footwear.',
    tags: JSON.stringify(['payal', 'anklet', 'silver', 'bells', 'traditional']),
  },
  {
    sku: 'AUR-ANK-002', name: 'Gold Layered Anklet', slug: 'gold-layered-anklet',
    category: 'anklets', price: 3299, material: 'Gold-Plated Silver',
    isPremium: false, isBestseller: true, stock: 28,
    description: 'Two delicate gold-plated chains of slightly different lengths are joined at the clasp, creating a layered effect that adds visual interest without weight. Perfect for summer sandals and beachwear.',
    tags: JSON.stringify(['anklet', 'layered', 'gold plated', 'summer']),
  },
  {
    sku: 'AUR-ANK-003', name: 'Beaded Boho Anklet', slug: 'beaded-boho-anklet',
    category: 'anklets', price: 899, material: 'Seed Beads with Silver Clasp',
    isPremium: false, stock: 55,
    description: 'Tiny seed beads in turquoise, coral, and white are hand-strung on a stretch thread to create a comfortable, colourful anklet. The boho aesthetic pairs beautifully with maxi skirts, palazzos, and beach wraps.',
    tags: JSON.stringify(['beaded', 'boho', 'colourful', 'summer']),
  },
  {
    sku: 'AUR-ANK-004', name: 'Evil Eye Anklet', slug: 'evil-eye-anklet',
    category: 'anklets', price: 1699, material: 'Gold-Plated Silver with Enamel',
    isPremium: false, stock: 32,
    description: 'An evil eye charm in vivid blue enamel dangles from a delicate gold-plated chain anklet. The protective talisman motif makes this both a fashion accessory and a meaningful gift for someone you care about.',
    tags: JSON.stringify(['evil eye', 'anklet', 'talisman', 'enamel']),
  },
  {
    sku: 'AUR-ANK-005', name: 'Charm Anklet Set', slug: 'charm-anklet-set',
    category: 'anklets', price: 2799, material: '925 Sterling Silver',
    isPremium: false, stock: 18,
    description: 'A sterling silver anklet comes with a set of five interchangeable charms: a starfish, a flip-flop, a heart, a seashell, and a tiny sun. Swap them according to your mood or the season.',
    tags: JSON.stringify(['charm', 'anklet', 'interchangeable', 'silver']),
  },
  {
    sku: 'AUR-ANK-006', name: 'Diamond Cut Anklet', slug: 'diamond-cut-anklet',
    category: 'anklets', price: 4499, material: 'Gold-Plated Silver',
    isPremium: false, stock: 15,
    description: 'A substantial gold-plated chain anklet with diamond-cut links that sparkle in the light. More substantial than a fine-chain design, this anklet has an almost bangle-like presence on the ankle.',
    tags: JSON.stringify(['diamond cut', 'chain', 'anklet', 'substantial']),
  },

  // ─── NOSE PINS & ACCESSORIES (8) ─────────────────────────────
  {
    sku: 'AUR-NOS-001', name: 'CZ Nose Pin', slug: 'cz-nose-pin',
    category: 'nosepins', price: 499, material: 'Gold-Plated Silver with CZ',
    isPremium: false, isBestseller: true, stock: 80,
    description: 'A single brilliant CZ in a delicate gold-plated setting — the everyday nose pin that catches the light without being ostentatious. The flat back pin style ensures a flush, comfortable fit throughout the day.',
    tags: JSON.stringify(['nose pin', 'cz', 'everyday', 'gold plated']),
  },
  {
    sku: 'AUR-NOS-002', name: 'Diamond Nose Stud', slug: 'diamond-nose-stud',
    category: 'nosepins', price: 4999, material: '18k Gold with Diamond',
    isPremium: false, stock: 20,
    description: 'A single 0.05 carat round brilliant diamond set in a 18k gold bezel for the most refined possible nose stud. The bezel setting protects the diamond while keeping the profile virtually flat against the nostril.',
    tags: JSON.stringify(['diamond', 'nose stud', 'gold', 'refined']),
  },
  {
    sku: 'AUR-NOS-003', name: 'Floral Nath Nose Ring', slug: 'floral-nath-nose-ring',
    category: 'nosepins', price: 1799, material: 'Gold-Plated Brass with CZ',
    isPremium: false, isFeatured: true, stock: 25,
    description: 'A traditional nath (nose ring) with a floral cluster of CZ stones at its centre — sized for a subtle, wearable look rather than a large ceremonial piece. Suitable for both everyday wear and ethnic occasions.',
    tags: JSON.stringify(['nath', 'nose ring', 'floral', 'traditional']),
  },
  {
    sku: 'AUR-NOS-004', name: 'Ruby Nose Pin', slug: 'ruby-nose-pin',
    category: 'nosepins', price: 799, material: 'Gold-Plated Silver with Ruby CZ',
    isPremium: false, stock: 60,
    description: 'A rich red ruby CZ in a gold-plated setting adds a vivid pop of colour to the face. In Indian beauty tradition, red nose pins are considered especially auspicious for married women.',
    tags: JSON.stringify(['ruby', 'nose pin', 'red', 'traditional']),
  },
  {
    sku: 'AUR-NOS-005', name: 'Emerald Nose Stud', slug: 'emerald-nose-stud',
    category: 'nosepins', price: 699, material: 'Gold-Plated Silver with Emerald CZ',
    isPremium: false, stock: 55,
    description: 'A vibrant green emerald CZ in a simple gold-plated claw setting. The deep green adds a striking contrast to warm skin tones and makes this one of the most distinctive nose pin options in the collection.',
    tags: JSON.stringify(['emerald', 'nose stud', 'green', 'gold plated']),
  },
  {
    sku: 'AUR-NOS-006', name: 'Pearl Nose Pin', slug: 'pearl-nose-pin',
    category: 'nosepins', price: 999, material: 'Gold-Plated Silver with Freshwater Pearl',
    isPremium: false, isBestseller: true, stock: 45,
    description: 'A tiny freshwater pearl in a delicate gold-plated setting has a quiet, refined elegance that suits every occasion. Pearls have long been associated with purity and wisdom in South Asian jewellery tradition.',
    tags: JSON.stringify(['pearl', 'nose pin', 'elegant', 'classic']),
  },
  {
    sku: 'AUR-NOS-007', name: 'Sapphire Blue Nose Ring', slug: 'sapphire-blue-nose-ring',
    category: 'nosepins', price: 899, material: 'Gold-Plated Silver with Sapphire CZ',
    isPremium: false, stock: 35,
    description: 'A vivid sapphire-blue CZ catches the eye without overwhelming the face. The hoop style of this nose ring is slightly larger than a stud, making it a bolder statement piece for occasions when you want to be noticed.',
    tags: JSON.stringify(['sapphire', 'nose ring', 'blue', 'bold']),
  },
  {
    sku: 'AUR-NOS-008', name: 'Maang Tikka', slug: 'maang-tikka',
    category: 'nosepins', price: 2999, material: 'Gold-Plated Brass with CZ',
    isPremium: false, isFeatured: true, stock: 18,
    description: 'A graceful maang tikka with a CZ-studded pendant that sits at the centre parting of the hair. The adjustable chain clips on from the parting and secures behind a hair strand — no piercing required.',
    tags: JSON.stringify(['maang tikka', 'hair jewellery', 'bridal', 'cz']),
  },

  // ─── MEN'S JEWELLERY (9) ─────────────────────────────────────
  {
    sku: 'AUR-MEN-001', name: 'Bold Chain Necklace', slug: 'bold-chain-necklace-mens',
    category: 'mens', price: 6999, material: '925 Sterling Silver',
    isPremium: false, isBestseller: true, stock: 16,
    description: 'A substantial Cuban link chain in sterling silver, polished to a high shine. The bold, masculine proportions make this an impactful accessory for everything from a plain white tee to a formal jacket. Available in 55cm or 60cm.',
    tags: JSON.stringify(['chain', 'cuban link', 'mens', 'silver']),
  },
  {
    sku: 'AUR-MEN-002', name: 'Leather Cord Bracelet', slug: 'leather-cord-bracelet',
    category: 'mens', price: 1999, material: 'Genuine Leather with Sterling Silver Clasp',
    isPremium: false, isBestseller: true, stock: 30,
    description: 'Black braided leather cord is secured with a solid sterling silver hook clasp and complemented by two silver bead accents. This understated bracelet suits men who prefer their jewellery to feel more rugged than refined.',
    tags: JSON.stringify(['leather', 'bracelet', 'mens', 'casual']),
  },
  {
    sku: 'AUR-MEN-003', name: 'Signet Ring Men', slug: 'signet-ring-mens',
    category: 'mens', price: 5499, material: '925 Sterling Silver',
    isPremium: false, isFeatured: true, stock: 12,
    description: 'A classic men\'s signet ring with a flat rectangular face large enough for an engraving of up to four initials. The polished sterling silver shank tapers elegantly to meet the wider face. A modern heirloom piece.',
    tags: JSON.stringify(['signet', 'ring', 'mens', 'silver', 'engravable']),
  },
  {
    sku: 'AUR-MEN-004', name: 'Gold Kada Bangle Men', slug: 'gold-kada-bangle-mens',
    category: 'mens', price: 8999, material: '22k Gold-Plated Brass',
    isPremium: false, stock: 8,
    description: 'A robust gold-plated kada bangle for men, with a smooth polished exterior and a slightly textured inner edge for comfortable wear. Traditionally worn by Sikh men, the kada is today embraced across communities as a meaningful power accessory.',
    tags: JSON.stringify(['kada', 'bangle', 'mens', 'gold plated', 'traditional']),
  },
  {
    sku: 'AUR-MEN-005', name: 'Black Onyx Bracelet', slug: 'black-onyx-bracelet',
    category: 'mens', price: 3299, material: 'Black Onyx Beads with Silver Clasp',
    isPremium: false, stock: 22,
    description: 'Matte black onyx beads, 8mm in diameter, are strung on an elastic cord for effortless wear. The deep, non-reflective surface of onyx gives this bracelet a modern, architectural quality that pairs well with both smart and casual looks.',
    tags: JSON.stringify(['onyx', 'bracelet', 'mens', 'black', 'beaded']),
  },
  {
    sku: 'AUR-MEN-006', name: 'Dog Tag Pendant', slug: 'dog-tag-pendant-mens',
    category: 'mens', price: 2799, material: '925 Sterling Silver',
    isPremium: false, stock: 25,
    description: 'A classic rectangular dog-tag pendant in brushed sterling silver, suspended on a 60cm ball chain. The matte brushed finish is more understated than a high-polish option, giving this piece a raw, industrial aesthetic.',
    tags: JSON.stringify(['dog tag', 'pendant', 'mens', 'silver']),
  },
  {
    sku: 'AUR-MEN-007', name: 'Hamsa Hand Pendant', slug: 'hamsa-hand-pendant-mens',
    category: 'mens', price: 3499, material: 'Gold-Plated Silver with Black Enamel',
    isPremium: false, stock: 18,
    description: 'The Hamsa hand, an ancient symbol of protection across cultures, is rendered in gold-plated silver with black enamel detailing and a single blue CZ evil eye at its centre. Meaningful, masculine, and quietly striking.',
    tags: JSON.stringify(['hamsa', 'pendant', 'mens', 'protective', 'talisman']),
  },
  {
    sku: 'AUR-MEN-008', name: 'Rudraksha Bracelet', slug: 'rudraksha-bracelet',
    category: 'mens', price: 2199, material: 'Natural Rudraksha Beads with Gold-Plated Silver',
    isPremium: false, isBestseller: true, stock: 40,
    description: 'Authentic five-mukhi rudraksha beads, sacred in Hindu tradition, are strung on an elastic cord and finished with a small gold-plated Om charm. Wear it as a spiritual practice or simply as a textured, organic bracelet.',
    tags: JSON.stringify(['rudraksha', 'bracelet', 'mens', 'spiritual', 'om']),
  },
  {
    sku: 'AUR-MEN-009', name: 'Curb Chain Bracelet Men', slug: 'curb-chain-bracelet-mens',
    category: 'mens', price: 4999, material: '925 Sterling Silver',
    isPremium: false, stock: 14,
    description: 'A heavyweight curb chain bracelet in polished sterling silver with a push-button fold-over clasp. The flat-lying chain links are substantial without being cumbersome, striking the ideal balance between bold and refined for the modern man.',
    tags: JSON.stringify(['curb chain', 'bracelet', 'mens', 'silver', 'bold']),
  },
]

async function seed() {
  console.log('🌱 Seeding Aurelia database...')

  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.adminUser.deleteMany()

  // Create admin users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)

  await prisma.adminUser.createMany({
    data: [
      { name: 'Aurelia Admin', email: 'admin@aurelia.in', password: adminPassword, role: 'admin' },
      { name: 'Store Staff', email: 'staff@aurelia.in', password: staffPassword, role: 'staff' },
    ],
  })
  console.log('✅ Admin users created')

  // Create products
  let idx = 0
  for (const p of products) {
    const categoryKey = p.category
    await prisma.product.create({
      data: {
        ...p,
        images: imgs(categoryKey, idx, 3),
        weight: '5g',
        dimensions: '',
      },
    })
    idx++
  }
  console.log(`✅ ${products.length} products created`)

  // Create sample customers
  const custPassword = await bcrypt.hash('password123', 10)
  const customers = await prisma.customer.createManyAndReturn({
    data: [
      { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', password: custPassword },
      { name: 'Ananya Reddy', email: 'ananya@example.com', phone: '9988776655', password: custPassword },
    ],
  })
  console.log('✅ Sample customers created')

  // Seed sample reviews
  const allProducts = await prisma.product.findMany({ take: 10 })
  const reviewData = [
    { rating: 5, title: 'Absolutely stunning', body: 'The quality far exceeded my expectations. The craftsmanship is exquisite and it arrived beautifully packaged. I have received so many compliments.' },
    { rating: 5, title: 'Perfect gift', body: 'Bought this for my wife\'s anniversary and she was speechless. The piece is exactly as described, and the Aurelia gift box made the presentation extra special.' },
    { rating: 4, title: 'Beautiful piece', body: 'Very happy with this purchase. The quality is excellent for the price point. I took off one star only because the chain is slightly thinner than I expected from the photos.' },
    { rating: 5, title: 'Worth every rupee', body: 'I was hesitant to buy jewellery online but Aurelia completely changed my mind. The pieces are exactly as shown and the packaging is gorgeous.' },
    { rating: 4, title: 'Elegant and well-made', body: 'The finish is impeccable and the weight feels right — not too light to feel cheap, not so heavy as to be uncomfortable.' },
  ]

  for (let i = 0; i < allProducts.length; i++) {
    const review = reviewData[i % reviewData.length]
    await prisma.review.create({
      data: {
        productId: allProducts[i].id,
        customerId: customers[i % customers.length].id,
        authorName: i % 2 === 0 ? customers[0].name : customers[1].name,
        rating: review.rating,
        title: review.title,
        body: review.body,
      },
    })
  }
  console.log('✅ Sample reviews created')

  console.log('\n🎉 Database seeded successfully!')
  console.log('Admin login: admin@aurelia.in / admin123')
  console.log('Customer login: priya@example.com / password123')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
