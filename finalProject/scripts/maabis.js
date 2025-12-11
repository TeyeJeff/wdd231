const hamburger = document.querySelector(".hamburger");
const navigation2 = document.querySelector(".navigation2");
const jewelryContainer = document.getElementById("jewelryContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

let allJewelries = [];

// My Hamburger Menu
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("show");
    navigation2.classList.toggle("show");
});

// Loading  products from jewelry json file using asynchronous method
async function loadJewelries() {
    try {
        const res = await fetch('data/jewelries.json');
        if (!res.ok) throw new Error();
        allJewelries = await res.json();
        displayJewelries(allJewelries);
    } catch (err) {
        jewelryContainer.innerHTML = `<p style="color:red;text-align:center;padding:2rem;">Failed to load products</p>`;
    }
}

// Displaying all jewelries in the json file on a card 
function displayJewelries(items) {
    jewelryContainer.innerHTML = '';
    if (!items.length) {
        jewelryContainer.innerHTML = '<p style="text-align:center;padding:2rem;">No items found.</p>';
        return;
    }

    items.forEach(j => {
        const card = document.createElement("div");
        card.className = "jewelry-card";
        card.innerHTML = `
            <img src="${j.image}" alt="${j.brandName}" loading="lazy">
            <h2>${j.brandName}</h2>
            <p class="item-type">${j.type}</p>
            <p>${j.material || "Premium Material"}</p>
            <p><strong>${j.price}</strong></p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;
        jewelryContainer.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(b => b.onclick = addToCart);
}

// Filter & search for a jewelry

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        displayJewelries(allJewelries);
        results.textContent = '';
        jewelryContainer.style.display = 'flex';
        return;
    }

    const filtered = allJewelries.filter(j =>
        j.brandName.toLowerCase().includes(searchTerm) ||
        j.type.toLowerCase().includes(searchTerm) ||
        (j.material && j.material.toLowerCase().includes(searchTerm))
    );

    displayJewelries(filtered);
    jewelryContainer.style.display = 'flex';
    results.textContent = filtered.length > 0
        ? `Showing ${filtered.length} results for "${searchTerm}"`
        : `No results found for "${searchTerm}"`;
}

function filterByCategory(cat) {
    const f = cat === 'All' ? allJewelries : allJewelries.filter(i => i.type === cat);
    displayJewelries(f);
    navigation2.classList.remove("show"); hamburger.classList.remove("show");
}
document.querySelectorAll('.navigation2 a').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const m = { all:'All', watch:'Watch', rings:'Ring', earrings:'Earring', bracelets:'Bracelet', anklets:'Anklet' };
        filterByCategory(m[a.id] || 'All');
    });
});
searchBtn.onclick = handleSearch; 
searchInput.oninput = () => { if(!searchInput.value.trim()) { results.innerHTML=''; jewelryContainer.style.display='flex'; }};

// CART SYSTEM USING MODAL DIALOG  
let cart = JSON.parse(localStorage.getItem('maabisCart')) || [];

const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');

function addToCart(e) {
    const card = e.target.closest('.jewelry-card');
    const name = card.querySelector('h2').textContent;
    const type = card.querySelector('.item-type').textContent;
    const price = card.querySelector('strong').textContent;
    const image = card.querySelector('img').src;

    const item = { name, type, price, image, quantity: 1 };
    const exists = cart.find(i => i.name === name);
    if (exists) exists.quantity += 1;
    else cart.push(item);

    saveCart();
    updateCartCount();
    renderCart();
    cartModal.showModal();
    alert(`${name} added!`);
}

function saveCart() { localStorage.setItem('maabisCart', JSON.stringify(cart)); }
function updateCartCount() {
    cartCount.textContent = cart.reduce((s,i)=>s+i.quantity, 0);
}

function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (!cart.length) {
        cartItemsContainer.innerHTML = '<p style="text-align:center;color:#777;padding:1rem;">Your cart is empty</p>';
        return;
    }
    cart.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.type} • ${item.price}</p>
                <div class="quantity-controls">
                    <button class="qty-btn" data-index="${i}" data-change="-1">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-index="${i}" data-change="1">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${i}">×</button>
        `;
        cartItemsContainer.appendChild(div);
    });
    document.querySelectorAll('.qty-btn').forEach(b => b.onclick = e => {
        const i = +e.target.dataset.index;
        const c = +e.target.dataset.change;
        cart[i].quantity = Math.max(1, cart[i].quantity + c);
        saveCart(); updateCartCount(); renderCart();
    });
    document.querySelectorAll('.remove-item').forEach(b => b.onclick = e => {
        cart.splice(+e.target.dataset.index, 1);
        saveCart(); updateCartCount(); renderCart();
    });
}

// WHATSAPP CHECKOUT
checkoutBtn.onclick = () => {
    if (!cart.length) return alert("Cart is empty!");

    let msg = "Hello MaabisJewels! I'd like to place an order:\n\n";
    let total = 0;

    cart.forEach(item => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.-]/g, ''));
        const lineTotal = priceNum * item.quantity;
        total += lineTotal;
        msg += `${item.quantity} × ${item.name}\n`;
        msg += `   ├ Type: ${item.type}\n`;
        msg += `   └ ${item.price} × ${item.quantity} = $${lineTotal.toFixed(2)}\n\n`;
    });

    msg += `Total: *$${total.toFixed(2)}*\n\nThank you!`;

    const phone = "233204721265"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    cartModal.close();
};

closeModal.onclick = () => cartModal.close();
clearCartBtn.onclick = () => { if(confirm("Clear cart?")) { cart=[]; saveCart(); updateCartCount(); renderCart(); }};

// Initializing
document.addEventListener('DOMContentLoaded', () => {
    loadJewelries();
    updateCartCount();
    renderCart();
});