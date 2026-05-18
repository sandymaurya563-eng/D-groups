// ---------- DATA ----------
const categories = ["Pizza", "Burger", "Sushi", "Chinese", "Dessert", "Biryani"];
const restaurants = [
    { name: "Tandoori Nights", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&auto=format", rating: 4.7, cuisine: "Indian" },
    { name: "Sushi Master", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format", rating: 4.9, cuisine: "Japanese" },
    { name: "Burger Republic", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format", rating: 4.5, cuisine: "American" },
    { name: "Pizza Heaven", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format", rating: 4.8, cuisine: "Italian" }
];
const foodItems = [
    { name: "Margherita Pizza", price: "$12", rating: 4.6, image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400", resto: "Pizza Heaven" },
    { name: "Classic Cheeseburger", price: "$9", rating: 4.5, image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400", resto: "Burger Republic" },
    { name: "Spicy Ramen", price: "$14", rating: 4.8, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400", resto: "Sushi Master" },
    { name: "Butter Chicken", price: "$16", rating: 4.9, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400", resto: "Tandoori Nights" }
];
const offers = [{ title: "Flat 50% OFF", desc: "First order | code: FIRST50" }, { title: "Free Delivery", desc: "Orders above $20" }];
const testimonials = [{ name: "Priya S.", text: "Best delivery experience! Super fast.", rating: 5 }, { name: "Rahul K.", text: "Great UI & amazing discounts.", rating: 5 }];

// ---------- STORAGE ----------
let users = JSON.parse(localStorage.getItem("foodAppUsers")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

function saveUsers() { localStorage.setItem("foodAppUsers", JSON.stringify(users)); }
function setSession(user) { localStorage.setItem("currentUser", JSON.stringify(user)); currentUser = user; }
function clearSession() { localStorage.removeItem("currentUser"); currentUser = null; }

// toast & loader
function showToast(msg, isError = false) { let t = document.createElement("div"); t.className = "toast"; t.innerHTML = msg; t.style.background = isError ? "#dc2626" : "#1f2a3e"; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
function showLoader(show) { document.getElementById("loadingOverlay").style.visibility = show ? "visible" : "hidden"; }

// render UI sections
function renderCategories() { document.getElementById("categoriesContainer").innerHTML = categories.map(c => `<div class="cat-item">${c}</div>`).join(''); }
function renderRestaurants(filter = "") { let filtered = restaurants.filter(r => r.name.toLowerCase().includes(filter) || r.cuisine.toLowerCase().includes(filter)); document.getElementById("restaurantsContainer").innerHTML = filtered.map(r => `<div class="resto-card"><img class="card-img" src="${r.image}" alt="${r.name}"><div class="card-content"><h3>${r.name}</h3><div class="rating">⭐ ${r.rating}</div><p>${r.cuisine}</p></div></div>`).join(''); }
function renderFoods(filter = "") { let filtered = foodItems.filter(f => f.name.toLowerCase().includes(filter) || f.resto.toLowerCase().includes(filter)); document.getElementById("foodItemsContainer").innerHTML = filtered.map(f => `<div class="food-card"><img class="card-img" src="${f.image}"><div class="card-content"><h3>${f.name}</h3><div class="rating">⭐ ${f.rating}</div><p>${f.price} · ${f.resto}</p><button class="btn-outline" style="margin-top:8px;">Order Now</button></div></div>`).join(''); }
function renderOffers() { document.getElementById("offersContainer").innerHTML = offers.map(o => `<div class="offer-card"><i class="fas fa-tag fa-2x" style="color:var(--accent)"></i><h3>${o.title}</h3><p>${o.desc}</p></div>`).join(''); }
function renderTestimonials() { document.getElementById("testimonialsContainer").innerHTML = testimonials.map(t => `<div class="testimonial-card card-content"><i class="fas fa-quote-left"></i><p>${t.text}</p><h4>- ${t.name}</h4><div>⭐ ${t.rating}</div></div>`).join(''); }

// dashboard generation
function populateDashboard() { if (!currentUser) return; document.getElementById("dashboardWelcome").innerHTML = `👋 Welcome back, ${currentUser.name}!`; document.getElementById("profileName").innerHTML = currentUser.name; document.getElementById("profileEmail").innerHTML = currentUser.email; const ordersHtml = `<div style="margin:10px 0"><i class="fas fa-pizza-slice"></i> Margherita Pizza · $12 <br><small>Delivered</small></div><div><i class="fas fa-hamburger"></i> Double Cheeseburger · $9 <br><small>Delivered</small></div><div><i class="fas fa-fish"></i> Salmon Sushi · $18<br><small>On the way</small></div>`; document.getElementById("ordersList").innerHTML = ordersHtml; const favsHtml = `<div><i class="fas fa-heart" style="color:red"></i> Butter Chicken</div><div><i class="fas fa-heart" style="color:red"></i> Spicy Ramen</div><div><i class="fas fa-heart" style="color:red"></i> Classic Cheeseburger</div>`; document.getElementById("favoritesList").innerHTML = favsHtml; }

// search filter
function handleSearch() { let val = document.getElementById("searchInput").value.toLowerCase(); renderRestaurants(val); renderFoods(val); }

// MODALS and auth
function openModal(id) { document.getElementById(id).classList.add("active"); }
function closeModals() { document.querySelectorAll(".modal").forEach(m => m.classList.remove("active")); }
function register() { let name = document.getElementById("regName").value.trim(); let email = document.getElementById("regEmail").value.trim(); let pwd = document.getElementById("regPassword").value; if (!name || !email || !pwd) return showToast("Fill all fields", true); if (users.find(u => u.email === email)) return showToast("Email already exists", true); let newUser = { id: Date.now(), name, email, password: pwd }; users.push(newUser); saveUsers(); showToast("Registered! Please login."); closeModals(); }
function login() { let email = document.getElementById("loginEmail").value.trim(); let pwd = document.getElementById("loginPassword").value; let user = users.find(u => u.email === email && u.password === pwd); if (!user) return showToast("Invalid credentials", true); showLoader(true); setTimeout(() => { setSession({ name: user.name, email: user.email, id: user.id }); showToast(`Welcome ${user.name}!`); closeModals(); showLoader(false); switchToDashboard(); }, 600); }
function logout() { clearSession(); showToast("Logged out"); switchToLanding(); }
function switchToDashboard() { if (!currentUser) return; document.getElementById("landingPage").style.display = "none"; document.getElementById("dashboardPage").style.display = "block"; populateDashboard(); }
function switchToLanding() { document.getElementById("landingPage").style.display = "block"; document.getElementById("dashboardPage").style.display = "none"; renderRestaurants(); renderFoods(); location.href = "#home"; }
// dark mode
function initDarkMode() { if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark"); document.getElementById("darkmodeToggle").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light"); }); }

// mobile menu
document.getElementById("hamburger")?.addEventListener("click", () => document.getElementById("navLinks").classList.toggle("show"));

// event listeners & page init
window.onload = () => {
    renderCategories(); renderRestaurants(); renderFoods(); renderOffers(); renderTestimonials(); initDarkMode();
    document.getElementById("searchBtn").addEventListener("click", handleSearch); document.getElementById("searchInput").addEventListener("keyup", (e) => { if (e.key === "Enter") handleSearch(); });
    document.getElementById("loginBtn").addEventListener("click", () => openModal("loginModal")); document.getElementById("registerBtn").addEventListener("click", () => openModal("registerModal"));
    document.querySelectorAll(".closeModal").forEach(btn => btn.addEventListener("click", closeModals));
    document.getElementById("submitLogin").addEventListener("click", login); document.getElementById("submitRegister").addEventListener("click", register);
    document.getElementById("dashboardLogoutBtn")?.addEventListener("click", logout);
    if (currentUser) switchToDashboard(); else switchToLanding();
};
// manual modal close by clicking outside
window.onclick = (e) => { if (e.target.classList.contains("modal")) closeModals(); };
// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => { anchor.addEventListener('click', function (e) { let href = this.getAttribute('href'); if (href !== "#" && href !== "#home") { e.preventDefault(); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); } }); });
// extra final touches: interactive category filters? we add search by category on cat item click
document.addEventListener("click", (e) => { if (e.target.classList.contains("cat-item")) { document.getElementById("searchInput").value = e.target.innerText; handleSearch(); } });
