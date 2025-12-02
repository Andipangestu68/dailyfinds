// // export default Homepage;
// import { useState, useEffect } from 'react';
// import { supabase, getUserRole } from '../lib/supabase';
// import { useNavigate } from 'react-router-dom';

// import icon from '../assets/logo.png';


// const API_URL = import.meta.env.VITE_API_URL;

// function Homepage({ session }) {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     name: '',
//     code: '',
//     category: ''
//   });
//   const [categories, setCategories] = useState([]);
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//     if (session) {
//       getUserRole().then(setUserRole);
//     }
//   }, [session]);

//   // Realtime filter effect
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       fetchProducts();
//     }, 300); // Debounce 300ms

//     return () => clearTimeout(timeoutId);
//   }, [filters.name, filters.code, filters.category]);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/categories`);
//       const result = await response.json();
//       if (result.success) {
//         setCategories(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//     }
//   };

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (filters.name) params.append('name', filters.name);
//       if (filters.code) params.append('code', filters.code);
//       if (filters.category) params.append('category', filters.category);

//       const response = await fetch(`${API_URL}/api/products?${params}`);
//       const result = await response.json();
      
//       if (result.success) {
//         setProducts(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const handleReset = () => {
//     setFilters({ name: '', code: '', category: '' });
//     setTimeout(() => {
//       fetchProducts();
//     }, 100);
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.reload();
//   };

//   const handleAffiliateClick = (productId) => {
//     window.open(`${API_URL}/api/click/${productId}`, '_blank');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
//       {/* Header - Sticky & Minimalist with Logo */}
//       <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             {/* Logo & Brand */}
//             <div className="flex items-center gap-2 sm:gap-3">
//               {/* Logo Icon */}
//               <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg">
//                 <img src={icon} alt="DailyFinds Icon" className="w-full h-full object-contain" />
//               </div>
//               {/* Brand Name */}
//               <div>
//                 <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 tracking-tight leading-none">
//                   DailyFinds.id
//                 </h1>
//                 <p className="hidden sm:block text-[10px] sm:text-xs text-slate-500 font-medium">
//                   Your Trusted Partner
//                 </p>
//               </div>
//             </div>

//             {/* Navigation */}
//             <div className="flex gap-2 sm:gap-3 items-center">
//               {session && (
//                 <>
//                   <span className="hidden sm:inline-block text-xs sm:text-sm text-slate-600 font-medium">
//                     {session.user.email.split('@')[0]} {userRole === 'admin' && '• Admin'}
//                   </span>
//                   {userRole === 'admin' && (
//                     <button
//                       onClick={() => navigate('/admin')}
//                       className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
//                     >
//                       Admin
//                     </button>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-all duration-200"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )}
//               {!session && (
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-all duration-200"
//                 >
//                   Login
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section with Slogan */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 sm:pb-6">
//         <div className="text-center">
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2 sm:mb-3">
//             Discover Amazing Products
//           </h2>
//           <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto mb-2">
//             Find the best deals from Shopee with our curated collection
//           </p>
//           <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
//             <div className="flex items-center gap-1">
//               <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//               <span>Quality Products</span>
//             </div>
//             <span className="text-slate-300">•</span>
//             <div className="flex items-center gap-1">
//               <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Verified Sellers</span>
//             </div>
//             <span className="text-slate-300 hidden sm:inline">•</span>
//             <div className="hidden sm:flex items-center gap-1">
//               <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Fast Delivery</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search Section - Glassmorphism */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//         <div className="backdrop-blur-md bg-white/60 border border-white/50 rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
//           <div className="flex items-center gap-2 mb-4 sm:mb-6">
//             <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
//               Find Your Product
//             </h2>
//           </div>
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
//             {/* Product Name Search */}
//             <div className="group">
//               <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 value={filters.name}
//                 onChange={(e) => handleFilterChange('name', e.target.value)}
//                 placeholder="Search by name..."
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
//               />
//             </div>

//             {/* Product Code Search */}
//             <div className="group">
//               <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
//                 Product Code
//               </label>
//               <input
//                 type="text"
//                 value={filters.code}
//                 onChange={(e) => handleFilterChange('code', e.target.value)}
//                 placeholder="Search by code..."
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
//               />
//             </div>

//             {/* Category Filter */}
//             <div className="group sm:col-span-2 lg:col-span-1">
//               <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 cursor-pointer"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
//             <button 
//               onClick={handleReset} 
//               className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
//             >
//               Reset All Filters
//             </button>
//             <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//               <span>Filters apply automatically</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
//         {loading ? (
//           <div className="text-center py-16 sm:py-20">
//             <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-slate-300 border-t-slate-800 mb-4"></div>
//             <div className="text-lg sm:text-xl font-medium text-slate-600">Loading products...</div>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-16 sm:py-20">
//             <div className="text-4xl sm:text-5xl mb-4">📦</div>
//             <div className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No products found</div>
//             <p className="text-sm sm:text-base text-slate-500">Try adjusting your filters</p>
//           </div>
//         ) : (
//           <>
//             <div className="mb-4 sm:mb-6">
//               <h3 className="text-base sm:text-lg font-semibold text-slate-700">
//                 {products.length} Product{products.length !== 1 ? 's' : ''} Found
//               </h3>
//             </div>
            
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
//               {products.map((product) => (
//                 <div 
//                   key={product.id} 
//                   className="group backdrop-blur-sm bg-white/70 border border-white/60 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
//                     {product.image_url ? (
//                       <img
//                         src={product.image_url}
//                         alt={product.name}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <span className="text-slate-300 text-5xl">📦</span>
//                       </div>
//                     )}
//                     <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 backdrop-blur-md bg-slate-800/80 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
//                       {product.click_count} clicks
//                     </div>
//                   </div>
                  
//                   <div className="p-2.5 sm:p-3 lg:p-4">
//                     <div className="mb-1.5 sm:mb-2">
//                       <span className="inline-block bg-blue-50 text-blue-700 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium">
//                         {product.category}
//                       </span>
//                     </div>
                    
//                     <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-slate-800 mb-1 sm:mb-1.5 line-clamp-2 leading-snug">
//                       {product.name}
//                     </h3>
                    
//                     <p className="text-[10px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">
//                       Code: {product.product_code}
//                     </p>
                    
//                     {product.description && (
//                       <p className="text-[10px] sm:text-xs text-slate-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
//                         {product.description}
//                       </p>
//                     )}
                    
//                     {product.price && (
//                       <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-2 sm:mb-3">
//                         Rp {Number(product.price).toLocaleString('id-ID')}
//                       </p>
//                     )}
                    
//                     <button
//                       onClick={() => handleAffiliateClick(product.id)}
//                       className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white text-[11px] sm:text-xs lg:text-sm py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:shadow-lg"
//                     >
//                       View on Shopee
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Footer */}
//       <footer className="backdrop-blur-lg bg-slate-900/95 text-slate-300 py-6 sm:py-8 mt-8 sm:mt-12 border-t border-slate-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-4">
//             <div className="flex items-center justify-center gap-2 mb-2">
//               <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//               </div>
//               <span className="text-lg font-bold text-white">Shopee Catalog</span>
//             </div>
//             <p className="text-xs sm:text-sm text-slate-400">Your Trusted Partner for Quality Products</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xs sm:text-sm">&copy; 2024 Shopee Affiliate Catalog. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Homepage;

// Homepage.jsx – Versi Modifikasi Hitam-Putih & Bahasa Indonesia

import { useState, useEffect } from 'react';
import { supabase, getUserRole } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

import icon from '../assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL;

function Homepage({ session }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    if (session) {
      getUserRole().then(setUserRole);
    }
  }, [session]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters.name, filters.code, filters.category]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const result = await response.json();
      if (result.success) setCategories(result.data);
    } catch (error) {
      console.error('Gagal memuat kategori:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.code) params.append('code', filters.code);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`${API_URL}/api/products?${params}`);
      const result = await response.json();

      if (result.success) setProducts(result.data);
    } catch (error) {
      console.error('Gagal memuat produk:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ name: '', code: '', category: '' });
    setTimeout(() => fetchProducts(), 100);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleAffiliateClick = (id) => {
    window.open(`${API_URL}/api/click/${id}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Header Hitam Putih */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <img src={icon} alt="Icon" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-black tracking-tight">
                  DailyFinds.id
                </h1>
                <p className="text-xs text-gray-500">Partner Belanja Terpercaya</p>
              </div>
            </div>

            {/* Navigasi */}
            <div className="flex gap-2 items-center">

              {session && (
                <>
                  <span className="hidden sm:block text-sm text-gray-600">
                    {session.user.email.split("@")[0]} {userRole === "admin" && "• Admin"}
                  </span>

                  {userRole === "admin" && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="px-4 py-2 text-sm bg-white border border-black rounded hover:bg-gray-100 transition"
                    >
                      Admin
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-white bg-black rounded hover:bg-gray-800 transition"
                  >
                    Logout
                  </button>
                </>
              )}

              {!session && (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm text-white bg-black rounded hover:bg-gray-800 transition"
                >
                  Login
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-8 sm:py-12">
        <h2 className="text-3xl font-bold text-black mb-2">
          Temukan Produk Terbaik
        </h2>
        <p className="text-gray-600">
          Katalog produk pilihan terbaik dari Shopee
        </p>
      </div>

      {/* Filter Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">

          <h3 className="text-lg font-semibold mb-4 text-black">Cari Produk</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

            {/* Nama Produk */}
            <div>
              <label className="text-sm font-medium">Nama Produk</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Cari nama produk..."
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Kode Produk */}
            <div>
              <label className="text-sm font-medium">Kode Produk</label>
              <input
                type="text"
                value={filters.code}
                onChange={(e) => handleFilterChange('code', e.target.value)}
                placeholder="Cari kode produk..."
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="text-sm font-medium">Kategori</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-black"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-5 py-2 bg-white border border-black rounded hover:bg-gray-100 transition"
          >
            Reset Filter
          </button>

        </div>
      </div>

      {/* GRID PRODUK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-lg font-semibold text-black">Tidak ada produk ditemukan</p>
            <p className="text-gray-500 text-sm">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-36 w-full object-cover rounded mb-3"
                />

                <h3 className="font-semibold text-sm text-black line-clamp-2 mb-2">{item.name}</h3>

                <p className="text-xs text-gray-600 mb-3">Kode: {item.code}</p>

                <button
                  onClick={() => handleAffiliateClick(item.id)}
                  className="mt-auto w-full py-2 text-sm text-white bg-black rounded hover:bg-gray-800 transition"
                >
                  Beli Sekarang
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Homepage;
