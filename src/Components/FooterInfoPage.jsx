import React from "react";

const FooterInfoPage = ({ eyebrow, title, intro, cards, sections }) => {
  return (
    <section className="footer-info-page">
      <div className="footer-info-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>

      <div className="footer-info-card-grid">
        {cards.map((card) => (
          <article key={card.title} className="footer-info-card">
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        ))}
      </div>

      <div className="footer-info-sections">
        {sections.map((section) => (
          <article key={section.title} className="footer-info-section">
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph, index) => (
              <p key={`${section.title}-${index}`}>{paragraph}</p>
            ))}
            {section.items && (
              <ul className="footer-info-list">
                {section.items.map((item) => (
                  <li key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default FooterInfoPage;
