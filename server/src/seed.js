const path = require('node:path')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const Destination = require('./models/Destination')
const Package = require('./models/Package')
const Testimonial = require('./models/Testimonial')
const FAQ = require('./models/FAQ')

const domesticDestinations = [
  {
    name: 'Kashmir',
    slug: 'kashmir',
    description: 'Alpine valleys, quiet lakes, and mountain scenery in the Kashmir Valley.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a314?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 28999,
    duration: '6 days / 5 nights',
    category: 'Mountain',
    packagePrice: 28999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
    packageCategories: ['Mountains', 'Family', 'Couple'],
  },
  {
    name: 'Manali',
    slug: 'manali',
    description: 'A Himalayan escape with pine forests, river valleys, and high mountain passes.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 18999,
    duration: '5 days / 4 nights',
    category: 'Mountain',
    packagePrice: 18999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
    packageCategories: ['Mountains', 'Adventure', 'Couple'],
  },
  {
    name: 'Shimla',
    slug: 'shimla',
    description: 'Colonial-era streets, cedar forests, and panoramic Himalayan views.',
    image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 16999,
    duration: '4 days / 3 nights',
    category: 'Hill station',
    packagePrice: 16999,
    packageDuration: '4 days / 3 nights',
    itineraryDays: 4,
    packageCategories: ['Mountains', 'Family', 'Couple'],
  },
  {
    name: 'Mussoorie',
    slug: 'mussoorie',
    description: 'A relaxed hill-station break above the Doon Valley.',
    image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 14999,
    duration: '4 days / 3 nights',
    category: 'Hill station',
    packagePrice: 14999,
    packageDuration: '4 days / 3 nights',
    itineraryDays: 4,
    packageCategories: ['Mountains', 'Family', 'Couple'],
  },
  {
    name: 'Rishikesh',
    slug: 'rishikesh',
    description: 'Riverside ashrams, Himalayan foothills, and outdoor adventure on the Ganges.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 12999,
    duration: '3 days / 2 nights',
    category: 'Adventure',
    packagePrice: 12999,
    packageDuration: '3 days / 2 nights',
    itineraryDays: 3,
    packageCategories: ['Religious', 'Adventure', 'Couple'],
  },
  {
    name: 'Dehradun',
    slug: 'dehradun',
    description: 'A leafy valley city and convenient base for exploring Uttarakhand.',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 10999,
    duration: '3 days / 2 nights',
    category: 'Nature',
    packagePrice: 10999,
    packageDuration: '3 days / 2 nights',
    itineraryDays: 3,
    packageCategories: ['Family', 'Adventure'],
  },
  {
    name: 'Auli',
    slug: 'auli',
    description: 'High-altitude meadows with sweeping views of Nanda Devi and the Garhwal Himalaya.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 22999,
    duration: '5 days / 4 nights',
    category: 'Mountain',
    packagePrice: 22999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
    packageCategories: ['Mountains', 'Adventure', 'Couple'],
  },
  {
    name: 'Jaisalmer',
    slug: 'jaisalmer',
    description: 'Golden sandstone architecture, desert dunes, and Rajasthan heritage.',
    image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 20999,
    duration: '4 days / 3 nights',
    category: 'Heritage',
    packagePrice: 20999,
    packageDuration: '4 days / 3 nights',
    itineraryDays: 4,
    packageCategories: ['Family', 'Couple'],
  },
  {
    name: 'Udaipur',
    slug: 'udaipur',
    description: 'Lake palaces, old-city lanes, and lakeside sunsets in Rajasthan.',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 17999,
    duration: '4 days / 3 nights',
    category: 'Heritage',
    packagePrice: 17999,
    packageDuration: '4 days / 3 nights',
    itineraryDays: 4,
    packageCategories: ['Family', 'Couple', 'Religious'],
  },
  {
    name: 'Goa',
    slug: 'goa',
    description: 'Sunlit beaches, Portuguese-influenced neighborhoods, and coastal food.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 24999,
    duration: '5 days / 4 nights',
    category: 'Beach',
    packagePrice: 24999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
    packageCategories: ['Beaches', 'Couple', 'Family'],
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    description: 'Backwaters, tea-covered hills, and tropical coastline in southern India.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 32999,
    duration: '6 days / 5 nights',
    category: 'Nature',
    packagePrice: 32999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
    packageCategories: ['Family', 'Couple', 'Religious'],
  },
  {
    name: 'Andaman',
    slug: 'andaman',
    description: 'Island beaches, coral reefs, and clear waters in the Bay of Bengal.',
    image: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 42999,
    duration: '6 days / 5 nights',
    category: 'Island',
    packagePrice: 42999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
    packageCategories: ['Beaches', 'Adventure', 'Couple'],
  },
]

