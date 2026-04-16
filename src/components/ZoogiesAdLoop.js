import { useEffect, useState } from 'react';

function ZoogiesAdLoop({ slides, onSlideChange }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    if (slides.length === 0) {
      setActiveIndex(0);
      return;
    }

    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  useEffect(() => {
    onSlideChange?.(activeSlide?.menuId ?? null);
  }, [activeSlide, onSlideChange]);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (!activeSlide) {
    return null;
  }

  return (
    <aside className="ad-panel" aria-label="Zoogies rotating advertisement">
      <article
        key={activeSlide.title}
        className="ad-slide ad-slide--fade-in is-active"
        style={{
          '--glow': activeSlide.glow,
          '--tone-1': activeSlide.palette[0],
          '--tone-2': activeSlide.palette[1],
          '--tone-3': activeSlide.palette[2],
        }}
      >
        {activeSlide.fullImage ? (
          <img
            className="ad-image"
            src={activeSlide.image}
            alt={activeSlide.hideContent ? '' : activeSlide.title}
            aria-hidden={activeSlide.hideContent ? 'true' : undefined}
            style={{ objectPosition: activeSlide.imagePosition || 'center center' }}
          />
        ) : (
          <div className="ad-product-scene">
            <img
              className="ad-package-image"
              src={activeSlide.image}
              alt={activeSlide.title}
              style={{
                objectPosition: activeSlide.packagePosition || 'center center',
                '--package-scale': activeSlide.packageScale || '0.84',
              }}
            />
            {activeSlide.showPriceBadge ? (
              <div className="ad-price-badge" aria-label={`Ab ${activeSlide.priceText}`}>
                <span className="ad-price-from">ab</span>
                <span className="ad-price-amount">{activeSlide.priceText}</span>
                <span className="ad-price-unit">pro Stk.</span>
              </div>
            ) : null}
            {activeSlide.comingSoon ? (
              <div className="ad-coming-soon">Coming Soon</div>
            ) : null}
          </div>
        )}
        <div className="ad-image-tint" />
        <div className="ad-image-glow" />
        {!activeSlide.hideContent ? (
          <div className="ad-content">
            <p className="ad-eyebrow">{activeSlide.eyebrow}</p>
            <h2 className="ad-title">{activeSlide.title}</h2>
            <p className="ad-subtitle">{activeSlide.subtitle}</p>
            <div className="ad-badge">Zoogies Aroma Pebbles</div>
          </div>
        ) : null}
      </article>

      <div className="ad-progress" aria-hidden="true">
        {slides.map((slide, index) => (
          <span key={slide.title} className={index === activeIndex ? 'is-active' : ''} />
        ))}
      </div>
    </aside>
  );
}

export default ZoogiesAdLoop;
