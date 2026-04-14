function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderItems(items) {
  return items.map((item) => (
    <div className="menu-item" key={`${item.name}-${item.price}`}>
      <div className="item-copy">
        <span className="item-name">{item.name}</span>
        <span className="item-translation">{item.translation}</span>
      </div>
      <span className="item-price">{item.price}</span>
    </div>
  ));
}

function MenuSection({ titleDe, titleEn, items, groups }) {
  const sectionId = `section-${slugify(titleDe)}`;

  return (
    <section className="menu-section" aria-labelledby={sectionId}>
      <h2 className="section-title" id={sectionId}>
        <span>{titleDe}</span>
        <span className="section-title-translation">{titleEn}</span>
      </h2>
      <div className="section-rule" />
      {items.length > 0 ? <div className="menu-items">{renderItems(items)}</div> : null}
      {groups?.map((group) => (
        <div className="menu-subgroup" key={group.titleDe}>
          <h3 className="subgroup-title">
            <span>{group.titleDe}</span>
            <span className="subgroup-title-translation">{group.titleEn}</span>
          </h3>
          <div className="menu-items menu-items-compact">{renderItems(group.items)}</div>
        </div>
      ))}
    </section>
  );
}

export default MenuSection;
