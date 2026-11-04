// Data Menu Kopi
const menuData = [
  { id: 1, name: "Kopi Kenangan OJK", desc: "Espresso gula aren khas house blend", price: 18000 },
  { id: 2, name: "Americano Classic", desc: "Double shot espresso + air mineral", price: 15000 },
  { id: 3, name: "Latte Creamy", desc: "Espresso lembut dengan susuk murni", price: 22000 },
  { id: 4, name: "Caramel Macchiato", desc: "Espresso dengan sirup karamel gurih", price: 25000 }
];

let cart = [];
let orders = [];
let selectedMenu = null;

// Render Menu ke Halaman
function renderMenu() {
  const container = document.getElementById('menu-container');
  container.innerHTML = menuData.map(item => `
    <div class="menu-card">
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <span class="price">Rp ${item.price.toLocaleString('id-ID')}</span>
      <button class="btn primary" onclick="openModal(${item.id})">Pesan & Kustom</button>
    </div>
  `).join('');
}

// Handler Modal Kustomisasi
function openModal(id) {
  selectedMenu = menuData.find(m => m.id === id);
  document.getElementById('modal-title').innerText = `Kustomisasi: ${selectedMenu.name}`;
  document.getElementById('custom-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('custom-modal').classList.remove('active');
}

// Toggle Tombol Pilihan (Ukuran, Gula, Susu)
document.querySelectorAll('.btn-options').forEach(group => {
  group.addEventListener('click', (e) => {
    if (e.target.classList.contains('opt-btn')) {
      group.querySelectorAll('.opt-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
});

// Tambah ke Keranjang
function addToCartFromModal() {
  const size = document.querySelector('#opt-size .opt-btn.active').dataset.val;
  const sugar = document.querySelector('#opt-sugar .opt-btn.active').dataset.val;
  const milk = document.querySelector('#opt-milk .opt-btn.active').dataset.val;

  let extraPrice = 0;
  if (size.includes('Large')) extraPrice += 5000;
  if (milk.includes('Oat')) extraPrice += 6000;

  const itemTotal = selectedMenu.price + extraPrice;

  cart.push({
    name: selectedMenu.name,
    size, sugar, milk,
    price: itemTotal
  });

  closeModal();
  updateCartUI();
}

// Update Tampilan Keranjang
function updateCartUI() {
  const cartList = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartCount = document.getElementById('cart-count');
  const btnCheckout = document.getElementById('btn-checkout');

  cartCount.innerText = cart.length;

  if (cart.length === 0) {
    cartList.innerHTML = `<li class="empty-msg">Keranjang masih kosong. Pilih menu di atas!</li>`;
    cartTotal.innerText = "Rp 0";
    btnCheckout.disabled = true;
    return;
  }

  let total = 0;
  cartList.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <li class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <small>${item.size} | Gula: ${item.sugar} | Susu: ${item.milk}</small>
        </div>
        <div>
          <span>Rp ${item.price.toLocaleString('id-ID')}</span>
          <button style="border:none; background:none; color:red; cursor:pointer; margin-left:10px;" onclick="removeFromCart(${index})">&times;</button>
        </div>
      </li>
    `;
  }).join('');

  cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
  btnCheckout.disabled = false;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Checkout ke Dashboard Barista
function checkout() {
  if (cart.length === 0) return;

  const newOrder = {
    id: '#' + Math.floor(1000 + Math.random() * 9000),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    status: 'Diterima'
  };

  orders.push(newOrder);
  cart = [];
  updateCartUI();
  renderOrders();
  alert("Pesanan berhasil dikirim ke Barista!");
}

// Render & Ubah Status Pesanan Barista
function renderOrders() {
  const container = document.getElementById('orders-list');
  if (orders.length === 0) {
    container.innerHTML = `<p style="color:#8c8178;">Belum ada pesanan masuk.</p>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-card">
      <strong>ID Pesanan: ${order.id}</strong>
      <span class="status-badge status-${order.status}">${order.status}</span>
      <ul style="padding-left: 15px; margin: 10px 0; font-size: 12px;">
        ${order.items.map(i => `<li>${i.name} (${i.size})</li>`).join('')}
      </ul>
      <p style="font-weight:bold; font-size: 13px;">Total: Rp ${order.total.toLocaleString('id-ID')}</p>
      
      <div class="status-btn-group">
        <button onclick="changeStatus('${order.id}', 'Diterima')">Diterima</button>
        <button onclick="changeStatus('${order.id}', 'Dibuat')">Proses</button>
        <button onclick="changeStatus('${order.id}', 'Selesai')">Selesai</button>
      </div>
    </div>
  `).join('');
}

function changeStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    renderOrders();
  }
}

// Inisialisasi
renderMenu();
renderOrders();