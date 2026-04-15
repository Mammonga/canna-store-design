import { useEffect, useState } from 'react';

function ZoogiesAdLoop({ slides, onSlideChange }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    onSlideChange?.(slides[activeIndex]?.menuId ?? null);
  }, [activeIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 9000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  return (
    <aside className="ad-panel" aria-label="Zoogies rotating advertisement">
      {slides.map((slide, index) => (
        <article
          key={slide.title}
          className={`ad-slide ${index === activeIndex ? 'is-active' : ''}`}
          style={{
            '--glow': slide.glow,
            '--tone-1': slide.palette[0],
            '--tone-2': slide.palette[1],
            '--tone-3': slide.palette[2],
          }}
        >
          {slide.fullImage ? (
            <img
              className="ad-image"
              src={slide.image}
              alt={slide.hideContent ? '' : slide.title}
              aria-hidden={slide.hideContent ? 'true' : undefined}
              style={{ objectPosition: slide.imagePosition || 'center center' }}
            />
          ) : (
            <div className="ad-product-scene">
              <img
                className="ad-package-image"
                src={slide.image}
                alt={slide.title}
                style={{
                  objectPosition: slide.packagePosition || 'center center',
                  '--package-scale': slide.packageScale || '0.84',
                }}
              />
              {slide.pebbles?.map((pebble, pebbleIndex) => (
                <img
                  key={`${slide.title}-pebble-${pebbleIndex}`}
                  className={`ad-pebble ${pebble.className}`}
                  src={pebble.src}
                  alt=""
                  aria-hidden="true"
                />
              ))}
              {slide.showPriceBadge ? (
                <div className="ad-price-badge" aria-label={`Ab ${slide.priceText}`}>
                  <span className="ad-price-from">ab</span>
                  <span className="ad-price-amount">{slide.priceText}</span>
                  <span className="ad-price-unit">pro Stk.</span>
                </div>
              ) : null}
              {slide.comingSoon ? (
                <div className="ad-coming-soon">Coming Soon</div>
              ) : null}
            </div>
          )}
          <div className="ad-image-tint" />
          <div className="ad-image-glow" />
          {!slide.hideContent ? (
            <div className="ad-content">
              <p className="ad-eyebrow">{slide.eyebrow}</p>
              <h2 className="ad-title">{slide.title}</h2>
              <p className="ad-subtitle">{slide.subtitle}</p>
              <div className="ad-badge">Zoogies Aroma Pebbles</div>
            </div>
          ) : null}
        </article>
      ))}

      <div className="ad-progress" aria-hidden="true">
        {slides.map((slide, index) => (
          <span key={slide.title} className={index === activeIndex ? 'is-active' : ''} />
        ))}
      </div>
    </aside>
  );
}

export default ZoogiesAdLoop;