const internationalDestinations = [
  {
    name: 'Dubai',
    slug: 'dubai',
    description: 'Modern architecture, desert experiences, and vibrant Gulf-city culture.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 54999,
    duration: '5 days / 4 nights',
    category: 'International',
    packagePrice: 54999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
  },
  {
    name: 'Bali',
    slug: 'bali',
    description: 'Temple landscapes, rice terraces, and relaxed Indonesian island life.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 62999,
    duration: '6 days / 5 nights',
    category: 'International',
    packagePrice: 62999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    description: 'A mix of lively cities, historic temples, and tropical beaches.',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 44999,
    duration: '6 days / 5 nights',
    category: 'International',
    packagePrice: 44999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    description: 'A compact city break known for gardens, food, and contemporary design.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 57999,
    duration: '5 days / 4 nights',
    category: 'International',
    packagePrice: 57999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
  },
  {
    name: 'Maldives',
    slug: 'maldives',
    description: 'Indian Ocean islands with lagoon stays, reef life, and quiet beaches.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 74999,
    duration: '5 days / 4 nights',
    category: 'International',
    packagePrice: 74999,
    packageDuration: '5 days / 4 nights',
    itineraryDays: 5,
  },
  {
    name: 'Vietnam',
    slug: 'vietnam',
    description: 'A varied journey through historic cities, limestone bays, and local cuisine.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 64999,
    duration: '7 days / 6 nights',
    category: 'International',
    packagePrice: 64999,
    packageDuration: '7 days / 6 nights',
    itineraryDays: 6,
  },
  {
    name: 'Malaysia',
    slug: 'malaysia',
    description: 'Cultural city districts, rainforest escapes, and island coastlines.',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 59999,
    duration: '6 days / 5 nights',
    category: 'International',
    packagePrice: 59999,
    packageDuration: '6 days / 5 nights',
    itineraryDays: 6,
  },
]

const packageGalleryPeers = {
  kashmir: ['manali', 'auli'],
  manali: ['kashmir', 'shimla'],
  shimla: ['mussoorie', 'manali'],
  mussoorie: ['dehradun', 'shimla'],
  rishikesh: ['dehradun', 'mussoorie'],
  dehradun: ['rishikesh', 'mussoorie'],
  auli: ['kashmir', 'manali'],
  jaisalmer: ['udaipur', 'dubai'],
  udaipur: ['jaisalmer', 'dubai'],
  goa: ['kerala', 'andaman'],
  kerala: ['goa', 'andaman'],
  andaman: ['goa', 'maldives'],
  dubai: ['singapore', 'malaysia'],
  bali: ['thailand', 'maldives'],
  thailand: ['bali', 'vietnam'],
  singapore: ['dubai', 'malaysia'],
  maldives: ['bali', 'andaman'],
  vietnam: ['thailand', 'malaysia'],
  malaysia: ['singapore', 'thailand'],
}

