// All page content lives here so copy and pricing changes don't require touching markup.

// Header "Join Sword & Shield" buttons (desktop + mobile menu).
export const HEADER_JOIN_URL = 'https://events.hometownticketing.com/boxoffice/cornerstone/L2VtYmVkL2V2ZW50LzQxOA==';

export const TICKET_URL =
  'https://events.hometownticketing.com/boxoffice/cornerstone/L2VtYmVkL2V2ZW50LzEzP2FjY2Vzc19jb2RlPWJjMzVkZDRiZDkwZTJkZGVlM2EzOTBjMTUwMTNjNGM4ZDFhYWIzZjY%3D';

export const IMG = {
  logo: 'https://ik.imagekit.io/primo/CCS/swordandshield.png',
  shield: 'https://ik.imagekit.io/primo/CCS/shield.png',
  football: 'https://ik.imagekit.io/primo/CCS/ccsfootball.jpg',
  spirit: 'https://ik.imagekit.io/primo/CCS/DSC07012.jpg',
  team: 'https://ik.imagekit.io/primo/CCS/DSC07467.jpg',
  champions: 'https://ik.imagekit.io/primo/CCS/DSC02368.jpg',
  membershipBg:
    'https://jhm-cms.images.sardius.media/media/wqopqrh2/2024-swordshield-sup-ccs-webhero-1440x600-v02.jpg?fit=cover&width=1440&height=600',
  director:
    'https://jhm-cms.images.sardius.media/media/yxujwlen/charlesgann2025-800x800.jpg?fit=cover&width=800&height=800',
};

// TODO: this is hosted on a staging WordPress site — move it to ImageKit (or /public) before launch.
export const HERO_VIDEO = 'https://primostaging.mystagingwebsite.com/wp-content/uploads/2026/02/sword.mp4';

export const CONTACT = {
  name: 'Charles Gann',
  title: 'Director of Sword & Shield',
  email: 'Charles.Gann@sa-ccs.org',
  office: '210-979-9203',
  cell: '432-556-3019',
};

export const SPONSOR_MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Sword & Shield business sponsorship')}`;

// TODO: real profile URLs
export const SOCIAL = {
  instagram: '#',
  facebook: '#',
  x: '#',
};

export const NAV_LINKS = [
  { href: '#membership', label: 'Membership' },
  { href: '#impact', label: 'Impact' },
  { href: '#sponsors', label: 'Sponsors' },
  { href: '#faq', label: 'FAQ' },
];

