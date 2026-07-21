const CITIES_DATA = [
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    country: "India",
    center: { lat: 24.5854, lng: 73.7125 },
    zoom: 13,
    description: "The City of Lakes — famous for lavish royal palaces, serene lakes, and marble heritage.",
    places: [
      {
        id: "city-palace-udaipur",
        name: "City Palace Udaipur",
        lat: 24.5764,
        lng: 73.6835,
        category: "Royal Heritage",
        suggestedVisitMinutes: 120,
        description: "Monumental palace complex built over 400 years overlooking Lake Pichola.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "lake-pichola",
        name: "Lake Pichola & Jagmandir",
        lat: 24.5695,
        lng: 73.6791,
        category: "Scenic Lake",
        suggestedVisitMinutes: 75,
        description: "Picturesque artificial freshwater lake featuring island palaces and boat cruises.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "saheliyon-ki-bari",
        name: "Saheliyon Ki Bari",
        lat: 24.6009,
        lng: 73.6853,
        category: "Garden & Fountains",
        suggestedVisitMinutes: 45,
        description: "Historic courtyard garden built for royal ladies featuring marble fountains and lotus pools.",
        image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "fateh-sagar-lake",
        name: "Fateh Sagar Lake",
        lat: 24.6041,
        lng: 73.6731,
        category: "Scenic Lake",
        suggestedVisitMinutes: 60,
        description: "Tranquil lake encircled by hills, featuring Nehru Park island and sunset promenades.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "monsoon-palace",
        name: "Sajjangarh Monsoon Palace",
        lat: 24.5896,
        lng: 73.6334,
        category: "Viewpoint & Fort",
        suggestedVisitMinutes: 60,
        description: "Hilltop palatial residence offering breathtaking sunset views over Udaipur's lakes.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "bagore-ki-haveli",
        name: "Bagore Ki Haveli",
        lat: 24.5795,
        lng: 73.6816,
        category: "Culture & Folk Dance",
        suggestedVisitMinutes: 60,
        description: "18th-century haveli at Gangaur Ghat hosting famous evening Rajasthani Dharohar folk dances.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jagdish-temple",
        name: "Jagdish Temple",
        lat: 24.5791,
        lng: 73.6839,
        category: "Temple & Sacred",
        suggestedVisitMinutes: 45,
        description: "Large Indo-Aryan temple dedicated to Lord Vishnu with intricate stone carvings.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "delhi",
    name: "Delhi",
    state: "Delhi NCR",
    country: "India",
    center: { lat: 28.6139, lng: 77.2090 },
    zoom: 12,
    description: "India's capital territory blending ancient Mughal heritage and vibrant modern metropolis.",
    places: [
      {
        id: "red-fort",
        name: "Red Fort (Lal Qila)",
        lat: 28.6562,
        lng: 77.2410,
        category: "Historic Fort",
        suggestedVisitMinutes: 90,
        description: "Massive 17th-century Mughal red sandstone fortress and UNESCO World Heritage site.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "qutub-minar",
        name: "Qutub Minar",
        lat: 28.5244,
        lng: 77.1855,
        category: "Historic Site",
        suggestedVisitMinutes: 75,
        description: "73-meter tall red sandstone victory tower built in 1193, surrounded by ancient ruins.",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "india-gate",
        name: "India Gate & Kartavya Path",
        lat: 28.6129,
        lng: 77.2295,
        category: "National Monument",
        suggestedVisitMinutes: 45,
        description: "Triumphant archway war memorial surrounded by lush lawns and evening lightings.",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "humayuns-tomb",
        name: "Humayun's Tomb",
        lat: 28.5933,
        lng: 77.2507,
        category: "Mughal Architecture",
        suggestedVisitMinutes: 75,
        description: "Precursor to the Taj Mahal, magnificent garden tomb of Mughal Emperor Humayun.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "lotus-temple",
        name: "Lotus Temple",
        lat: 28.5535,
        lng: 77.2588,
        category: "Architectural Marvel",
        suggestedVisitMinutes: 45,
        description: "Baháʼí House of Worship famous for its lotus flower-shaped white marble petals.",
        image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "akshardham",
        name: "Swaminarayan Akshardham",
        lat: 28.6127,
        lng: 77.2773,
        category: "Temple Complex",
        suggestedVisitMinutes: 120,
        description: "Sprawling Hindu temple complex featuring musical fountain shows and intricate stone carvings.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jama-masjid",
        name: "Jama Masjid & Chandni Chowk",
        lat: 28.6507,
        lng: 77.2334,
        category: "Heritage & Bazaars",
        suggestedVisitMinutes: 60,
        description: "One of India's largest mosques alongside Old Delhi's bustling historic spice markets.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "chandigarh",
    name: "Chandigarh",
    state: "Punjab & Haryana",
    country: "India",
    center: { lat: 30.7333, lng: 76.7794 },
    zoom: 13,
    description: "India's premier planned city, renowned for modern Le Corbusier architecture and urban gardens.",
    places: [
      {
        id: "rock-garden",
        name: "Nek Chand's Rock Garden",
        lat: 30.7525,
        lng: 76.8053,
        category: "Sculpture Garden",
        suggestedVisitMinutes: 90,
        description: "Unbelievable 40-acre sculpture garden crafted entirely from urban industrial and home waste.",
        image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "sukhna-lake",
        name: "Sukhna Lake",
        lat: 30.7421,
        lng: 76.8188,
        category: "Scenic Lake",
        suggestedVisitMinutes: 60,
        description: "Serene man-made reservoir at the foothills of the Shivalik range with boating.",
        image: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "rose-garden",
        name: "Zakir Hussain Rose Garden",
        lat: 30.7460,
        lng: 76.7820,
        category: "Botanical Garden",
        suggestedVisitMinutes: 45,
        description: "Asia's largest rose garden featuring over 1,600 varieties of roses across 30 acres.",
        image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "capitol-complex",
        name: "Le Corbusier Capitol Complex",
        lat: 30.7594,
        lng: 76.8016,
        category: "UNESCO Heritage",
        suggestedVisitMinutes: 60,
        description: "Architectural masterpiece by Le Corbusier featuring the High Court and Open Hand Monument.",
        image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "elante-mall",
        name: "Elante Mall & Commercial Hub",
        lat: 30.7056,
        lng: 76.8013,
        category: "Shopping & Dining",
        suggestedVisitMinutes: 60,
        description: "One of Northern India's largest shopping and entertainment destinations.",
        image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "japanese-garden",
        name: "Japanese Garden (Sector 31)",
        lat: 30.7090,
        lng: 76.7865,
        category: "Themed Garden",
        suggestedVisitMinutes: 45,
        description: "Tranquil garden incorporating traditional Japanese architecture, pagodas, and waterfalls.",
        image: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    country: "India",
    center: { lat: 26.9124, lng: 75.7873 },
    zoom: 13,
    description: "The Pink City — royal capital of Rajasthan filled with grand hill forts and terracotta palaces.",
    places: [
      {
        id: "amber-fort",
        name: "Amber Palace (Amer Fort)",
        lat: 26.9855,
        lng: 75.8513,
        category: "Royal Fort",
        suggestedVisitMinutes: 120,
        description: "Majestic hilltop fort featuring Sheesh Mahal (Mirror Palace) overlooking Maota Lake.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "hawa-mahal",
        name: "Hawa Mahal (Palace of Winds)",
        lat: 26.9239,
        lng: 75.8267,
        category: "Iconic Landmark",
        suggestedVisitMinutes: 45,
        description: "Pink sandstone honeycomb facade with 953 intricate jharokha lattice windows.",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "city-palace-jaipur",
        name: "City Palace Jaipur",
        lat: 26.9258,
        lng: 75.8237,
        category: "Royal Residence",
        suggestedVisitMinutes: 90,
        description: "Royal residence blending Rajput, Mughal, and European architectural styles.",
        image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f1c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jantar-mantar",
        name: "Jantar Mantar Observatory",
        lat: 26.9247,
        lng: 75.8246,
        category: "UNESCO Heritage",
        suggestedVisitMinutes: 60,
        description: "18th-century astronomical observatory housing the world's largest stone sundial.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "nahargarh-fort",
        name: "Nahargarh Fort",
        lat: 26.9373,
        lng: 75.8155,
        category: "Hill Fort & Sunset",
        suggestedVisitMinutes: 75,
        description: "Fortress perched on the Aravalli hills delivering panoramic sunset views over Jaipur.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jal-mahal",
        name: "Jal Mahal (Water Palace)",
        lat: 26.9534,
        lng: 75.8462,
        category: "Scenic View",
        suggestedVisitMinutes: 30,
        description: "Captivating palace standing in the middle of Man Sagar Lake.",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "albert-hall-museum",
        name: "Albert Hall Museum",
        lat: 26.9116,
        lng: 75.8195,
        category: "Museum & Heritage",
        suggestedVisitMinutes: 60,
        description: "Indo-Saracenic museum showcasing royal artifacts, paintings, and historical weapons.",
        image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    country: "India",
    center: { lat: 31.1048, lng: 77.1734 },
    zoom: 13,
    description: "Queen of the Hills — historic Himalayan hill station surrounded by pine forests.",
    places: [
      {
        id: "mall-road-ridge",
        name: "The Ridge & Mall Road",
        lat: 31.1048,
        lng: 77.1734,
        category: "Town Center & Walkway",
        suggestedVisitMinutes: 90,
        description: "Pedestrian-only promenade in the heart of Shimla with colonial charm and views.",
        image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jakhoo-temple",
        name: "Jakhoo Temple & Hanuman Statue",
        lat: 31.1012,
        lng: 77.1856,
        category: "Hilltop Temple",
        suggestedVisitMinutes: 60,
        description: "Ancient Hanuman temple situated on Shimla's highest peak (8,000 ft).",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "christ-church",
        name: "Christ Church Shimla",
        lat: 31.1052,
        lng: 77.1748,
        category: "Colonial Architecture",
        suggestedVisitMinutes: 30,
        description: "Second oldest church in North India with iconic yellow neo-Gothic facade.",
        image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "viceregal-lodge",
        name: "Rashtrapati Nivas (Viceregal Lodge)",
        lat: 31.1037,
        lng: 77.1408,
        category: "Historic Estate",
        suggestedVisitMinutes: 75,
        description: "Jacobethan style former summer residence of the British Viceroy of India.",
        image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "kufri-fun-world",
        name: "Kufri Adventure Park",
        lat: 31.0979,
        lng: 77.2678,
        category: "Himalayan Nature",
        suggestedVisitMinutes: 120,
        description: "Snow sports and panoramic Himalayan mountain viewpoint near Shimla.",
        image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "chadwick-falls",
        name: "Chadwick Waterfalls",
        lat: 31.1147,
        lng: 77.1432,
        category: "Nature Waterfall",
        suggestedVisitMinutes: 60,
        description: "Cascading waterfall nestled inside dense Glen pine and deodar forests.",
        image: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    country: "India",
    center: { lat: 31.6340, lng: 74.8723 },
    zoom: 13,
    description: "Spiritual capital of Punjab — home to the Golden Temple, Punjabi hospitality, and historic forts.",
    places: [
      {
        id: "golden-temple",
        name: "Sri Harmandir Sahib (Golden Temple)",
        lat: 31.6199,
        lng: 74.8765,
        category: "Spiritual Shrine",
        suggestedVisitMinutes: 120,
        description: "Holiest Sikh Gurdwara plated in gold, surrounded by the sacred Amrit Sarovar lake.",
        image: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "wagah-border",
        name: "Wagah Border Ceremony",
        lat: 31.6047,
        lng: 74.5762,
        category: "Patriotic Event",
        suggestedVisitMinutes: 90,
        description: "Famous military Beating Retreat ceremony at the India-Pakistan border checkpoint.",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "jallianwala-bagh",
        name: "Jallianwala Bagh Memorial",
        lat: 31.6206,
        lng: 74.8801,
        category: "Historic Memorial",
        suggestedVisitMinutes: 45,
        description: "Historic public garden and national memorial preserving the 1919 freedom struggle history.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "gobindgarh-fort",
        name: "Gobindgarh Fort",
        lat: 31.6300,
        lng: 74.8631,
        category: "Heritage Fort",
        suggestedVisitMinutes: 75,
        description: "18th-century military fort built by Maharaja Ranjit Singh, featuring 7D shows and museums.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "partition-museum",
        name: "The Partition Museum",
        lat: 31.6232,
        lng: 74.8795,
        category: "Museum",
        suggestedVisitMinutes: 60,
        description: "World's first museum dedicated to the stories, artifacts, and history of the 1947 Partition.",
        image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "durgiana-temple",
        name: "Durgiana Temple (Laxmi Narayan)",
        lat: 31.6322,
        lng: 74.8690,
        category: "Sacred Shrine",
        suggestedVisitMinutes: 45,
        description: "Hindu temple built in the architecture of the Golden Temple inside a sacred lake.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80"
      }
    ]
  }
];

module.exports = { CITIES_DATA };
