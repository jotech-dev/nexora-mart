// ========================================
// NEXORA MART — Main JavaScript
// ========================================

// Replace with your WhatsApp number.
// Nigerian example: 2348012345678
const WHATSAPP_NUMBER = "2349162909940";

// ========================================
// PRODUCT DATA
// ========================================

const products = [
    {
        id: 1,
        name: "Premium Rice",
        category: "groceries",
        price: 75000,
        image: "images/rice.jpg",
        description: "Quality rice for everyday family meals."
    },
    {
        id: 2,
        name: "Vegetable Oil",
        category: "groceries",
        price: 12500,
        image: "images/vegetable-oil.jpg",
        description: "A kitchen essential for your daily cooking."
    },
    {
        id: 3,
        name: "Spaghetti",
        category: "groceries",
        price: 1800,
        image: "images/spaghetti.jpg",
        description: "A convenient choice for delicious meals."
    },
    {
        id: 4,
        name: "Tomato Paste",
        category: "groceries",
        price: 1500,
        image: "images/tomato-paste.jpg",
        description: "Add rich tomato flavour to your meals."
    },
    {
        id: 5,
        name: "Malt Drink",
        category: "beverages",
        price: 1200,
        image: "images/malt.jpg",
        description: "A refreshing malt beverage."
    },
    {
        id: 6,
        name: "Bottled Water",
        category: "beverages",
        price: 500,
        image: "images/water.jpg",
        description: "Convenient bottled drinking water."
    },
    {
        id: 7,
        name: "Soft Drink",
        category: "beverages",
        price: 700,
        image: "images/soft-drink.jpg",
        description: "A chilled drink for a refreshing break."
    },
    {
        id: 8,
        name: "Biscuits",
        category: "snacks",
        price: 800,
        image: "images/biscuits.jpg",
        description: "Crunchy biscuits for a quick snack."
    },
    {
        id: 9,
        name: "Potato Chips",
        category: "snacks",
        price: 1000,
        image: "images/chips.jpg",
        description: "Crispy chips for snack time."
    },
    {
        id: 10,
        name: "Chocolate Bar",
        category: "snacks",
        price: 1200,
        image: "images/chocolate.jpg",
        description: "A sweet chocolate treat."
    },
    {
        id: 11,
        name: "Bathing Soap",
        category: "personal-care",
        price: 1000,
        image: "images/bathing-soap.jpg",
        description: "An everyday personal care essential."
    },
    {
        id: 12,
        name: "Toothpaste",
        category: "personal-care",
        price: 1800,
        image: "images/toothpaste.jpg",
        description: "An essential for your daily oral care."
    },
    {
        id: 13,
        name: "Body Lotion",
        category: "personal-care",
        price: 3500,
        image: "images/body-lotion.jpg",
        description: "A lotion for your everyday skincare routine."
    },
    {
        id: 14,
        name: "Laundry Detergent",
        category: "household",
        price: 2500,
        image: "images/detergent.jpg",
        description: "An essential for your laundry routine."
    },
    {
        id: 15,
        name: "Dishwashing Liquid",
        category: "household",
        price: 2000,
        image: "images/dishwashing-liquid.jpg",
        description: "Helps keep your dishes clean."
    }
];

// ========================================
// DOM ELEMENTS
// ========================================

const productGrid = document.getElementById("product-grid");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const categoryLinks = document.querySelectorAll(
    "button.category-link[data-category], button.category-card[data-category]"
);

const sortSelect = document.getElementById("sort-products");
const resultsCount = document.getElementById("results-count");
const emptyResults = document.getElementById("empty-results");
const resetProductsButton = document.getElementById("reset-products");

const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");
const cartOverlay = document.getElementById("cart-overlay");
const cartPanel = document.getElementById("cart-panel");

const cartCount = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartSubtotal = document.getElementById("cart-subtotal");

const checkoutButton = document.getElementById("checkout-button");
const continueShoppingButton = document.getElementById("continue-shopping");
const continueShoppingBottom = document.getElementById(
    "continue-shopping-bottom"
);

const currentYear = document.getElementById("current-year");

// ========================================
// APPLICATION STATE
// ========================================

// Detect whether this is the homepage or a category page.
const categoryPages = {
    "groceries.html": "groceries",
    "beverages.html": "beverages",
    "snacks.html": "snacks",
    "personal-care.html": "personal-care",
    "household.html": "household"
};

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

const pageCategory = categoryPages[currentPage] || "all";

let activeCategory = pageCategory;
let searchTerm = "";

let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("nexoraCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart
            .filter(item => {
                return (
                    item &&
                    Number.isInteger(Number(item.id)) &&
                    Number.isInteger(Number(item.quantity)) &&
                    Number(item.quantity) > 0 &&
                    Number.isFinite(Number(item.price)) &&
                    Number(item.price) >= 0 &&
                    products.some(
                        product => product.id === Number(item.id)
                    )
                );
            })
            .map(item => {
                const product = products.find(
                    product => product.id === Number(item.id)
                );

                return {
                    id: product.id,
                    quantity: Number(item.quantity),
                    name: product.name,
                    price: product.price,
                    image: product.image
                };
            });
    }
} catch (error) {
    cart = [];
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatPrice(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);
}

