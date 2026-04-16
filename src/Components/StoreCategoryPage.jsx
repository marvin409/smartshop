import React from "react";
import ProductCard from "./ProductCard";

const StoreCategoryPage = ({ eyebrow, title, intro, highlights, spotlight, products, notes }) => {
  return (
    <section className="store-category-page">
      <div className="category-hero-card">
        <div className="category-hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>

        <div className="category-highlight-grid">
          {highlights.map((item) => (
            <article key={item.title} className="category-highlight-card">
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="category-spotlight">
        <div>
          <span className="eyebrow">Spotlight</span>
          <h2>{spotlight.title}</h2>
          <p>{spotlight.copy}</p>
        </div>
        <div className="spotlight-metrics">
          {spotlight.metrics.map((metric) => (
            <div key={metric.label} className="spotlight-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Featured picks</span>
          <h2>Curated for real shoppers</h2>
        </div>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <ProductCard key={product.product_id || `${product.name}-${index}`} product={product} />
        ))}
      </div>

      <div className="category-note-grid">
        {notes.map((note) => (
          <article key={note.title} className="category-note-card">
            <h3>{note.title}</h3>
            <p>{note.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StoreCategoryPage;
