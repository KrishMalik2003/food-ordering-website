let isLoggedIn = false;
let cart = [];
let foods = [];
let currentUserEmail = '';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('home-link').addEventListener('click', showHomePage);
    document.getElementById('register-link').addEventListener('click', showRegistrationPage);
    document.getElementById('login-link').addEventListener('click', showLoginPage);
    showHomePage();
});

function showHomePage() {
    if (!isLoggedIn) {
        showLoginPage();
        return;
    }

    const main = document.getElementById('main-content');
    main.innerHTML = `
        <h1>Welcome to FoodOrder</h1>
        <input type="text" id="food-search" placeholder="Search food..." oninput="filterFoodItems()" />
        <div id="food-list"></div>
        <div id="cart">
            <h3>Your Cart</h3>
            <ul id="cart-items"></ul>
            <p>Total: $<span id="cart-total">0.00</span></p>
            <button onclick="goToPayment()">Proceed to Payment</button>
        </div>
    `;
    loadFoodItems();
    updateNav();
}

function showRegistrationPage() {
    document.getElementById('main-content').innerHTML = `
        <h2>Register</h2>
        <form id="register-form">
            <input type="email" id="reg-email" placeholder="Email" required>
            <input type="password" id="reg-password" placeholder="Password" required>
            <input type="tel" id="reg-mobile" placeholder="Mobile" required>
            <button type="submit">Register</button>
        </form>
    `;
    document.getElementById('register-form').addEventListener('submit', handleRegistration);
}

function showLoginPage() {
    document.getElementById('main-content').innerHTML = `
        <h2>Login</h2>
        <form id="login-form">
            <input type="email" id="username" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `;
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function handleRegistration(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const mobile = document.getElementById('reg-mobile').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mobile })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.success ? 'Registered! Please log in.' : 'Registration failed: ' + data.message);
        if (data.success) showLoginPage();
    })
    .catch(err => {
        console.error('Registration error:', err);
        alert('Server error.');
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            isLoggedIn = true;
            currentUserEmail = email;
            alert('Login successful!');
            showHomePage();
        } else {
            alert('Invalid credentials.');
        }
    })
    .catch(err => {
        console.error('Login error:', err);
        alert('Server error.');
    });
}

function loadFoodItems() {
    foods = [
        { name: 'Pizza', price: 12.99 },
        { name: 'Burger', price: 8.99 },
        { name: 'Salad', price: 7.99 },
        { name: 'Fries', price: 4.99 },
        { name: 'Coke', price: 1.99 }
    ];
    renderFoodList(foods);
}

function renderFoodList(foodArray) {
    const list = document.getElementById('food-list');
    list.innerHTML = '';
    foodArray.forEach((food, index) => {
        const item = document.createElement('div');
        item.className = 'food-item';
        item.innerHTML = `
            <h3>${food.name}</h3>
            <p>$${food.price}</p>
            <label>Qty: <input type="number" id="qty-${index}" value="1" min="1" style="width: 50px;"></label>
            <button onclick="addToCart('${food.name}', ${food.price}, 'qty-${index}')">Add</button>
        `;
        list.appendChild(item);
    });
}

function filterFoodItems() {
    const query = document.getElementById('food-search').value.toLowerCase();
    const filtered = foods.filter(f => f.name.toLowerCase().includes(query));
    renderFoodList(filtered);
}

function addToCart(name, price, qtyId) {
    const qty = parseInt(document.getElementById(qtyId).value) || 1;
    cart.push({ name, price, quantity: qty });
    updateCart();
}

function updateCart() {
    const items = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    items.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromCart(${i})">Remove</button>`;
        items.appendChild(li);
        total += item.price * item.quantity;
    });
    totalEl.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function goToPayment() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    const total = document.getElementById('cart-total').textContent;
    document.getElementById('main-content').innerHTML = `
        <h2>Payment</h2>
        <p>Total: $${total}</p>
        <form id="payment-form">
            <input type="text" placeholder="Card Number" required>
            <input type="text" placeholder="Expiry Date" required>
            <input type="text" placeholder="CVV" required>
            <button type="submit">Place Order</button>
        </form>
    `;
    document.getElementById('payment-form').addEventListener('submit', handlePayment);
}

function handlePayment(e) {
    e.preventDefault();
    const total = parseFloat(document.getElementById('cart-total').textContent);

    fetch('http://localhost:3000/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userEmail: currentUserEmail,
            cart: cart,
            total: total
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('✅ Order placed successfully!');
            cart = [];
            showHomePage();
        } else {
            showNotification('❌ Failed to place order: ' + data.message);
        }
        
    })
    .catch(err => {
        console.error('Order error:', err);
        alert('Server error.');
    });
}

function updateNav() {
    const nav = document.getElementById('nav-links');
    nav.innerHTML = `
        <li><a href="#" id="home-link">Home</a></li>
        <li><a href="#" id="logout-link">Logout</a></li>
    `;
    document.getElementById('home-link').addEventListener('click', showHomePage);
    document.getElementById('logout-link').addEventListener('click', () => {
        isLoggedIn = false;
        currentUserEmail = '';
        cart = [];
        alert('Logged out.');
        showLoginPage();
    });
}
