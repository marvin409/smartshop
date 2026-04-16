const WHATSAPP_NUMBER = "254105443420";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getProductKey = (product) =>
  String(product?.product_id || product?.id || product?.sku || product?.name || "product");

const hashValue = (value) => {
  return String(value)
    .split("")
    .reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);
};

const categoryDiscountRanges = {
  electronics: [12, 26],
  fashion: [18, 38],
  home: [10, 24],
  beauty: [14, 28],
  sports: [12, 22],
  featured: [8, 18],
};

export const getDiscountPercentage = (product) => {
  if (product?.discount_percentage) {
    return Math.max(5, Math.min(80, Math.round(Number(product.discount_percentage))));
  }

  const category = String(product?.category || "featured").toLowerCase();
  const [min, max] = categoryDiscountRanges[category] || [10, 22];
  const spread = max - min;
  const seed = hashValue(`${getProductKey(product)}-${category}-${product?.price || 0}`);
  return min + (seed % (spread + 1));
};

export const getCatalogCode = (product) => {
  if (product?.catalog_code) {
    return String(product.catalog_code).toUpperCase();
  }

  const seed = hashValue(`${getProductKey(product)}-catalog-code`)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0")
    .slice(-6);

  return `SS-${seed}`;
};

export const getFlashSaleState = (product) => {
  const seed = hashValue(`${getProductKey(product)}-flash-sale-window`);
  const saleDays = 5 + (seed % 6);
  const cooldownDays = seed % 2 === 0 ? 30 : 60;
  const cycleLength = saleDays + cooldownDays;
  const anchor = new Date(Date.UTC(2026, seed % 12, (seed % 20) + 1, 8, 0, 0));
  const now = Date.now();
  const elapsedDays = Math.max(0, Math.floor((now - anchor.getTime()) / DAY_IN_MS));
  const cyclePosition = elapsedDays % cycleLength;
  const isActive = cyclePosition < saleDays;
  const cycleStart = new Date(anchor.getTime() + (elapsedDays - cyclePosition) * DAY_IN_MS);
  const saleEndsAt = new Date(cycleStart.getTime() + saleDays * DAY_IN_MS);
  const nextSaleStartsAt = isActive
    ? new Date(cycleStart.getTime() + cycleLength * DAY_IN_MS)
    : new Date(cycleStart.getTime() + cycleLength * DAY_IN_MS);

  return {
    isActive,
    saleEndsAt,
    nextSaleStartsAt,
    cooldownDays,
  };
};

export const getFlashSaleEndDate = (product) => getFlashSaleState(product).saleEndsAt;

export const getProductPricing = (product) => {
  const basePrice = toNumber(product?.original_price ?? product?.price);
  const discountPercentage = getDiscountPercentage(product);
  const { isActive } = getFlashSaleState(product);
  const discountedPrice = Math.max(
    1,
    Math.round(basePrice * (1 - discountPercentage / 100))
  );
  const currentPrice = isActive ? discountedPrice : basePrice;
  const originalPrice = basePrice;
  const savings = isActive ? Math.max(0, originalPrice - currentPrice) : 0;

  return {
    currentPrice,
    originalPrice,
    discountPercentage,
    savings,
    isFlashSaleActive: isActive,
  };
};

export const enrichProduct = (product) => {
  const pricing = getProductPricing(product);

  return {
    ...product,
    productKey: getProductKey(product),
    catalog_code: getCatalogCode(product),
    sale_price: pricing.currentPrice,
    original_price: pricing.originalPrice,
    discount_percentage: pricing.discountPercentage,
    savings_amount: pricing.savings,
    is_flash_sale_active: pricing.isFlashSaleActive,
    flash_sale_ends_at: getFlashSaleState(product).saleEndsAt.toISOString(),
    next_flash_sale_starts_at: getFlashSaleState(product).nextSaleStartsAt.toISOString(),
  };
};

export const getCartItemTotal = (item) => getProductPricing(item).currentPrice;

export const searchCatalog = (products, query = "", category = "all") => {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedCategory = String(category || "all").toLowerCase();

  return products.filter((product) => {
    const productCategory = String(product?.category || "featured").toLowerCase();
    const categoryMatch = normalizedCategory === "all" || productCategory.includes(normalizedCategory);

    if (!normalizedQuery) {
      return categoryMatch;
    }

    const haystack = [
      product?.name,
      product?.category,
      product?.description,
      product?.brand,
      getCatalogCode(product),
      product?.product_id,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return categoryMatch && haystack.includes(normalizedQuery);
  });
};

export const buildReceiptItems = (items) => {
  const grouped = new Map();

  items.forEach((item) => {
    const key = getProductKey(item);
    const existing = grouped.get(key);
    const pricing = getProductPricing(item);

    if (existing) {
      existing.quantity += 1;
      existing.lineTotal += pricing.currentPrice;
      return;
    }

    grouped.set(key, {
      ...enrichProduct(item),
      quantity: 1,
      lineTotal: pricing.currentPrice,
    });
  });

  return Array.from(grouped.values());
};

export const getWhatsAppUrl = () => `https://wa.me/${WHATSAPP_NUMBER}`;

export const getWhatsAppNumber = () => WHATSAPP_NUMBER;
