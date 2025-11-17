// Alpine.js component untuk dashboard Shoesmu (bukan super-admin)
// Inisialisasi produk default ke localStorage jika belum ada (agar sinkron dengan super-admin)
if (!localStorage.getItem('products')) {
  localStorage.setItem('products', JSON.stringify([
    {
      id: 'PRD-1',
      name: 'Nike Air Force 1 Shadow',
      brand: 'Nike',
      category: 'Sneakers',
      price: 150.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-800x800.png',
      rating: 4,
      color: 'white',
      isFavorite: false
    },
    {
      id: 'PRD-2',
      name: 'Nike Dunk High Retro',
      brand: 'Nike',
      category: 'Sneakers',
      price: 125.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-800x800.png',
      rating: 4,
      color: 'red',
      isFavorite: false
    },
    {
      id: 'PRD-3',
      name: 'Nike Blazer Mid 77',
      brand: 'Nike',
      category: 'Sneakers',
      price: 105.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e-800x800.png',
      rating: 4,
      color: 'white',
      isFavorite: false
    },
    {
      id: 'PRD-4',
      name: 'Nike Blazer Mid 77',
      brand: 'Nike',
      category: 'Sneakers',
      price: 105.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e-800x800.png',
      rating: 4,
      color: 'blue',
      isFavorite: false
    },
    {
      id: 'PRD-5',
      name: 'Nike Air Max 270',
      brand: 'Nike',
      category: 'Sneakers',
      price: 139.97,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-800x800.png',
      rating: 4,
      color: 'white',
      isFavorite: false
    },
    {
      id: 'PRD-6',
      name: 'Nike Air Zoom Pegasus',
      brand: 'Nike',
      category: 'Sneakers',
      price: 130.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e-800x800.png',
      rating: 4,
      color: 'black',
      isFavorite: false
    },
    {
      id: 'PRD-7',
      name: 'Nike Air Zoom Pegasus',
      brand: 'Nike',
      category: 'Sneakers',
      price: 130.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e-800x800.png',
      rating: 4,
      color: 'black',
      isFavorite: false
    },
    {
      id: 'PRD-8',
      name: 'Nike Free Metcon 4',
      brand: 'Nike',
      category: 'Sneakers',
      price: 120.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e-800x800.png',
      rating: 4,
      color: 'green',
      isFavorite: false
    },
    {
      id: 'PRD-9',
      name: 'Nike Waffle One SE',
      brand: 'Nike',
      category: 'Sneakers',
      price: 125.00,
      img: 'https://cdn.sanity.io/images/c1chvb1i/production/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-800x800.png',
      rating: 4,
      color: 'blue',
      isFavorite: false
    }
  ]));
}
window.dashboardApp = function () {
  return {
    openSidebar: false,
    openNavbarSidebar: false,
    openCartSidebar: false, // Sidebar shopping cart
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    selectedPayment: '',
    orderError: '',
    orderSuccess: '',
    get cartBudget() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    },
    toggleCartSidebar() {
      this.openCartSidebar = !this.openCartSidebar;
    },
    addToCart(product) {
      // Animasi 'terbang' ke keranjang
      let productImg = null;
      // Pastikan parameter product selalu valid
      if (!product || !product.img) return;
      // Cari gambar produk yang sedang diklik berdasarkan url img (pakai includes agar robust)
      const productImgs = document.querySelectorAll('img');
      productImgs.forEach(function (img) {
        if (img.src && img.src.includes(product.img)) {
          productImg = img;
        }
      });
      const cartIcon = document.querySelector('button[aria-label="cart"]') || document.querySelector('button.relative');
      if (productImg && cartIcon) {
        const imgRect = productImg.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();
        const clone = productImg.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = imgRect.left + 'px';
        clone.style.top = imgRect.top + 'px';
        clone.style.width = productImg.offsetWidth + 'px';
        clone.style.height = productImg.offsetHeight + 'px';
        clone.style.zIndex = 9999;
        clone.style.transition = 'all 0.7s cubic-bezier(.42,0,.58,1)';
        document.body.appendChild(clone);
        setTimeout(function () {
          clone.style.left = cartRect.left + 'px';
          clone.style.top = cartRect.top + 'px';
          clone.style.width = '32px';
          clone.style.height = '32px';
          clone.style.opacity = '0.5';
        }, 10);
        setTimeout(function () {
          if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
        }, 800);
      }
      const idx = this.cart.findIndex(function (item) { return item.id === product.id; });
      if (idx !== -1) {
        this.cart[idx].qty += 1;
      } else {
        this.cart.push(Object.assign({}, product, { qty: 1 }));
      }
      localStorage.setItem('cart', JSON.stringify(this.cart));
      if (typeof this.notifySuccess === 'function') {
        this.notifySuccess('Produk ditambahkan ke keranjang!');
      } else if (typeof this.showToast === 'function') {
        this.showToast('success', 'Produk ditambahkan ke keranjang!');
      }
    },
    removeFromCart(idx) {
      this.cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    orderCart() {
      this.orderError = '';
      this.orderSuccess = '';
      if (!this.selectedPayment) {
        this.orderError = 'Silakan pilih metode pembayaran.';
        return;
      }
      if (!this.cart.length) {
        this.orderError = 'Keranjang belanja kosong.';
        return;
      }
      // Simulasi proses order (bisa diintegrasikan dengan backend/API jika ada)
      // Di sini hanya clear cart dan tampilkan pesan sukses
      localStorage.removeItem('cart');
      this.cart = [];
      this.orderSuccess = 'Pesanan berhasil! Silakan lanjut pembayaran via ' +
        (this.selectedPayment === 'transfer' ? 'Transfer Bank' : this.selectedPayment === 'ewallet' ? 'E-Wallet' : 'Cash On Delivery') + '.';
      this.selectedPayment = '';
      setTimeout(() => { this.orderSuccess = ''; }, 3000);
    },
    // Brand sorting is handled in filterProducts for clarity
    search: '',
    // Sinkronisasi produk jika localStorage berubah (misal dari super-admin)
    storageListener: null,
    categories: JSON.parse(localStorage.getItem('categories')) || ['Sneakers', 'Sandals', 'Boots', 'Heels'],
    brands: ['All Products'], // Akan diisi ulang secara dinamis dari produk
    priceRanges: [
      { label: '$0 - $50', min: 0, max: 50 },
      { label: '$50 - $100', min: 50, max: 100 },
      { label: '$100 - $150', min: 100, max: 150 },
      { label: '$150 - $200', min: 150, max: 200 }
    ],
    colors: [
      { value: '', class: 'bg-gray-200' },
      { value: 'black', class: 'bg-black' },
      { value: 'red', class: 'bg-red-500' },
      { value: 'blue', class: 'bg-blue-500' },
      { value: 'green', class: 'bg-green-500' },
      { value: 'yellow', class: 'bg-yellow-400' }
    ],
    ratings: [4, 3, 2, 1],
    selectedCategory: 'Sneakers',
    selectedBrand: 'All Products',
    selectedPrice: { label: '$0 - $50', min: 0, max: 50 },
    selectedColor: '',
    selectedRating: 4,
    profileImage: '',
    adminId: '',
    adminName: '',

    // --- INISIALISASI DAN WATCHER ---
    checkLoginRedirect() {
      if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
      }
    },
    init() {
      this.checkLoginRedirect();
      this.applyAccentAndTheme && this.applyAccentAndTheme();
      this.loadProfile && this.loadProfile();
      this.filterProducts && this.filterProducts();
      // Sinkronisasi produk antar tab (super-admin <-> Shoesmu)
      if (!this.storageListener) {
        this.storageListener = (e) => {
          if (e.key === 'products') {
            this.products = JSON.parse(localStorage.getItem('products')) || [];
            this.filterProducts();
          }
          if (e.key === 'brands') {
            this.filterProducts();
          }
        };
        window.addEventListener('storage', this.storageListener);
      }
      // Watch selectedBrand agar filter otomatis
      if (this.$watch) {
        this.$watch('selectedBrand', () => {
          this.filterProducts();
        });
      }
      // Sync cart dari localStorage
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },
    // (SISA ARRAY PRODUK DEFAULT DIHAPUS UNTUK MENGHINDARI ERROR SINTAKS)
    products: JSON.parse(localStorage.getItem('products')) || [
      {
        id: 'PRD-1',
        name: 'Nike Air Force 1 Shadow',
        brand: 'Nike',
        category: 'Sneakers',
        price: 150.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-800x800.png',
        rating: 4,
        color: 'white',
        isFavorite: false
      },
      {
        id: 'PRD-2',
        name: 'Nike Dunk High Retro',
        brand: 'Nike',
        category: 'Sneakers',
        price: 125.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e-800x800.png',
        rating: 4,
        color: 'red',
        isFavorite: false
      },
      {
        id: 'PRD-3',
        name: 'Nike Blazer Mid 77',
        brand: 'Nike',
        category: 'Sneakers',
        price: 105.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e-800x800.png',
        rating: 4,
        color: 'white',
        isFavorite: false
      },
      {
        id: 'PRD-4',
        name: 'Nike Blazer Mid 77',
        brand: 'Nike',
        category: 'Sneakers',
        price: 105.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e4e-800x800.png',
        rating: 4,
        color: 'blue',
        isFavorite: false
      },
      {
        id: 'PRD-5',
        name: 'Nike Air Max 270',
        brand: 'Nike',
        category: 'Sneakers',
        price: 139.97,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e-800x800.png',
        rating: 4,
        color: 'white',
        isFavorite: false
      },
      {
        id: 'PRD-6',
        name: 'Nike Air Zoom Pegasus',
        brand: 'Nike',
        category: 'Sneakers',
        price: 130.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e-800x800.png',
        rating: 4,
        color: 'black',
        isFavorite: false
      },
      {
        id: 'PRD-7',
        name: 'Nike Free Metcon 4',
        brand: 'Nike',
        category: 'Sneakers',
        price: 120.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e-800x800.png',
        rating: 4,
        color: 'green',
        isFavorite: false
      },
      {
        id: 'PRD-8',
        name: 'Nike Waffle One SE',
        brand: 'Nike',
        category: 'Sneakers',
        price: 125.00,
        img: 'https://cdn.sanity.io/images/c1chvb1i/production/8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e-800x800.png',
        rating: 4,
        color: 'blue',
        isFavorite: false
      }
    ],
    filteredProducts: [],
    filterProducts() {
      // Rebuild brands dynamically from current products
      const allBrands = Array.from(new Set(this.products.map(p => p.brand).filter(Boolean)));
      this.brands = ['All Products', ...allBrands];
      // If selectedBrand is no longer available, reset to 'All Products'
      if (!this.brands.includes(this.selectedBrand)) {
        this.selectedBrand = 'All Products';
      }
      let result = this.products.filter(p => {
        // Pastikan price string
        let priceStr = '';
        if (typeof p.price === 'string') {
          priceStr = p.price;
        } else if (typeof p.price === 'number') {
          priceStr = p.price.toString();
        } else {
          // Jika price null/undefined, skip produk ini
          return false;
        }
        let matchCat = this.selectedCategory ? p.category === this.selectedCategory : true;
        let matchBrand = this.selectedBrand && this.selectedBrand !== 'All Products' ? p.brand === this.selectedBrand : true;
        let matchPrice = this.selectedPrice ? (parseFloat(priceStr.replace('$', '')) >= this.selectedPrice.min && parseFloat(priceStr.replace('$', '')) <= this.selectedPrice.max) : true;
        let matchColor = this.selectedColor ? p.color === this.selectedColor : true;
        let matchRating = this.selectedRating ? Math.floor(p.rating) >= this.selectedRating : true;
        let matchSearch = this.search ? p.name.toLowerCase().includes(this.search.toLowerCase()) : true;
        return matchCat && matchBrand && matchPrice && matchColor && matchRating && matchSearch;
      });
      // Always sort alphabetically by name for consistency
      this.filteredProducts = result.sort((a, b) => a.name.localeCompare(b.name));
    },
    toggleFav(id) {
      let prod = this.products.find(p => p.id === id);
      if (prod) prod.fav = !prod.fav;
      this.filterProducts();
    },
    loadMoreCategories() {
      this.categories.push('Slip On', 'Loafers', 'Flat', 'Sport');
    },
    loadProfile() {
      const admin = JSON.parse(localStorage.getItem('admin'));
      if (admin) {
        this.adminId = admin.id || '';
        this.adminName = admin.name || '';
        // Cek profileImage valid base64 atau url
        if (admin.profileImage && typeof admin.profileImage === 'string' && admin.profileImage.trim() !== '' && admin.profileImage.startsWith('data:image/')) {
          this.profileImage = admin.profileImage;
        } else if (admin.profileImage && typeof admin.profileImage === 'string' && admin.profileImage.trim() !== '' && (admin.profileImage.startsWith('http://') || admin.profileImage.startsWith('https://'))) {
          this.profileImage = admin.profileImage;
        } else if (admin.name && admin.name.trim() !== '') {
          // Gunakan ui-avatars.com dengan inisial nama
          this.profileImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.name)}&background=2563eb&color=fff&size=128`;
        } else {
          this.profileImage = 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=128';
        }
      } else {
        this.adminId = '';
        this.adminName = '';
        this.profileImage = 'https://ui-avatars.com/api/?name=Admin&background=2563eb&color=fff&size=128';
      }
      // Pastikan dashboard reload profile setelah kembali dari admin-setting
      window.addEventListener('pageshow', function (e) {
        if (window.location.pathname.endsWith('dashboard.html') && window.dashboardAppInstance && window.dashboardAppInstance.loadProfile) {
          window.dashboardAppInstance.loadProfile();
        }
      });
      // Simpan instance Alpine dashboardApp agar bisa reload profile
      document.addEventListener('alpine:init', () => {
        window.dashboardAppInstance = null;
        Alpine.data('dashboardApp', () => {
          const inst = window.dashboardApp();
          setTimeout(() => { window.dashboardAppInstance = inst; }, 0);
          return inst;
        });
      });
    },
    // --- LOGIN/LOGOUT LOGIC ---
    showLogin: !window.localStorage.getItem('isLoggedIn'),
    loginEmail: '',
    loginPassword: '',
    showLoginPassword: false,
    loginError: '',
    loginDashboard() {
      // Ambil daftar admin dari localStorage
      const admins = JSON.parse(localStorage.getItem('admins')) || [];
      const found = admins.find(a => a.email === this.loginEmail && a.password === this.loginPassword);
      if (found) {
        // Simpan info login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('admin', JSON.stringify(found));
        this.adminId = found.id || '';
        this.adminName = found.name || '';
        this.profileImage = found.profileImage || '';
        this.showLogin = false;
        this.loginError = '';
        this.loadProfile();
        this.filterProducts();
        this.notifySuccess('Login berhasil!');
      } else {
        this.loginError = 'Email atau password salah!';
        this.notifyError('Email atau password salah!');
      }
    },
    logoutDashboard() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('admin');
      this.showLogin = true;
      this.loginEmail = '';
      this.loginPassword = '';
      this.adminId = '';
      this.adminName = '';
      this.profileImage = '';
      this.notifyInfo('Anda telah logout.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 600);
    },
    init() {
      this.applyAccentAndTheme && this.applyAccentAndTheme();
      this.loadProfile && this.loadProfile();
      this.filterProducts && this.filterProducts();
      // Cek status login
      this.showLogin = !window.localStorage.getItem('isLoggedIn');
      if (!this.showLogin) {
        this.loadProfile();
      }
      // Sinkronisasi produk antar tab (super-admin <-> Shoesmu)
      if (!this.storageListener) {
        this.storageListener = (e) => {
          if (e.key === 'products') {
            this.products = JSON.parse(localStorage.getItem('products')) || [];
            this.filterProducts();
          }
          if (e.key === 'brands') {
            // Optional: if brands are managed separately
            this.filterProducts();
          }
        };
        window.addEventListener('storage', this.storageListener);
      }
    },
    // CRUD produk dari Shoesmu juga update dan filter otomatis
    addProduct() {
      if (!this.productForm.name || !this.productForm.brand || !this.productForm.category || !this.productForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      this.showLoadingSpinner(true);
      setTimeout(() => {
        this.productForm.id = 'PRD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        this.products.push({ ...this.productForm });
        localStorage.setItem('products', JSON.stringify(this.products));
        this.closeProductModal();
        this.filterProducts();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Produk berhasil ditambahkan!');
        this.logActivity && this.logActivity('add-product', this.productForm.name);
      }, 700);
    },
    updateProduct() {
      if (!this.productForm.name || !this.productForm.brand || !this.productForm.category || !this.productForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      const id = this.productForm.id;
      const realIdx = this.products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.showLoadingSpinner(true);
        setTimeout(() => {
          this.products[realIdx] = { ...this.productForm };
          localStorage.setItem('products', JSON.stringify(this.products));
          this.closeProductModal();
          this.filterProducts();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Produk berhasil diupdate!');
          this.logActivity && this.logActivity('update-product', this.productForm.name);
        }, 700);
      }
    },
    deleteProduct(idx) {
      const id = this.filteredProducts[idx].id;
      const realIdx = this.products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.confirm('Yakin ingin menghapus produk ini?', () => {
          this.showLoadingSpinner(true);
          setTimeout(() => {
            this.products.splice(realIdx, 1);
            localStorage.setItem('products', JSON.stringify(this.products));
            this.filterProducts();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Produk dihapus!');
            this.logActivity && this.logActivity('delete-product', id);
          }, 700);
        });
      }
    },
    // Hapus event listener saat Alpine instance di-destroy (opsional, best practice)
    destroy() {
      if (this.storageListener) {
        window.removeEventListener('storage', this.storageListener);
        this.storageListener = null;
      }
    },
  }
}

// Alpine.js component untuk edit profil super-admin (khusus dashboard super-admin)
window.editProfileSuperAdmin = function () {
  return {
    profile: {
      name: '',
      email: '',
      password: '',
      profileImage: ''
    },
    success: false,
    init() {
      const superAdmin = JSON.parse(localStorage.getItem('superadmin'));
      if (superAdmin) {
        this.profile = { ...superAdmin };
      }
    },
    updateImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.profile.profileImage = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    saveProfile() {
      localStorage.setItem('superadmin', JSON.stringify(this.profile));
      this.success = true;
      setTimeout(() => { this.success = false; }, 2000);
    }
  }
}

// Middleware: Cek login superadmin di dashboard super-admin.html
if (window.location.pathname.endsWith('super-admin.html')) {
  if (localStorage.getItem('superadmin_logged_in') !== 'true') {
    window.location.href = 'login-super-admin.html';
  }
}
// Alpine.js untuk super-admin.html
// Chart.js CDN inject jika belum ada
if (!window.Chart) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
  document.head.appendChild(script);
}
// Event bus sederhana untuk notifikasi, spinner, dsb
window.dashboardBus = {
  listeners: {},
  on(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  },
  emit(event, payload) {
    (this.listeners[event] || []).forEach(cb => cb(payload));
  }
};

window.superAdminDashboard = function () {
  return {
    // Shoesmu Admins & Products (global management)
    shoesmuAdmins: JSON.parse(localStorage.getItem('admins')) || [],
    shoesmuProducts: JSON.parse(localStorage.getItem('products')) || [],
    shoesmuAdminForm: { email: '', name: '', password: '' },
    shoesmuProductForm: { id: '', name: '', brand: '', category: '', price: '', img: '' },
    showAddShoesmuAdmin: false,
    showEditShoesmuAdmin: false,
    editShoesmuAdminIdx: null,
    showAddShoesmuProduct: false,
    showEditShoesmuProduct: false,
    editShoesmuProductIdx: null,
    // CRUD for Shoesmu Admins
    addShoesmuAdmin() {
      if (!this.shoesmuAdminForm.email || !this.shoesmuAdminForm.name || !this.shoesmuAdminForm.password) return this.showToast('error', 'Semua field wajib diisi!');
      if (this.shoesmuAdmins.some(a => a.email === this.shoesmuAdminForm.email)) return this.showToast('error', 'Email sudah terdaftar!');
      this.shoesmuAdmins.push({ ...this.shoesmuAdminForm });
      localStorage.setItem('admins', JSON.stringify(this.shoesmuAdmins));
      this.shoesmuAdminForm = { email: '', name: '', password: '' };
      this.showAddShoesmuAdmin = false;
      this.showToast('success', 'Admin Shoesmu berhasil ditambahkan!');
    },
    editShoesmuAdmin(idx) {
      this.editShoesmuAdminIdx = idx;
      this.shoesmuAdminForm = { ...this.shoesmuAdmins[idx] };
      this.showEditShoesmuAdmin = true;
    },
    updateShoesmuAdmin() {
      if (!this.shoesmuAdminForm.name || !this.shoesmuAdminForm.password) return this.showToast('error', 'Nama dan password wajib diisi!');
      const email = this.shoesmuAdminForm.email;
      const realIdx = this.shoesmuAdmins.findIndex(a => a.email === email);
      if (realIdx !== -1) {
        this.shoesmuAdmins[realIdx] = { ...this.shoesmuAdminForm };
        localStorage.setItem('admins', JSON.stringify(this.shoesmuAdmins));
        this.showEditShoesmuAdmin = false;
        this.shoesmuAdminForm = { email: '', name: '', password: '' };
        this.showToast('success', 'Admin Shoesmu berhasil diupdate!');
      }
    },
    deleteShoesmuAdmin(idx) {
      const email = this.shoesmuAdmins[idx].email;
      this.shoesmuAdmins.splice(idx, 1);
      localStorage.setItem('admins', JSON.stringify(this.shoesmuAdmins));
      this.showToast('success', 'Admin Shoesmu dihapus!');
    },
    // CRUD for Shoesmu Products
    addShoesmuProduct() {
      if (!this.shoesmuProductForm.name || !this.shoesmuProductForm.brand || !this.shoesmuProductForm.category || !this.shoesmuProductForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      this.shoesmuProductForm.id = 'PRD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      this.shoesmuProducts.push({ ...this.shoesmuProductForm });
      localStorage.setItem('products', JSON.stringify(this.shoesmuProducts));
      this.shoesmuProductForm = { id: '', name: '', brand: '', category: '', price: '', img: '' };
      this.showAddShoesmuProduct = false;
      this.showToast('success', 'Produk Shoesmu berhasil ditambahkan!');
    },
    editShoesmuProduct(idx) {
      this.editShoesmuProductIdx = idx;
      this.shoesmuProductForm = { ...this.shoesmuProducts[idx] };
      this.showEditShoesmuProduct = true;
    },
    updateShoesmuProduct() {
      if (!this.shoesmuProductForm.name || !this.shoesmuProductForm.brand || !this.shoesmuProductForm.category || !this.shoesmuProductForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      const id = this.shoesmuProductForm.id;
      const realIdx = this.shoesmuProducts.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.shoesmuProducts[realIdx] = { ...this.shoesmuProductForm };
        localStorage.setItem('products', JSON.stringify(this.shoesmuProducts));
        this.showEditShoesmuProduct = false;
        this.shoesmuProductForm = { id: '', name: '', brand: '', category: '', price: '', img: '' };
        this.showToast('success', 'Produk Shoesmu berhasil diupdate!');
      }
    },
    deleteShoesmuProduct(idx) {
      const id = this.shoesmuProducts[idx].id;
      this.shoesmuProducts.splice(idx, 1);
      localStorage.setItem('products', JSON.stringify(this.shoesmuProducts));
      this.showToast('success', 'Produk Shoesmu dihapus!');
    },
    // Accent color options for color picker
    accentColors: [
      '#2563eb', // blue
      '#f59e42', // orange
      '#10b981', // green
      '#ef4444', // red
      '#a21caf', // purple
      '#fbbf24', // yellow
      '#0ea5e9', // sky
      '#6366f1', // indigo
      '#14b8a6', // teal
    ],
    // Profile info for topbar
    get profileImage() {
      const superAdmin = JSON.parse(localStorage.getItem('superadmin'));
      return (superAdmin && superAdmin.profileImage) ? superAdmin.profileImage : 'https://ui-avatars.com/api/?name=Admin';
    },
    get adminName() {
      const superAdmin = JSON.parse(localStorage.getItem('superadmin'));
      return (superAdmin && superAdmin.name) ? superAdmin.name : 'Super Admin';
    },
    // State utama UI
    tab: 'admins',
    showAddModal: false,
    showEditModal: false,
    showAddProduct: false,
    showEditProduct: false,
    showAddBrand: false,
    showEditBrand: false,
    productView: 'table',
    toast: { show: false, type: '', message: '' },
    showSpinner: false,
    confirmConfig: { message: '', onConfirm: null },
    // Data form
    form: { email: '', name: '', password: '' },
    productForm: { id: '', name: '', brand: '', category: '', price: '', img: '' },
    brandForm: '',
    activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
    // Data filter hasil
    filteredAdmins: [],
    filteredProducts: [],
    filteredBrands: [],
    // --- GLOBAL UI STATE ---
    get adminProfile() {
      // Selalu ambil data admin terbaru dari localStorage
      return JSON.parse(localStorage.getItem('admin')) || { name: '', email: '', profileImage: '' };
    },
    // Untuk binding: gunakan adminProfile.name, adminProfile.profileImage, dst
    sidebarCollapsed: JSON.parse(localStorage.getItem('sidebarCollapsed')) || false,
    // Toggle sidebar collapse/expand
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    },
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || '#2563eb', // default Tailwind blue-600
    // Multi-language support
    lang: localStorage.getItem('lang') || 'id',
    translations: {
      id: {
        dashboard: 'Super Admin Dashboard',
        mainColor: 'Warna Utama:',
        theme: 'Tema:',
        language: 'Bahasa:',
        admins: 'Kelola Admin/User',
        products: 'Kelola Produk',
        brands: 'Kelola Brand',
        stats: 'Statistik',
        add: 'Tambah',
        export: 'Export',
        import: 'Import',
        search: 'Cari',
        reset: 'Reset',
        totalAdmin: 'Total Admin',
        totalProduct: 'Total Produk',
        totalBrand: 'Total Brand',
        productBrandChart: 'Grafik Produk per Brand',
        kembali: 'Kembali ke Dashboard',
        cardView: 'Card View',
        tableView: 'Table View',
        aksi: 'Aksi',
        nama: 'Nama',
        email: 'Email',
        password: 'Password',
        batal: 'Batal',
        simpan: 'Simpan',
        edit: 'Edit',
        hapus: 'Hapus',
        konfirmasi: 'Konfirmasi',
        yaLanjutkan: 'Ya, Lanjutkan',
        waktu: 'Waktu',
        detail: 'Detail',
        belumAdaAktivitas: 'Belum ada aktivitas.'
      },
      en: {
        dashboard: 'Super Admin Dashboard',
        mainColor: 'Main Color:',
        theme: 'Theme:',
        language: 'Language:',
        admins: 'Manage Admin/User',
        products: 'Manage Products',
        brands: 'Manage Brands',
        stats: 'Statistics',
        add: 'Add',
        export: 'Export',
        import: 'Import',
        search: 'Search',
        reset: 'Reset',
        totalAdmin: 'Total Admin',
        totalProduct: 'Total Product',
        totalBrand: 'Total Brand',
        productBrandChart: 'Product per Brand Chart',
        kembali: 'Back to Dashboard',
        cardView: 'Card View',
        tableView: 'Table View',
        aksi: 'Action',
        nama: 'Name',
        email: 'Email',
        password: 'Password',
        batal: 'Cancel',
        simpan: 'Save',
        edit: 'Edit',
        hapus: 'Delete',
        konfirmasi: 'Confirmation',
        yaLanjutkan: 'Yes, Continue',
        waktu: 'Time',
        detail: 'Detail',
        belumAdaAktivitas: 'No activity yet.'
      }
    },
    t(key) {
      return this.translations[this.lang] && this.translations[this.lang][key] ? this.translations[this.lang][key] : key;
    },
    switchLanguage(lang) {
      this.lang = lang;
      localStorage.setItem('lang', lang);
      this.updateTexts && this.updateTexts();
    },
    updateTexts() {
      // Force Alpine to update all x-text="t('key')" bindings
      this.$nextTick(() => { });
    },
    // Data utama
    admins: JSON.parse(localStorage.getItem('admins')) || [],
    products: JSON.parse(localStorage.getItem('products')) || [],
    brands: JSON.parse(localStorage.getItem('brands')) || ['Nike', 'Adidas', 'Puma', 'Vans', 'Reebook', 'Converse', 'New Balance'],
    // Search/filter
    searchAdmin: '',
    searchAdminCol: 'all',
    searchProduct: '',
    searchProductCol: 'all',
    searchBrand: '',
    produkBrandChart: null,
    adminPage: 1,
    adminPerPage: 10,
    productPage: 1,
    productPerPage: 10,
    brandPage: 1,
    brandPerPage: 10,
    $watchTab() {
      this.$watch('tab', (val) => {
        if (val === 'stats') {
          this.$nextTick(() => this.renderProdukBrandChart());
        }
      });
    },
    renderProdukBrandChart() {
      if (!window.Chart || !document.getElementById('produkBrandChart')) return;
      if (this.produkBrandChart) this.produkBrandChart.destroy();
      const brandLabels = this.brands;
      const produkCounts = brandLabels.map(b => this.products.filter(p => p.brand === b).length);
      this.produkBrandChart = new Chart(document.getElementById('produkBrandChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: brandLabels,
          datasets: [{
            label: 'Jumlah Produk',
            data: produkCounts,
            backgroundColor: this.accentColor,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false }
          }
        }
      });
    },
    brandTotalPages() {
      return Math.ceil(this.filteredBrands.length / this.brandPerPage) || 1;
    },
    showConfirm: false,
    setAccentColor(color) {
      this.accentColor = color;
      localStorage.setItem('accentColor', color);
      document.documentElement.style.setProperty('--accent', color);
      // Update warna utama Tailwind (opsional, jika pakai CSS var)
      document.documentElement.style.setProperty('--tw-prose-links', color);
    },

    // Theme switcher (light/dark)
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-900');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
      }
    },

    // Terapkan accent dan theme saat init
    applyAccentAndTheme() {
      document.documentElement.style.setProperty('--accent', this.accentColor);
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-gray-900');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-gray-900');
      }
    },
    showLoadingSpinner(show = true) {
      this.showSpinner = show;
      if (show) {
        // Auto hide spinner jika loading terlalu lama (fallback)
        setTimeout(() => { this.showSpinner = false; }, 10000);
      }
    },
    // Notifikasi toast dinamis
    showToast(type, message) {
      this.toast = { show: true, type, message };
      // Jika ada toast sebelumnya, clear timeout
      if (this._toastTimeout) clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => { this.toast.show = false; }, 2500);
    },

    // Helper untuk notifikasi sukses, error, info, warning
    notifySuccess(msg) { this.showToast('success', msg); },
    notifyError(msg) { this.showToast('error', msg); },
    notifyInfo(msg) { this.showToast('info', msg); },
    notifyWarning(msg) { this.showToast('warning', msg); },
    confirm(message, onConfirm) {
      this.confirmConfig = { message, onConfirm };
      this.showConfirm = true;
    },
    doConfirm() {
      if (typeof this.confirmConfig.onConfirm === 'function') this.confirmConfig.onConfirm();
      this.showConfirm = false;
    },
    cancelConfirm() {
      this.showConfirm = false;
    },
    logActivity(action, detail) {
      const entry = { time: new Date().toISOString(), action, detail };
      this.activityLog.unshift(entry);
      if (this.activityLog.length > 100) this.activityLog.pop();
      localStorage.setItem('activityLog', JSON.stringify(this.activityLog));
    },

    refresh() {
      this.updateProdukBrandChart();
      this.logActivity('refresh', 'Data di-refresh');
      this.admins = JSON.parse(localStorage.getItem('admins')) || [];
      this.products = JSON.parse(localStorage.getItem('products')) || [];
      this.brands = JSON.parse(localStorage.getItem('brands')) || ['Nike', 'Adidas', 'Puma', 'Vans', 'Reebook', 'Converse', 'New Balance'];
      this.filterAll();
    },
    // Statistik & Grafik Produk per Brand
    updateProdukBrandChart() {
      setTimeout(() => {
        if (!window.Chart || !document.getElementById('produkBrandChart')) return;
        const ctx = document.getElementById('produkBrandChart').getContext('2d');
        // Hitung jumlah produk per brand
        const brandCount = {};
        this.products.forEach(p => {
          brandCount[p.brand] = (brandCount[p.brand] || 0) + 1;
        });
        const labels = Object.keys(brandCount);
        const data = Object.values(brandCount);
        if (window._produkBrandChart) window._produkBrandChart.destroy();
        window._produkBrandChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Jumlah Produk',
              data,
              backgroundColor: '#2563eb',
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, precision: 0 } }
          }
        });
      }, 300);
    },
    filterAll() {
      // Admin
      this.filteredAdmins = this.admins.filter(a => {
        if (!this.searchAdmin) return true;
        if (this.searchAdminCol === 'all') {
          return (
            (a.email && a.email.toLowerCase().includes(this.searchAdmin.toLowerCase())) ||
            (a.name && a.name.toLowerCase().includes(this.searchAdmin.toLowerCase()))
          );
        } else if (this.searchAdminCol === 'email') {
          return a.email && a.email.toLowerCase().includes(this.searchAdmin.toLowerCase());
        } else if (this.searchAdminCol === 'name') {
          return a.name && a.name.toLowerCase().includes(this.searchAdmin.toLowerCase());
        }
        return true;
      });
      this.adminPage = 1;
      this.filteredProducts = this.products.filter(p => {
        if (!this.searchProduct) return true;
        if (this.searchProductCol === 'all') {
          return (
            (p.name && p.name.toLowerCase().includes(this.searchProduct.toLowerCase())) ||
            (p.brand && p.brand.toLowerCase().includes(this.searchProduct.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(this.searchProduct.toLowerCase()))
          );
        } else if (this.searchProductCol === 'name') {
          return p.name && p.name.toLowerCase().includes(this.searchProduct.toLowerCase());
        } else if (this.searchProductCol === 'brand') {
          return p.brand && p.brand.toLowerCase().includes(this.searchProduct.toLowerCase());
        } else if (this.searchProductCol === 'category') {
          return p.category && p.category.toLowerCase().includes(this.searchProduct.toLowerCase());
        }
        return true;
      });
      this.productPage = 1;
      this.filteredBrands = this.brands.filter(b => b && b.toLowerCase().includes(this.searchBrand.toLowerCase()));
      this.brandPage = 1;
    },
    // Pagination helpers
    pagedAdmins() {
      const start = (this.adminPage - 1) * this.adminPerPage;
      return this.filteredAdmins.slice(start, start + this.adminPerPage);
    },
    adminTotalPages() {
      return Math.ceil(this.filteredAdmins.length / this.adminPerPage) || 1;
    },
    pagedProducts() {
      const start = (this.productPage - 1) * this.productPerPage;
      return this.filteredProducts.slice(start, start + this.productPerPage);
    },
    productTotalPages() {
      return Math.ceil(this.filteredProducts.length / this.productPerPage) || 1;
    },
    pagedBrands() {
      const start = (this.brandPage - 1) * this.brandPerPage;
      return this.filteredBrands.slice(start, start + this.brandPerPage);
    },
    brandTotalPages() {
      return Math.ceil(this.filteredBrands.length / this.brandPerPage) || 1;
    },
    setAdminPage(p) { this.adminPage = p; },
    setProductPage(p) { this.productPage = p; },
    setBrandPage(p) { this.brandPage = p; },
    // Reset filter
    resetAdminFilter() {
      this.searchAdmin = '';
      this.searchAdminCol = 'all';
      this.filterAll();
    },
    resetProductFilter() {
      this.searchProduct = '';
      this.searchProductCol = 'all';
      this.filterAll();
    },
    resetBrandFilter() {
      this.searchBrand = '';
      this.filterAll();
    },
    // Export/Import Data
    exportData(type) {
      let data = [];
      let filename = '';
      if (type === 'admins') {
        data = this.admins;
        filename = 'admins-export.json';
      } else if (type === 'products') {
        data = this.products;
        filename = 'products-export.json';
      } else if (type === 'brands') {
        data = this.brands;
        filename = 'brands-export.json';
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showToast('success', 'Data berhasil diekspor!');
      this.logActivity('export', type);
    },
    importData(e, type) {
      const file = e.target.files[0];
      if (!file) return;
      this.showLoadingSpinner(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (!Array.isArray(imported)) throw new Error('Format file tidak valid!');
          if (type === 'admins') {
            this.admins = imported;
            localStorage.setItem('admins', JSON.stringify(this.admins));
          } else if (type === 'products') {
            this.products = imported;
            localStorage.setItem('products', JSON.stringify(this.products));
          } else if (type === 'brands') {
            this.brands = imported;
            localStorage.setItem('brands', JSON.stringify(this.brands));
          }
          this.refresh();
          this.showToast('success', 'Data berhasil diimpor!');
          this.logActivity('import', type);
        } catch (err) {
          this.showToast('error', 'Gagal impor: ' + err.message);
        }
        this.showLoadingSpinner(false);
        e.target.value = '';
      };
      reader.readAsText(file);
    },
    // Admin CRUD
    closeModal() {
      this.showAddModal = false;
      this.showEditModal = false;
      this.form = { email: '', name: '', password: '' };
      this.editIdx = null;
    },
    addAdmin() {
      if (!this.form.email || !this.form.name || !this.form.password) return this.showToast('error', 'Semua field wajib diisi!');
      if (this.admins.some(a => a.email === this.form.email)) return this.showToast('error', 'Email sudah terdaftar!');
      this.showLoadingSpinner(true);
      setTimeout(() => {
        this.admins.push({ ...this.form });
        localStorage.setItem('admins', JSON.stringify(this.admins));
        this.closeModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Admin berhasil ditambahkan!');
        this.logActivity('add-admin', this.form.email);
      }, 700);
    },
    editAdmin(idx) {
      this.editIdx = idx;
      this.form = { ...this.filteredAdmins[idx] };
      this.showEditModal = true;
    },
    updateAdmin() {
      if (!this.form.name || !this.form.password) return this.showToast('error', 'Nama dan password wajib diisi!');
      const email = this.form.email;
      const realIdx = this.admins.findIndex(a => a.email === email);
      if (realIdx !== -1) {
        this.showLoadingSpinner(true);
        setTimeout(() => {
          this.admins[realIdx] = { ...this.form };
          localStorage.setItem('admins', JSON.stringify(this.admins));
          this.closeModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Admin berhasil diupdate!');
          this.logActivity('update-admin', email);
        }, 700);
      }
    },
    deleteAdmin(idx) {
      const email = this.filteredAdmins[idx].email;
      const realIdx = this.admins.findIndex(a => a.email === email);
      if (realIdx !== -1) {
        this.confirm('Yakin ingin menghapus admin ini?', () => {
          this.showLoadingSpinner(true);
          setTimeout(() => {
            this.admins.splice(realIdx, 1);
            localStorage.setItem('admins', JSON.stringify(this.admins));
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Admin dihapus!');
            this.logActivity('delete-admin', email);
          }, 700);
        });
      }
    },
    // Product CRUD
    handleProductImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.productForm.img = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    handleProductDrop(e) {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        this.productForm.img = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    closeProductModal() {
      this.showAddProduct = false;
      this.showEditProduct = false;
      this.productForm = { id: '', name: '', brand: '', category: '', price: '', img: '' };
      this.editProductIdx = null;
    },
    addProduct() {
      if (!this.productForm.name || !this.productForm.brand || !this.productForm.category || !this.productForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      this.showLoadingSpinner(true);
      setTimeout(() => {
        this.productForm.id = 'PRD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        this.products.push({ ...this.productForm });
        localStorage.setItem('products', JSON.stringify(this.products));
        this.closeProductModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Produk berhasil ditambahkan!');
        this.logActivity('add-product', this.productForm.name);
      }, 700);
    },
    editProduct(idx) {
      this.editProductIdx = idx;
      this.productForm = { ...this.filteredProducts[idx] };
      this.showEditProduct = true;
    },
    updateProduct() {
      if (!this.productForm.name || !this.productForm.brand || !this.productForm.category || !this.productForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      const id = this.productForm.id;
      const realIdx = this.products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.showLoadingSpinner(true);
        setTimeout(() => {
          this.products[realIdx] = { ...this.productForm };
          localStorage.setItem('products', JSON.stringify(this.products));
          this.closeProductModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Produk berhasil diupdate!');
          this.logActivity('update-product', this.productForm.name);
        }, 700);
      }
    },
    deleteProduct(idx) {
      const id = this.filteredProducts[idx].id;
      const realIdx = this.products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.confirm('Yakin ingin menghapus produk ini?', () => {
          this.showLoadingSpinner(true);
          setTimeout(() => {
            this.products.splice(realIdx, 1);
            localStorage.setItem('products', JSON.stringify(this.products));
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Produk dihapus!');
            this.logActivity('delete-product', id);
          }, 700);
        });
      }
    },
    // Brand CRUD
    closeBrandModal() {
      this.showAddBrand = false;
      this.showEditBrand = false;
      this.brandForm = '';
      this.editBrandIdx = null;
    },
    addBrand() {
      if (!this.brandForm) return this.showToast('error', 'Nama brand wajib diisi!');
      if (this.brands.includes(this.brandForm)) return this.showToast('error', 'Brand sudah ada!');
      this.showLoadingSpinner(true);
      setTimeout(() => {
        this.brands.push(this.brandForm);
        localStorage.setItem('brands', JSON.stringify(this.brands));
        this.closeBrandModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Brand berhasil ditambahkan!');
        this.logActivity('add-brand', this.brandForm);
      }, 700);
    },
    editBrand(idx) {
      this.editBrandIdx = idx;
      this.brandForm = this.filteredBrands[idx];
      this.showEditBrand = true;
    },
    updateBrand() {
      if (!this.brandForm) return this.showToast('error', 'Nama brand wajib diisi!');
      const name = this.filteredBrands[this.editBrandIdx];
      const realIdx = this.brands.findIndex(b => b === name);
      if (realIdx !== -1) {
        this.showLoadingSpinner(true);
        setTimeout(() => {
          this.brands[realIdx] = this.brandForm;
          localStorage.setItem('brands', JSON.stringify(this.brands));
          this.closeBrandModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Brand berhasil diupdate!');
          this.logActivity('update-brand', this.brandForm);
        }, 700);
      }
    },
    deleteBrand(idx) {
      const name = this.filteredBrands[idx];
      const realIdx = this.brands.findIndex(b => b === name);
      if (realIdx !== -1) {
        this.confirm('Yakin ingin menghapus brand ini?', () => {
          this.showLoadingSpinner(true);
          setTimeout(() => {
            this.brands.splice(realIdx, 1);
            localStorage.setItem('brands', JSON.stringify(this.brands));
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Brand dihapus!');
            this.logActivity('delete-brand', name);
          }, 700);
        });
      }
    },
    // Watchers for search
    // (hapus duplikasi init di bawah, sudah digabung di atas)
  }
}
// Alpine.js global integration for dashboard
if (typeof window.Alpine === 'undefined') {
  // Optionally, you could import Alpine here if not loaded by CDN
  // But since CDN is used, just ensure dashboardApp is global
}
// Tampilkan link super admin jika user super admin
window.addEventListener('DOMContentLoaded', function () {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (admin && admin.email === 'superadmin@shoesmu.com') {
    const nav = document.querySelector('#super-admin-link');
    if (nav) nav.style.display = 'block';
  }
});