function saveCart() {
    try {
        localStorage.setItem(
            "nexoraCart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Unable to save cart:", error);
        showNotification("Your cart could not be saved on this device.");
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// ========================================
// PRODUCT DISPLAY
// ========================================

function renderProducts() {
    if (!productGrid) return;

    let filteredProducts = products.filter(product => {
    // Category pages must only show their own products.
    const requiredCategory =
        pageCategory !== "all" ? pageCategory : activeCategory;

    const matchesCategory =
        requiredCategory === "all" ||
        product.category === requiredCategory;

        const searchableText = (
            product.name + " " +
            product.category + " " +
            product.description
        ).toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    const sortValue = sortSelect ? sortSelect.value : "featured";

    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name") {
        filteredProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (resultsCount) {
        const total = filteredProducts.length;

        resultsCount.textContent =
            `${total} ${total === 1 ? "product" : "products"} found`;
    }

    if (emptyResults) {
        emptyResults.hidden = filteredProducts.length !== 0;
    }

    if (productGrid) {
        productGrid.hidden = filteredProducts.length === 0;
    }

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = "";
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image-wrap">
                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category.replace("-", " "))}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHTML(product.description)}
                </p>

                <div class="product-bottom">

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        type="button"
                        class="add-to-cart"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>
    `).join("");
}

// ========================================
// CATEGORY FILTERING
// ========================================

function selectCategory(category) {
    activeCategory = category;

    categoryLinks.forEach(button => {
        const isActive =
            button.dataset.category === activeCategory;

        button.classList.toggle("active", isActive);

        if (button.classList.contains("category-link")) {
            button.setAttribute("aria-pressed", String(isActive));
        }
    });

    renderProducts();

    const productsSection = document.getElementById("products");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

categoryLinks.forEach(button => {
    button.addEventListener("click", () => {
        selectCategory(button.dataset.category);
    });
});

// ========================================
// SEARCH
// ========================================

if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim().toLowerCase();
        renderProducts();
    });
}

if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        searchTerm = searchInput.value.trim().toLowerCase();
        renderProducts();

        document.getElementById("products")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// ========================================
// SORT PRODUCTS
// ========================================

if (sortSelect) {
    sortSelect.addEventListener("change", renderProducts);
}

// ========================================
// RESET PRODUCTS
// ========================================

if (resetProductsButton) {
    resetProductsButton.addEventListener("click", () => {
        activeCategory = pageCategory;
        searchTerm = "";

        if (searchInput) {
            searchInput.value = "";
        }

        if (sortSelect) {
            sortSelect.value = "featured";
        }

        selectCategory("all");
    });
}

// ========================================
// ADD TO CART
// ========================================

function addToCart(productId) {
    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    openCart();

    showNotification(`${product.name} added to your cart.`);
}

if (productGrid) {
    productGrid.addEventListener("click", event => {
        const button = event.target.closest(".add-to-cart");

        if (!button) return;

        const productId = Number(button.dataset.productId);

        addToCart(productId);
    });
}

// ========================================
// UPDATE CART
// ========================================

function updateCart() {
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    const isEmpty = cart.length === 0;

    if (cartEmpty) {
        cartEmpty.hidden = !isEmpty;
    }

    if (cartFooter) {
        cartFooter.hidden = isEmpty;
    }

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">

                <div class="cart-item-visual">
                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >
                </div>

                <div class="cart-item-main">

                    <h3>${escapeHTML(item.name)}</h3>

                    <p>${formatPrice(item.price)}</p>

                    <div class="cart-item-controls">

                        <button
                            type="button"
                            data-action="decrease"
                            data-product-id="${item.id}"
                            aria-label="Decrease ${escapeHTML(item.name)} quantity"
                        >−</button>

                        <span>${item.quantity}</span>

                        <button
                            type="button"
                            data-action="increase"
                            data-product-id="${item.id}"
                            aria-label="Increase ${escapeHTML(item.name)} quantity"
                        >+</button>

                    </div>

                    <button
                        type="button"
                        class="remove-item"
                        data-action="remove"
                        data-product-id="${item.id}"
                    >
                        Remove
                    </button>

                </div>

                <strong class="cart-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </strong>

            </div>
        `).join("");
    }

    if (checkoutButton) {
        checkoutButton.disabled = isEmpty;
    }
}

// ========================================
// CART QUANTITY AND REMOVE CONTROLS
// ========================================