const testimonials = [
  {
    name: 'Aarav Mehta',
    location: 'Pune, India',
    message: 'Our Kashmir trip was paced beautifully. The houseboat stay and transfers were exactly as described.',
    rating: 5,
  },
  {
    name: 'Nisha Kapoor',
    location: 'Jaipur, India',
    message: 'The Manali itinerary gave us time to explore without feeling rushed, and the hotel was warm and comfortable.',
    rating: 5,
  },
  {
    name: 'Rohan Iyer',
    location: 'Bengaluru, India',
    message: 'The Kerala backwater stay was a highlight. Clear communication made the whole family trip easy.',
    rating: 5,
  },
  {
    name: 'Sana Qureshi',
    location: 'Lucknow, India',
    message: 'We loved the Jaisalmer fort walk and desert evening. The local guide made the history come alive.',
    rating: 5,
  },
  {
    name: 'Kabir Desai',
    location: 'Mumbai, India',
    message: 'A relaxed Goa break with a good hotel location and enough free time to make our own plans.',
    rating: 4,
  },
  {
    name: 'Mira Thomas',
    location: 'Kochi, India',
    message: 'The Rishikesh weekend was well organized, from the riverside stay to the rafting arrangements.',
    rating: 5,
  },
  {
    name: 'Devika Rao',
    location: 'Hyderabad, India',
    message: 'Our Udaipur package included lovely heritage stops and a driver who knew the old city well.',
    rating: 4,
  },
  {
    name: 'Arjun Sen',
    location: 'Kolkata, India',
    message: 'Andaman was a dream. The ferry connections and snorkeling day were coordinated smoothly.',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'What is included in a travel package?',
    answer: 'Each package lists its hotel, transport, itinerary, inclusions, and exclusions so you can review the details before booking.',
    category: 'booking',
    order: 1,
  },
  {
    question: 'Can I customize my itinerary?',
    answer: 'Yes. Share your preferred dates, pace, and interests in an inquiry and the travel team can discuss available adjustments.',
    category: 'booking',
    order: 2,
  },
  {
    question: 'Are flights included in the package price?',
    answer: 'Flights are not included unless a package specifically says otherwise. Check the package inclusions before confirming.',
    category: 'pricing',
    order: 3,
  },
  {
    question: 'How do I request a booking?',
    answer: 'Send an inquiry with your destination, travel date, number of travelers, and budget. The team will follow up to confirm availability.',
    category: 'booking',
    order: 4,
  },
  {
    question: 'What documents do I need for international travel?',
    answer: 'Travelers generally need a valid passport and may need a visa or other entry documents. Requirements depend on your destination and nationality.',
    category: 'international travel',
    order: 5,
  },
  {
    question: 'Can the package price change?',
    answer: 'Prices can vary with travel dates, availability, and selected options. A final quote is confirmed with you before booking.',
    category: 'pricing',
    order: 6,
  },
  {
    question: 'What happens if I need to cancel?',
    answer: 'Cancellation terms depend on the hotels, transport providers, and timing. Review the terms in your booking confirmation before paying.',
    category: 'changes and cancellations',
    order: 7,
  },
]

function makeItinerary(destinationName, dayCount) {
  const plans = [
    ['Arrival and check-in', `Arrive in ${destinationName}, meet your transfer, and settle into the hotel. Keep the evening free to rest or explore nearby.`],
    ['Local highlights', `Explore ${destinationName}'s best-known sights with time for photos, local food, and a guided introduction to the area.`],
    ['Day excursion', `Take a planned excursion around ${destinationName}, with stops for scenery, culture, and a relaxed lunch break.`],
    ['Leisure and discovery', `Choose an optional activity or enjoy a slower day discovering ${destinationName} at your own pace.`],
    ['Final explorations', `Spend the day at a favorite spot or browse local markets before returning to the hotel.`],
    ['Departure', 'Check out and transfer to the departure point for your onward journey.'],
  ]

  return plans.slice(0, dayCount).map(([title, description], index) => ({
    day: index + 1,
    title,
    description,
  }))
}