export interface Stat {
  end: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export const STATS: Stat[] = [
  { end: 500, suffix: '+', label: 'Student Athletes Supported' },
  { end: 4, label: 'Championship Programs' },
  { end: 50000, prefix: '$', label: 'Raised This Year' },
  { end: 100, suffix: '+', label: 'Business Partners' },
];

export const HERO_SLIDES = [
  { src: IMG.football, alt: 'Warriors athletics' },
  { src: IMG.spirit, alt: 'School spirit' },
  { src: IMG.team, alt: 'Team excellence' },
  { src: IMG.champions, alt: 'Champions' },
];

export const PROGRAMS = [
  { title: 'Athletics', text: 'Train Warriors to compete with Kingdom perspective', image: 'https://ik.imagekit.io/primo/CCS/atletics.png', position: 'center 25%' },
  { title: 'Fine Arts', text: 'Award-winning theater, music, and visual arts', image: 'https://ik.imagekit.io/primo/CCS/fine-arts.png', position: 'center 35%' },
  { title: 'Academics', text: 'STEM, robotics, and 4-H programs', image: 'https://ik.imagekit.io/primo/CCS/robotics.png', position: 'center 40%' },
  { title: '4-H', text: 'Character development and discipleship', image: 'https://ik.imagekit.io/primo/CCS/4h.png', position: 'center 30%' },
];

export interface Level {
  name: string;
  price: number;
  image: string;
  alt: string;
  summary: string;
  benefits: string[];
  featured?: boolean;
  badge?: string;
}

const levelImg = (id: string, name: string) =>
  `https://jhm-cms.images.sardius.media/media/${id}/v2-warrior${name}.jpg?fit=cover&width=400&height=400`;

export const LEVELS: Level[] = [
  {
    name: 'Red',
    price: 1500,
    image: levelImg('sjthtiwn', 'red'),
    alt: 'Football game',
    summary: 'Sponsor socials; gameday media guide logo; 1 VIP parking & seating',
    benefits: [
      'Sponsor Social at JW Marriott (9/24)',
      'Sponsor Social two times per year',
      'Company Logo in Gameday Media Guide',
      '1 VIP Parking for all Football Games (Lot A/B)',
      'VIP Seating to all CCS Football Games',
    ],
  },
  {
    name: 'Blue',
    price: 2500,
    image: levelImg('hfrfk5nu', 'blue'),
    alt: 'Team spirit',
    summary: 'Banner at baseball/softball; A-Frame on Warrior Way; scoreboard; VIP parking & seating',
    benefits: [
      'Banner featuring company logo at Baseball or Softball Stadium',
      'A-Frame company logos on Warrior Way on game day',
      'Company announced and logo displayed pregame/postgame on CCS Video scoreboard in Warrior Stadium during football season',
      '1 VIP Parking for all Football Games (Lot A/B)',
      'VIP Seating to all CCS Football Games',
      'Company Logo in Gameday Media Guide',
      'Sponsor Social – two times per year',
      'Sponsor Social at JW Marriott (9/24)',
    ],
  },
  {
    name: 'Silver',
    price: 5000,
    image: levelImg('qbgpoexn', 'silver'),
    alt: 'Stadium',
    featured: true,
    badge: 'Popular',
    summary: 'Stadium + baseball or softball banner; scoreboard; website; VIP parking & seating',
    benefits: [
      'Banner featuring company logo at Warrior Stadium, and your choice of CCS Baseball or Softball Field',
      'A-Frame company logos on Warrior Way on game days',
      'Company announced and logo displayed pregame/postgame on CCS Video scoreboard in Warrior Stadium during football season',
      'Company Logo represented on the CCS website for the entire school year',
      '1 VIP Parking for all Football Games (Lot A/B)',
      'VIP Seating to all CCS Football Games',
      'Company Logo in Gameday Media Guide',
      'Sponsor Social – two times per year',
      'Sponsor Social at JW Marriott (9/24)',
    ],
  },
  {
    name: 'Gold',
    price: 8000,
    image: levelImg('ckufxfwb', 'gold'),
    alt: 'Champions',
    summary: 'Logo at stadium, baseball, softball & gym; 2 VIP parking; sponsor socials',
    benefits: [
      'Company announced and logo displayed pregame/postgame on CCS Video scoreboard in Warrior Stadium during football season',
      'Company Logo at Warrior Stadium, CCS Baseball, CCS Softball, and CCS Competition Gym',
      'Company Logo represented on the CCS website for the entire school year',
      'A-Frame company logos on Warrior Way on game day',
      '2 VIP Parking for all Football Games (Lot A/B)',
      'VIP Seating to all CCS Football Games',
      'Sponsor Social – two times per year',
      'Sponsor Social at JW Marriott (9/24)',
    ],
  },
  {
    name: 'Platinum',
    price: 15000,
    image: levelImg('djmduehg', 'platinum'),
    alt: 'Excellence',
    summary: 'Scoreboard & venue logos, VIP corporate seating, free admission to all events',
    benefits: [
      'Company announced and logo displayed pregame/postgame and after each quarter on CCS Video scoreboard in Warrior Stadium during football season',
      'Company Logo at Warrior Stadium, CCS Baseball Field, CCS Softball Field, and the CCS Competition Gym for the school year',
      'Company Logo represented on the CCS website for the entire school year',
      'Company Logo in Gameday Media Guide',
      'A-Frame company logos on Warrior Way on game day',
      'VIP Corporate Seating at all CCS Football Games',
      '2 VIP Parking for all Football Games (Lot A/B)',
      'Free admission to all CCS events',
      'Sponsor Social – two times per year',
      'Sponsor Social at JW Marriott (9/24)',
    ],
  },
  {
    name: 'Title Sponsor',
    price: 30000,
    image: levelImg('vxbdqd4l', 'sponsor'),
    alt: 'Victory',
    featured: true,
    summary: 'Primary scoreboard sponsor, full visibility across stadium, baseball & softball',
    benefits: [
      'Primary Scoreboard Sponsor (CCS Warrior Stadium) (CCS Baseball & Softball Fields)',
      'Company announced and logo displayed pregame/postgame and after each quarter on CCS Video scoreboard in Warrior Stadium during football season',
      'Company Logo at Warrior Stadium, CCS Baseball Field, CCS Softball Field, and the CCS Competition Gym for the school year',
      'Company Logo represented on the CCS website for the entire school year',
      'Company Logo in Gameday Media Guide',
      'A-Frame company logos on Warrior Way on game day',
      'Free admission to all CCS events',
      '2 VIP Parking for all Football Games (Lot A/B)',
      'VIP Corporate Seating at all CCS Football games',
      'Sponsor Social – two times per year',
      'Sponsor Social at JW Marriott (9/24)',
    ],
  },
];

export const IMPACT = [
  { image: IMG.football, stat: '4 State Titles', title: 'State Championships', quote: 'Sword & Shield funding upgraded our strength training facility, giving our athletes a competitive edge.' },
  { image: IMG.spirit, stat: '#1 UIL Rating', title: 'Fine Arts Excellence', quote: 'New lighting and sound equipment made possible by member support elevated our productions to award-winning status.' },
  { image: IMG.team, stat: 'Regional Champs', title: 'Academic Innovation', quote: 'Member funding launched our 4-H and robotics programs, opening new opportunities for student growth.' },
];

export const CORPORATE_BENEFITS = [
  'Logo placement across campus and events',
  'Digital marketing exposure (website, social, email)',
  'Community goodwill and brand recognition',
  'Networking opportunities with 600+ families',
  'Tax-deductible contribution',
];

export const FAQS = [
  { q: 'Is my membership tax-deductible?', a: "Yes! Cornerstone Christian Schools is a 501(c)(3) nonprofit. You'll receive a receipt for tax purposes." },
  { q: 'Can I designate my donation to a specific program?', a: 'While Sword & Shield supports all programs holistically, you can express preferences. Contact us to discuss.' },
  { q: "What's the difference between family membership and business sponsorship?", a: 'Family memberships are individual/family contributions. Business sponsorships include marketing benefits and brand visibility.' },
  { q: 'When does my membership expire?', a: "All memberships run on the academic year (August–July). You'll receive a renewal reminder." },
  { q: 'Can I pay in installments?', a: 'Yes! We offer quarterly payment plans. Contact us to arrange.' },
];

export const formatUsd = (n: number) => `$${n.toLocaleString('en-US')}`;