if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", event => {
        const button = event.target.closest("[data-action]");

        if (!button) return;

        const productId = Number(button.dataset.productId);
        const action = button.dataset.action;

        const item = cart.find(
            product => product.id === productId
        );

        if (!item) return;

        if (action === "increase") {
            item.quantity += 1;
        }

        if (action === "decrease") {
            item.quantity -= 1;

            if (item.quantity <= 0) {
                cart = cart.filter(
                    product => product.id !== productId
                );
            }
        }

        if (action === "remove") {
            cart = cart.filter(
                product => product.id !== productId
            );
        }

        saveCart();
        updateCart();
    });
}

// ========================================
// OPEN AND CLOSE CART
// ========================================

function openCart() {
    if (cartPanel) {
        cartPanel.classList.add("active");
        cartPanel.setAttribute("aria-hidden", "false");
        cartPanel.removeAttribute("inert");
    }

    if (cartOverlay) {
        cartOverlay.hidden = false;
        cartOverlay.classList.add("active");
    }

    if (cartToggle) {
        cartToggle.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("cart-open");
}

function closeCart() {
    if (cartPanel) {
        cartPanel.classList.remove("active");
        cartPanel.setAttribute("aria-hidden", "true");
        cartPanel.setAttribute("inert", "");
    }

    if (cartOverlay) {
        cartOverlay.classList.remove("active");
        cartOverlay.hidden = true;
    }

    if (cartToggle) {
        cartToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("cart-open");
}

if (cartToggle) {
    cartToggle.addEventListener("click", openCart);
}

if (cartClose) {
    cartClose.addEventListener("click", closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
}

if (continueShoppingButton) {
    continueShoppingButton.addEventListener("click", closeCart);
}

if (continueShoppingBottom) {
    continueShoppingBottom.addEventListener("click", closeCart);
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

// ========================================
// WHATSAPP CHECKOUT
// ========================================

function checkout() {
    if (cart.length === 0) {
        showNotification("Your cart is empty.");
        return;
    }

    if (
        !WHATSAPP_NUMBER ||
        WHATSAPP_NUMBER.includes("X")
    ) {
        showNotification("Set your WhatsApp number in script.js first.");
        return;
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    let message = "Hello NEXORA MART! I would like to place an order.\n\n";

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `Quantity: ${item.quantity}\n`;
        message += `Unit price: ${formatPrice(item.price)}\n`;
        message += `Item total: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    message += `Subtotal: ${formatPrice(subtotal)}\n\n`;
    message += "Please confirm availability and delivery details.";

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", checkout);
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message) {
    let notification = document.getElementById(
        "nexora-notification"
    );

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "nexora-notification";
        notification.setAttribute("role", "status");

        Object.assign(notification.style, {
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#176b45",
            color: "#ffffff",
            padding: "14px 20px",
            borderRadius: "10px",
            zIndex: "99999",
            fontSize: "14px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            maxWidth: "90%",
            textAlign: "center"
        });

        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.hidden = false;

    clearTimeout(notification.timeoutId);

    notification.timeoutId = setTimeout(() => {
        notification.hidden = true;
    }, 2500);
}

// ========================================
// FOOTER
// ========================================

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
    backToTop.addEventListener("click", event => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ========================================
// INITIALIZE WEBSITE
// ========================================

renderProducts();
updateCart();

console.log("NEXORA MART is ready.");
/* =========================================
ANIMATED CATEGORY HEADING
========================================= */

(() => {
const rotator = document.getElementById("category-heading-rotator");
const description = document.getElementById("category-heading-description");

if (!rotator || !description) return;

const slides = [
    {
        title: "Category",
        description: "Find the everyday essentials you need without the hassle."
    },
    {
        title: "Groceries",
        description: "Stock up on everyday food essentials for your home."
    },
    {
        title: "Beverages",
        description: "Discover refreshing drinks for every occasion."
    },
    {
        title: "Snacks",
        description: "Find tasty bites and treats for snack time."
    },
    {
        title: "Personal Care",
        description: "Shop everyday essentials for your personal care routine."
    },
    {
        title: "Household",
        description: "Get practical essentials to keep your home running smoothly."
    }
];

let currentIndex = 0;

const firstSlide = document.createElement("span");
firstSlide.textContent = slides[0].title;
firstSlide.classList.add("is-active");
rotator.replaceChildren(firstSlide);

function changeHeading() {
    const nextIndex = (currentIndex + 1) % slides.length;

    description.classList.add("is-changing");

    const currentSlide = rotator.querySelector("span");
    if (currentSlide) {
        currentSlide.classList.remove("is-active");
    }

    window.setTimeout(() => {
        currentIndex = nextIndex;

        const nextSlide = document.createElement("span");
        nextSlide.textContent = slides[currentIndex].title;
        rotator.replaceChildren(nextSlide);

        requestAnimationFrame(() => {
            nextSlide.classList.add("is-active");
            description.textContent = slides[currentIndex].description;
            description.classList.remove("is-changing");
        });
    }, 350);
}

window.setInterval(changeHeading, 3000);

})();