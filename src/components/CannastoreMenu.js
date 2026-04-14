import logoImage from '../assets/cannastoreLogo';
import MenuSection from './MenuSection';

function CannastoreMenu({ sections }) {
  return (
    <section className="menu-panel">
      <header className="menu-header">
        <div className="brand-row">
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
          />
        ))}
      </div>
    </section>
  );
}

export default CannastoreMenu;
