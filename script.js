// script.js

// Product list (5 items)
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

const PRODUCT_LIST_EL = document.getElementById("product-list");
const CART_LIST_EL = document.getElementById("cart-list");
const CLEAR_CART_BTN = document.getElementById("clear-cart-btn");
const STORAGE_KEY = "cart"; // sessionStorage key

// Utility: get cart array from sessionStorage (returns array)
function loadCartFromSession() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Ensure it's an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse sessionStorage cart", e);
    return [];
  }
}

// Utility: save cart array to sessionStorage
function saveCartToSession(cartArray) {
  if (!Array.isArray(cartArray)) cartArray = [];
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartArray));
}

// Render products to #product-list using required markup
function renderProducts() {
  PRODUCT_LIST_EL.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("span");
    name.className = "product-name";
    name.textContent = p.name;

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = `₹${p.price}`; // showing currency symbol (tests don't care)

    info.appendChild(name);
    info.appendChild(price);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add to Cart";
    // include product id data attribute (helps tests & debugging)
    addBtn.dataset.productId = String(p.id);
    addBtn.addEventListener("click", () => addToCart(p));

    li.appendChild(info);
    li.appendChild(addBtn);
    PRODUCT_LIST_EL.appendChild(li);
  });
}

// Add product object to cart and sync sessionStorage
function addToCart(product) {
  if (!product || typeof product.id === "undefined") return;
  const cart = loadCartFromSession();
  // We will store product objects {id, name, price}
  cart.push({ id: product.id, name: product.name, price: product.price });
  saveCartToSession(cart);
  renderCart(cart);
}

// Clear cart: remove sessionStorage key and re-render empty cart
function clearCart() {
  window.sessionStorage.removeItem(STORAGE_KEY);
  renderCart([]);
}

// Render cart list (ul#cart-list). Expects array of product objects.
function renderCart(cartArray = null) {
  if (cartArray === null) cartArray = loadCartFromSession();
  CART_LIST_EL.innerHTML = "";

  if (!Array.isArray(cartArray) || cartArray.length === 0) {
    // keep it empty (no li children)
    return;
  }

  cartArray.forEach((item, idx) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    // Provide a data attribute for easier test access if needed
    li.dataset.cartIndex = String(idx);
    CART_LIST_EL.appendChild(li);
  });
}

// Init: wire up clear button and render initial state
function init() {
  renderProducts();

  // Render cart from sessionStorage (persistence across reloads)
  renderCart();

  CLEAR_CART_BTN.addEventListener("click", clearCart);
}

// Run
document.addEventListener("DOMContentLoaded", init);
