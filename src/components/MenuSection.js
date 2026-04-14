function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderItems(items, activeMenuId) {
  return items.map((item) => {
    const isFeatured = item.menuId && item.menuId === activeMenuId;
    return (
      <div
        className={`menu-item${isFeatured ? ' is-featured' : ''}`}
        key={item.name}
        style={isFeatured ? { '--item-accent': item.accentColor } : undefined}
      >
        <div className="item-copy">
          <span className="item-name">{item.name}</span>
          <span className="item-translation">{item.translation}</span>
        </div>
        <span className="item-price">
          {Array.isArray(item.price)
            ? item.price.map((tier) => <span key={tier} className="price-tier">{tier}</span>)
            : item.price}
        </span>
      </div>
    );
  });
}

function MenuSection({ titleDe, titleEn, items, groups, activeMenuId }) {
  const sectionId = `section-${slugify(titleDe)}`;

  return (
    <section className="menu-section" aria-labelledby={sectionId}>
      <h2 className="section-title" id={sectionId}>
        <span>{titleDe}</span>
        <span className="section-title-translation">{titleEn}</span>
      </h2>
      <div className="section-rule" />
      {items.length > 0 ? <div className="menu-items">{renderItems(items, activeMenuId)}</div> : null}
      {groups?.map((group) => (
        <div className={`menu-subgroup${!group.titleDe ? ' menu-subgroup--compact' : ''}`} key={group.titleDe ?? group.items[0]?.name}>
          {group.titleDe ? (
            <h3 className="subgroup-title">
              <span>{group.titleDe}</span>
              <span className="subgroup-title-translation">{group.titleEn}</span>
            </h3>
          ) : null}
          <div className="menu-items menu-items-compact">{renderItems(group.items, activeMenuId)}</div>
        </div>
      ))}
    </section>
  );
}

export default MenuSection;
