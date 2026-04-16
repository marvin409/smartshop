const USER_STORAGE_KEY = "user";

export const getStoredUser = () => {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const isAdminUser = (user) => {
  if (!user || typeof user !== "object") {
    return false;
  }

  if (user.role === "admin" || user.source === "local-fallback") {
    return true;
  }

  return user.is_admin === true || user.is_admin === 1 || user.is_admin === "1";
};

export const storeUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("smartshop-auth-changed"));
};

export const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  window.dispatchEvent(new Event("smartshop-auth-changed"));
};
