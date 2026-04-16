const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || "https://smartshop.alwaysdata.net";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

export const buildApiUrl = (path) => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const resolveAssetUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/420x320?text=SmartShop+appliances";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return buildApiUrl(path);
};