async function upsertSeedRecords(Model, records, getFilter) {
  const operations = records.map((record) => ({
    updateOne: {
      filter: getFilter(record),
      update: { $setOnInsert: record },
      upsert: true,
    },
  }))

  if (operations.length === 0) return 0

  const result = await Model.bulkWrite(operations, { ordered: true })
  return result.upsertedCount
}

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in server/.env')
  }

  await mongoose.connect(process.env.MONGO_URI)

  const destinations = [...domesticDestinations, ...internationalDestinations].map(
    ({ packagePrice, packageDuration, itineraryDays, packageCategories, ...destination }) => destination,
  )

  const newDestinations = await upsertSeedRecords(
    Destination,
    destinations,
    (destination) => ({ slug: destination.slug }),
  )

  const packageDestinations = [...domesticDestinations, ...internationalDestinations].filter(
    (destination) => destination.packagePrice !== undefined,
  )
  const destinationDocuments = await Destination.find({
    slug: { $in: packageDestinations.map(({ slug }) => slug) },
  }).select('_id slug')
  const destinationIds = new Map(
    destinationDocuments.map((destination) => [destination.slug, destination._id]),
  )
  const destinationsBySlug = new Map(
    [...domesticDestinations, ...internationalDestinations].map((destination) => [destination.slug, destination]),
  )

  const packages = packageDestinations.map((destination) => {
    const destinationId = destinationIds.get(destination.slug)
    if (!destinationId) throw new Error(`Missing seeded destination: ${destination.slug}`)
    const isInternational = internationalDestinations.some(({ slug }) => slug === destination.slug)

    return {
      title: `${destination.name} Highlights`,
      overview: destination.description,
      destination: destinationId,
      duration: destination.packageDuration,
      price: destination.packagePrice,
      hotels: [isInternational ? 'Well-reviewed 4-star hotel' : 'Comfortable 3-star hotel'],
      transport: isInternational
        ? 'Airport transfers and local sightseeing transport'
        : 'Private air-conditioned transfers and sightseeing vehicle',
      inclusions: isInternational
        ? ['Hotel stay', 'Daily breakfast', 'Airport transfers', 'Listed sightseeing']
        : ['Hotel stay', 'Daily breakfast', 'Listed sightseeing', 'Local transfers'],
      exclusions: isInternational
        ? ['International flights', 'Visa fees', 'Personal expenses', 'Optional activities']
        : ['Flights or train tickets', 'Personal expenses', 'Optional activities'],
      importantInformation: isInternational
        ? [
            'A valid passport is required; check destination-specific visa and entry requirements before booking.',
            'International flights and visa fees are not included unless stated in your confirmed itinerary.',
            'Travel insurance is recommended for all international trips.',
          ]
        : [
            'Rates are based on the listed package and hotel availability at the time of confirmation.',
            'Carry valid photo identification for hotel check-in and domestic travel.',
            'Weather or local operating conditions may change the order of sightseeing.',
          ],
      cancellationPolicy: 'Cancellation requests are subject to the hotel and transport supplier terms. Any applicable fees and refund amount will be confirmed before a cancellation is processed.',
      itinerary: makeItinerary(destination.name, destination.itineraryDays),
      rating: 4.7,
      images: [
        destination.image,
        ...(packageGalleryPeers[destination.slug] || [])
          .map((slug) => destinationsBySlug.get(slug)?.image)
          .filter(Boolean),
      ],
      categories: destination.packageCategories || [],
      type: isInternational ? 'international' : 'domestic',
    }
  })

  const packageResult = await Package.bulkWrite(
    packages.map((travelPackage) => {
      const { categories, overview, importantInformation, cancellationPolicy, images, ...packageFields } = travelPackage
      return {
        updateOne: {
          filter: { title: travelPackage.title, destination: travelPackage.destination },
          update: {
            $set: { categories, overview, importantInformation, cancellationPolicy, images },
            $setOnInsert: packageFields,
          },
          upsert: true,
        },
      }
    }),
    { ordered: true },
  )
  const newPackages = packageResult.upsertedCount
  const newTestimonials = await upsertSeedRecords(Testimonial, testimonials, (testimonial) => ({
    name: testimonial.name,
    message: testimonial.message,
  }))
  const newFaqs = await upsertSeedRecords(FAQ, faqs, (faq) => ({ question: faq.question }))

  const totals = {
    destinations: await Destination.countDocuments(),
    packages: await Package.countDocuments(),
    testimonials: await Testimonial.countDocuments(),
    faqs: await FAQ.countDocuments(),
  }

  console.log('Seed complete. New records:', {
    destinations: newDestinations,
    domesticPackages: newPackages,
    testimonials: newTestimonials,
    faqs: newFaqs,
  })
  console.log('Collection totals:', totals)
}

seedDatabase()
  .catch((error) => {
    console.error('Seed failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })