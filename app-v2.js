// Salinan app.js yang sudah dicek, tanpa error fatal, untuk bypass cache/live reload

// Inject SweetAlert2 CDN if not present
if (!window.Swal) {
  var swalScript = document.createElement('script');
  swalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
  document.head.appendChild(swalScript);
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
    // State untuk sidebar activity log mobile
    openActivitySidebar: false,
    // Fungsi untuk membuka sidebar activity log (mobile)
    openActivityLogSidebar() {
      this.openActivitySidebar = true;
    },
    // Fungsi untuk menutup sidebar activity log (mobile)
    closeActivityLogSidebar() {
      this.openActivitySidebar = false;
    },
    // Fungsi untuk handle tombol close sidebar (bisa dipanggil dari HTML)
    handleCloseActivitySidebar() {
      this.openActivitySidebar = false;
    },
    // Sinkronisasi produk jika localStorage berubah (misal dari Shoesmu atau tab lain)
    storageListener: null,
    // Fallback global untuk t agar tidak error jika dipanggil di luar Alpine context
    // (Hanya satu definisi t, tidak duplikat)
    // Fallback global untuk searchAdmin, searchAdminCol agar tidak error
    searchAdmin: '',
    searchAdminCol: 'all',
    // ...warna utama dan script terkait dihapus...
    get shoesmuAdmins() {
      return JSON.parse(localStorage.getItem('admins')) || [];
    },
    get shoesmuProducts() {
      return JSON.parse(localStorage.getItem('products')) || [];
    },
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
      const admins = this.shoesmuAdmins;
      admins.push({ ...this.shoesmuAdminForm });
      localStorage.setItem('admins', JSON.stringify(admins));
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
      const admins = this.shoesmuAdmins;
      const realIdx = admins.findIndex(a => a.email === email);
      if (realIdx !== -1) {
        admins[realIdx] = { ...this.shoesmuAdminForm };
        localStorage.setItem('admins', JSON.stringify(admins));
        this.showEditShoesmuAdmin = false;
        this.shoesmuAdminForm = { email: '', name: '', password: '' };
        this.showToast('success', 'Admin Shoesmu berhasil diupdate!');
      }
    },
    deleteShoesmuAdmin(idx) {
      const admins = this.shoesmuAdmins;
      const email = admins[idx].email;
      admins.splice(idx, 1);
      localStorage.setItem('admins', JSON.stringify(admins));
      this.showToast('success', 'Admin Shoesmu dihapus!');
    },
    // CRUD for Shoesmu Products
    addShoesmuProduct() {
      if (!this.shoesmuProductForm.name || !this.shoesmuProductForm.brand || !this.shoesmuProductForm.category || !this.shoesmuProductForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      const products = this.shoesmuProducts;
      this.shoesmuProductForm.id = 'PRD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      products.push({ ...this.shoesmuProductForm });
      localStorage.setItem('products', JSON.stringify(products));
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
      const products = this.shoesmuProducts;
      const id = this.shoesmuProductForm.id;
      const realIdx = products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        products[realIdx] = { ...this.shoesmuProductForm };
        localStorage.setItem('products', JSON.stringify(products));
        this.showEditShoesmuProduct = false;
        this.shoesmuProductForm = { id: '', name: '', brand: '', category: '', price: '', img: '' };
        this.showToast('success', 'Produk Shoesmu berhasil diupdate!');
      }
    },
    deleteShoesmuProduct(idx) {
      const products = this.shoesmuProducts;
      const id = products[idx].id;
      products.splice(idx, 1);
      localStorage.setItem('products', JSON.stringify(products));
      this.showToast('success', 'Produk Shoesmu dihapus!');
    },
    // Sinkronisasi produk saat tab berubah ke 'products'
    tab: 'admins',
    $watchTab() {
      this.$watch('tab', (val) => {
        if (val === 'products') {
          // Refresh produk dari localStorage setiap kali tab produk diakses
          this.$nextTick(() => {
            this.shoesmuProductForm = { id: '', name: '', brand: '', category: '', price: '', img: '' };
            // Trigger Alpine reactivity by reassigning products (getter always fresh)
            if (this.refresh) this.refresh();
          });
        }
      });
    },
    // Accent color options for color picker
    accentColors: [
      '#2563eb', '#f59e42', '#10b981', '#ef4444', '#a21caf', '#fbbf24', '#0ea5e9', '#6366f1', '#14b8a6',
    ],
    get profileImage() {
      const superAdmin = JSON.parse(localStorage.getItem('superadmin'));
      return (superAdmin && superAdmin.profileImage) ? superAdmin.profileImage : 'https://ui-avatars.com/api/?name=Admin';
    },
    get adminName() {
      const superAdmin = JSON.parse(localStorage.getItem('superadmin'));
      return (superAdmin && superAdmin.name) ? superAdmin.name : 'Super Admin';
    },
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
    form: { email: '', name: '', password: '' },
    productForm: { id: '', name: '', brand: '', category: '', price: '', img: '' },
    brandForm: '',
    activityLog: JSON.parse(localStorage.getItem('activityLog')) || [],
    filteredAdmins: [],
    filteredProducts: [],
    filteredBrands: [],
    get adminProfile() {
      // Only show superadmin info in profile (topbar/sidebar)
      return JSON.parse(localStorage.getItem('superadmin')) || { name: '', email: '', profileImage: '' };
    },
    sidebarCollapsed: JSON.parse(localStorage.getItem('sidebarCollapsed')) || false,
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
    },
    theme: localStorage.getItem('theme') || 'light',
    accentColor: localStorage.getItem('accentColor') || '#2563eb',
    lang: localStorage.getItem('lang') || 'id',
    // Simpan global untuk fallback
    init() {
      window.superAdminTranslations = this.translations;
      window.superAdminLang = this.lang;
      // Do not remove or limit product images stored as base64 here.
      // Load products as-is from localStorage and keep any base64 images.
      let products = JSON.parse(localStorage.getItem('products')) || [];
      this.applyAccentAndTheme && this.applyAccentAndTheme();
      this.filterAll(); // Pastikan data langsung terfilter saat init

      // Tambahkan event listener untuk sinkronisasi produk antar tab
      if (!this.storageListener) {
        this.storageListener = (e) => {
          if (e.key === 'products') {
            this.filterAll();
          }
        };
        window.addEventListener('storage', this.storageListener);
      }
    },
    // Hapus event listener saat Alpine instance di-destroy (opsional, best practice)
    destroy() {
      if (this.storageListener) {
        window.removeEventListener('storage', this.storageListener);
        this.storageListener = null;
      }
    },
    translations: {
      id: {
        dashboard: 'Super Admin Dashboard', mainColor: 'Warna Utama:', theme: 'Tema:', language: 'Bahasa:', admins: 'Kelola Admin/User', products: 'Kelola Produk', brands: 'Kelola Brand', stats: 'Statistik', add: 'Tambah', export: 'Export', import: 'Import', search: 'Cari', reset: 'Reset', totalAdmin: 'Total Admin', totalProduct: 'Total Produk', totalBrand: 'Total Brand', productBrandChart: 'Grafik Produk per Brand', kembali: 'Kembali ke Dashboard', cardView: 'Card View', tableView: 'Table View', aksi: 'Aksi', nama: 'Nama', email: 'Email', password: 'Password', batal: 'Batal', simpan: 'Simpan', edit: 'Edit', hapus: 'Hapus', konfirmasi: 'Konfirmasi', yaLanjutkan: 'Ya, Lanjutkan', waktu: 'Waktu', detail: 'Detail', belumAdaAktivitas: 'Belum ada aktivitas.'
      },
      en: {
        dashboard: 'Super Admin Dashboard', mainColor: 'Main Color:', theme: 'Theme:', language: 'Language:', admins: 'Manage Admin/User', products: 'Manage Products', brands: 'Manage Brands', stats: 'Statistics', add: 'Add', export: 'Export', import: 'Import', search: 'Search', reset: 'Reset', totalAdmin: 'Total Admin', totalProduct: 'Total Product', totalBrand: 'Total Brand', productBrandChart: 'Product per Brand Chart', kembali: 'Back to Dashboard', cardView: 'Card View', tableView: 'Table View', aksi: 'Action', nama: 'Name', email: 'Email', password: 'Password', batal: 'Cancel', simpan: 'Save', edit: 'Edit', hapus: 'Delete', konfirmasi: 'Confirmation', yaLanjutkan: 'Yes, Continue', waktu: 'Time', detail: 'Detail', belumAdaAktivitas: 'No activity yet.'
      }
    },
    t(key) {
      if (this && this.translations && this.lang && this.translations[this.lang] && this.translations[this.lang][key]) {
        return this.translations[this.lang][key];
      }
      // fallback global
      if (window.superAdminTranslations && window.superAdminLang && window.superAdminTranslations[window.superAdminLang] && window.superAdminTranslations[window.superAdminLang][key]) {
        return window.superAdminTranslations[window.superAdminLang][key];
      }
      return key;
    },
    switchLanguage(lang) {
      this.lang = lang;
      localStorage.setItem('lang', lang);
      this.updateTexts && this.updateTexts();
    },
    updateTexts() {
      this.filterAll(); // Update filter saat teks berubah (misal ganti bahasa)
      this.$nextTick(() => { });
    },
    // This admins array is only for the "Kelola Admin/User" tab, showing Shoesmu users
    admins: JSON.parse(localStorage.getItem('admins')) || [],
    products: JSON.parse(localStorage.getItem('products')) || [],
    brands: JSON.parse(localStorage.getItem('brands')) || ['Nike', 'Adidas', 'Puma', 'Vans', 'Reebook', 'Converse', 'New Balance'],
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
          },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
          }
        }
      });
    },
    pagedAdmins() {
      const start = (this.adminPage - 1) * this.adminPerPage;
      return this.filteredAdmins.slice(start, start + this.adminPerPage).map((admin, idx) => ({ ...admin, _idx: start + idx }));
    },
    adminTotalPages() {
      return Math.ceil(this.filteredAdmins.length / this.adminPerPage) || 1;
    },
    pagedProducts() {
      const start = (this.productPage - 1) * this.productPerPage;
      return this.filteredProducts.slice(start, start + this.productPerPage).map((product, idx) => ({ ...product, _idx: start + idx }));
    },
    productTotalPages() {
      return Math.ceil(this.filteredProducts.length / this.productPerPage) || 1;
    },
    pagedBrands() {
      const start = (this.brandPage - 1) * this.brandPerPage;
      return this.filteredBrands.slice(start, start + this.brandPerPage).map((brand, idx) => ({ name: brand, _idx: start + idx }));
    },
    brandTotalPages() {
      return Math.ceil(this.filteredBrands.length / this.brandPerPage) || 1;
    },
    showConfirm: false,
    setAccentColor(color) {
      this.accentColor = color;
      localStorage.setItem('accentColor', color);
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--tw-prose-links', color);
    },
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
        setTimeout(() => { this.showSpinner = false; }, 10000);
      }
    },
    showToast(type, message) {
      // Use SweetAlert2 for all alerts
      let icon = type;
      if (type === 'error' || type === 'danger') icon = 'error';
      if (type === 'success') icon = 'success';
      if (type === 'warning') icon = 'warning';
      if (type === 'info') icon = 'info';
      if (window.Swal) {
        Swal.fire({
          icon: icon,
          text: message,
          confirmButtonText: 'OK',
          customClass: { confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded' }
        });
      } else {
        alert(message);
      }
    },
    notifySuccess(msg) { this.showToast('success', msg); },
    notifyError(msg) { this.showToast('error', msg); },
    notifyInfo(msg) { this.showToast('info', msg); },
    notifyWarning(msg) { this.showToast('warning', msg); },
    confirm(message, onConfirm) {
      if (window.Swal) {
        Swal.fire({
          icon: 'question',
          text: message,
          showCancelButton: true,
          confirmButtonText: 'Ya',
          cancelButtonText: 'Batal',
          customClass: { confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded', cancelButton: 'bg-gray-300 text-gray-800 px-4 py-2 rounded' }
        }).then((result) => {
          if (result.isConfirmed && typeof onConfirm === 'function') onConfirm();
        });
      } else {
        if (confirm(message)) onConfirm && onConfirm();
      }
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
      // Jika activityLog sudah null (misal setelah dihapus semua), inisialisasi ulang array
      if (!Array.isArray(this.activityLog)) this.activityLog = [];
      this.activityLog.unshift(entry);
      if (this.activityLog.length > 100) this.activityLog.pop();
      localStorage.setItem('activityLog', JSON.stringify(this.activityLog));
    },
    deleteActivityLog(idx) {
      this.activityLog.splice(idx, 1);
      localStorage.setItem('activityLog', JSON.stringify(this.activityLog));
    },
    confirmDeleteAllActivityLog() {
      if (window.Swal) {
        Swal.fire({
          title: 'Hapus Semua Activity Log?',
          text: 'Semua riwayat aktivitas akan dihapus. Lanjutkan?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ya, Hapus Semua',
          cancelButtonText: 'Batal',
          customClass: { confirmButton: 'bg-red-600 text-white px-4 py-2 rounded', cancelButton: 'bg-gray-300 text-gray-800 px-4 py-2 rounded' }
        }).then((result) => {
          if (result.isConfirmed) {
            this.activityLog = [];
            localStorage.setItem('activityLog', '[]');
          }
        });
      } else {
        if (confirm('Hapus semua activity log?')) {
          this.activityLog = [];
          localStorage.setItem('activityLog', '[]');
        }
      }
    },
    refresh() {
      this.updateProdukBrandChart();
      this.logActivity('refresh', 'Data di-refresh');
      this.admins = JSON.parse(localStorage.getItem('admins')) || [];
      this.products = JSON.parse(localStorage.getItem('products')) || [];
      this.brands = JSON.parse(localStorage.getItem('brands')) || ['Nike', 'Adidas', 'Puma', 'Vans', 'Reebook', 'Converse', 'New Balance'];
      this.filterAll(); // Selalu filter ulang setelah refresh
    },
    updateProdukBrandChart() {
      setTimeout(() => {
        if (!window.Chart || !document.getElementById('produkBrandChart')) return;
        const ctx = document.getElementById('produkBrandChart').getContext('2d');
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
      // Only show Shoesmu user info in the admin tab
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
      // Ambil data produk default Shoesmu dari localStorage (bukan Noken)
      const allProducts = JSON.parse(localStorage.getItem('products')) || [];
      this.filteredProducts = allProducts.filter(p => {
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
        this.logActivity('Tambah Admin', `Email: ${this.form.email}`);
        this.closeModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Admin berhasil ditambahkan!');
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
          this.logActivity('Edit Admin', `Email: ${email}`);
          this.closeModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Admin berhasil diupdate!');
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
            this.logActivity('Hapus Admin', `Email: ${email}`);
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Admin dihapus!');
          }, 700);
        });
      }
    },
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
      // Allow base64 product images of any size (no max size enforcement).
      this.showLoadingSpinner(true);
      setTimeout(() => {
        this.productForm.id = 'PRD-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        this.products.push({ ...this.productForm });
        localStorage.setItem('products', JSON.stringify(this.products));
        this.logActivity('Tambah Produk', `Nama: ${this.productForm.name}`);
        this.closeProductModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Produk berhasil ditambahkan!');
      }, 700);
    },
    editProduct(idx) {
      this.editProductIdx = idx;
      this.productForm = { ...this.filteredProducts[idx] };
      this.showEditProduct = true;
    },
    updateProduct() {
      if (!this.productForm.name || !this.productForm.brand || !this.productForm.category || !this.productForm.price) return this.showToast('error', 'Semua field wajib diisi!');
      // Allow base64 product images of any size (no max size enforcement).
      const id = this.productForm.id;
      const realIdx = this.products.findIndex(p => p.id === id);
      if (realIdx !== -1) {
        this.showLoadingSpinner(true);
        setTimeout(() => {
          this.products[realIdx] = { ...this.productForm };
          localStorage.setItem('products', JSON.stringify(this.products));
          this.logActivity('Edit Produk', `Nama: ${this.productForm.name}`);
          this.closeProductModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Produk berhasil diupdate!');
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
            const name = this.products[realIdx].name;
            this.products.splice(realIdx, 1);
            localStorage.setItem('products', JSON.stringify(this.products));
            this.logActivity('Hapus Produk', `Nama: ${name}`);
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Produk dihapus!');
          }, 700);
        });
      }
    },
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
        this.logActivity('Tambah Brand', `Brand: ${this.brandForm}`);
        this.closeBrandModal();
        this.refresh();
        this.showLoadingSpinner(false);
        this.showToast('success', 'Brand berhasil ditambahkan!');
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
          this.logActivity('Edit Brand', `Brand: ${this.brandForm}`);
          this.closeBrandModal();
          this.refresh();
          this.showLoadingSpinner(false);
          this.showToast('success', 'Brand berhasil diupdate!');
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
            this.logActivity('Hapus Brand', `Brand: ${name}`);
            this.refresh();
            this.showLoadingSpinner(false);
            this.showToast('success', 'Brand dihapus!');
          }, 700);
        });
      }
    },
  }
}

if (typeof window.Alpine === 'undefined') {
  // Optionally, you could import Alpine here if not loaded by CDN
}
window.addEventListener('DOMContentLoaded', function () {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (admin && admin.email === 'superadmin@shoesmu.com') {
    const nav = document.querySelector('#super-admin-link');
    if (nav) nav.style.display = 'block';
  }
});
// (window.dashboardApp dipindahkan ke app.js)
