import { useState } from 'react';
import './App.css';
import CannastoreMenu from './components/CannastoreMenu';
import ZoogiesAdLoop from './components/ZoogiesAdLoop';

const menuSections = [
  {
    titleDe: 'Premium Qualität',
    titleEn: 'Premium Quality',
    items: [
      { name: 'Hash', translation: 'Hash', price: ['1G - 25 EUR', '2,5G - 50 EUR'] },
      { name: 'Extrakte', translation: 'Extracts', price: ['1G - 30 EUR', '2,5G - 60 EUR'] },
    ],
    groups: [
      {
        titleDe: 'Cannain Öl Full Spektrum',
        titleEn: 'Cannain Oil Full Spectrum',
        items: [
          { name: 'Synergy Core', translation: '5% CBD + 5% CBG', price: '65 EUR' },
          { name: 'Night Now', translation: '5% CBD + 5% CBN', price: '99 EUR' },
          { name: 'Calm Night', translation: '4% CBD + 10% CBN', price: '99 EUR' },
          { name: 'Synergy Forte', translation: '10% CBD + 10% CBG', price: '79 EUR' },
          { name: 'Deep Ease', translation: '4% CBD + 25% CBG', price: '99 EUR' },
          { name: 'Synergy Ultra', translation: '15% CBD + 15% CBG', price: '99 EUR' },
        ],
      },
      {
        titleDe: 'Zoogies Aroma Pebbles',
        titleEn: 'Aroma Pebbles',
        items: [
          { menuId: 'zoogies-blueberry-pebbles', name: 'Blueberry Pebbles', translation: 'Blaubeere', price: '45€', accentColor: '#4f7cff' },
          { menuId: 'zoogies-strawberry-pop', name: 'Strawberry Pop', translation: 'Erdbeere', price: '45€', accentColor: '#ff5ba4' },
        ],
      },
    ],
  },
  {
    titleDe: 'Sonderangebote',
    titleEn: 'Special Offers',
    items: [],
    groups: [
      {
        titleDe: 'Hasch',
        titleEn: 'Hash',
        items: [
          { name: '10G', translation: '10 grams', price: '140 EUR' },
          { name: '20G', translation: '20 grams', price: '200 EUR' },
          { name: '50G', translation: '50 grams', price: '400 EUR' },
          { name: '100G', translation: '100 grams', price: '800 EUR' },
        ],
      },
      {
        titleDe: 'Extrakte',
        titleEn: 'Extracts',
        items: [
          { name: '10G', translation: '10 grams', price: '180 EUR' },
          { name: '20G', translation: '20 grams', price: '250 EUR' },
          { name: '50G', translation: '50 grams', price: '500 EUR' },
          { name: '100G', translation: '100 grams', price: '900 EUR' },
        ],
      },
    ],
  },
];

const slides = [
  {
    menuId: 'zoogies-blueberry-pebbles',
    eyebrow: 'Zoogies Drop',
    title: 'Blueberry Pebbles',
    subtitle: 'Deep berry profile with a cold neon finish.',
    image: `${process.env.PUBLIC_URL}/Zoogies_Blueberry_Final.webp`,
    glow: 'rgba(79, 124, 255, 0.55)',
    palette: ['#091225', '#13386b', '#4f7cff'],
    packagePosition: '56% 52%',
    packageScale: '0.62',
    showPriceBadge: true,
    priceText: '45 €',
    pebbles: [
      { src: `${process.env.PUBLIC_URL}/PurplePebble.png`, className: 'pebble-left' },
      { src: `${process.env.PUBLIC_URL}/PurplePebble.png`, className: 'pebble-front' },
    ],
  },
  {
    menuId: 'zoogies-strawberry-pop',
    eyebrow: 'Featured Flavor',
    title: 'Strawberry Pop',
    subtitle: 'Candy-forward color and a bright retail shelf presence.',
    image: `${process.env.PUBLIC_URL}/Zoogies_Strawberry_Final.webp`,
    glow: 'rgba(255, 91, 164, 0.52)',
    palette: ['#1f0715', '#6b1840', '#ff5ba4'],
    packagePosition: '56% 52%',
    packageScale: '0.62',
    showPriceBadge: true,
    priceText: '45 €',
    pebbles: [
      { src: `${process.env.PUBLIC_URL}/StrawberryPebble.png`, className: 'pebble-left' },
      { src: `${process.env.PUBLIC_URL}/StrawberryPebble.png`, className: 'pebble-front' },
    ],
  },
  {
    eyebrow: 'Coming Soon',
    title: 'Green Apple',
    subtitle: 'Crisp green apple with a fresh tart edge - dropping soon.',
    image: `${process.env.PUBLIC_URL}/Zoogies_Apple_Final.webp`,
    glow: 'rgba(138, 226, 52, 0.5)',
    palette: ['#081607', '#20441a', '#8ae234'],
    packagePosition: '57% 53%',
    packageScale: '0.6',
    comingSoon: true,
    pebbles: [
      { src: `${process.env.PUBLIC_URL}/ApplePebble.png`, className: 'pebble-left' },
      { src: `${process.env.PUBLIC_URL}/ApplePebble.png`, className: 'pebble-front' },
    ],
  },
  {
    eyebrow: 'Coming Soon',
    title: 'Cherry Rush',
    subtitle: 'Bold cherry intensity with a deep red finish - coming to the shelf soon.',
    image: `${process.env.PUBLIC_URL}/Zoogies_Cherry_Final.webp`,
    glow: 'rgba(255, 92, 87, 0.5)',
    palette: ['#170808', '#5f1718', '#ff5c57'],
    packagePosition: '57% 53%',
    packageScale: '0.6',
    comingSoon: true,
    pebbles: [
      { src: `${process.env.PUBLIC_URL}/CherryPebble.png`, className: 'pebble-left' },
      { src: `${process.env.PUBLIC_URL}/CherryPebble.png`, className: 'pebble-front' },
    ],
  },
  {
    image: `${process.env.PUBLIC_URL}/ZoogiesOnShelf_vladimira-slyusarenko-WH-G_BOcLDM-Kopie-1536x1536.webp`,
    glow: 'rgba(246, 211, 101, 0.35)',
    palette: ['#12100c', '#4f4020', '#f6d365'],
    fullImage: true,
    imagePosition: 'center center',
    hideContent: true,
    title: 'Shelf Moment',
  },
];

function App() {
  const [activeMenuId, setActiveMenuId] = useState(slides[0].menuId ?? null);

  return (
    <main className="screen-shell">
      <section className="screen-layout" aria-label="Cannabis Store Vienna digital menu">
        <CannastoreMenu sections={menuSections} activeMenuId={activeMenuId} />
        <ZoogiesAdLoop slides={slides} onSlideChange={setActiveMenuId} />
      </section>
    </main>
  );
}

export default App;
