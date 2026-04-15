import logoImage from '../assets/cannastoreLogo';
import MenuSection from './MenuSection';
import PremiumSmoke from './PremiumSmoke';

function CannastoreMenu({ sections, activeMenuId }) {
  return (
    <section className="menu-panel">
      <header className="menu-header">
        <div className="brand-row">
          <PremiumSmoke className="brand-smoke" opacity={0.82} brightness={1.05} thickness={0.1} speed={0.16} drift={0.024} curlAmount={0.74} />
          <div className="brand-mark" aria-hidden="true">
            <img src={logoImage} alt="" />
          </div>
          <div className="brand-copy">
            <h1>Cannabis Store Vienna</h1>
            <p>Premium Menu</p>
          </div>
        </div>
        <div className="header-divider" />
      </header>

      <div className="menu-grid">
        {sections.map((section) => (
          <MenuSection
            key={section.titleDe}
            titleDe={section.titleDe}
            titleEn={section.titleEn}
            items={section.items}
            groups={section.groups}
            activeMenuId={activeMenuId}
          />
        ))}
      </div>
    </section>
  );
}

export default CannastoreMenu;
