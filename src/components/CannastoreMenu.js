import logoImage from '../assets/cannastoreLogo';
import MenuSection from './MenuSection';

function CannastoreMenu({ sections, activeMenuId }) {
  return (
    <section className="menu-panel">
      <header className="menu-header">
        <div className="brand-row">
          <img
            className="brand-smoke"
            src={`${process.env.PUBLIC_URL}/green smoke.png`}
            alt=""
            aria-hidden="true"
          />
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
