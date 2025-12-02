// 

import { useState, useEffect } from 'react';
import { supabase, uploadImage } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function AdminPanel({ session }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    product_code: '',
    name: '',
    description: '',
    category: '',
    price: '',
    affiliate_link: '',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const getAuthHeader = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/api/admin/stats`, { headers });
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setImageFile(file);
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = await getAuthHeader();
      const url = editingProduct
        ? `${API_URL}/api/admin/products/${editingProduct.id}`
        : `${API_URL}/api/admin/products`;

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert(editingProduct ? 'Product updated!' : 'Product created!');
        resetForm();
        fetchProducts();
        fetchStats();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_code: product.product_code,
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price || '',
      affiliate_link: product.affiliate_link,
      image_url: product.image_url || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers
      });

      const result = await response.json();

      if (result.success) {
        alert('Product deleted!');
        fetchProducts();
        fetchStats();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      product_code: '',
      name: '',
      description: '',
      category: '',
      price: '',
      affiliate_link: '',
      image_url: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setImageFile(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header - Sticky & Minimalist */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight">
              Admin Panel
            </h1>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-slate-600">Total Products</h3>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-slate-800">{stats.totalProducts}</p>
            </div>

            <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-slate-600">Total Clicks</h3>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-slate-800">{stats.totalClicks}</p>
            </div>

            <div className="backdrop-blur-sm bg-white/70 border border-white/60 rounded-xl shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-200 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-slate-600">Top Product</h3>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 mb-1 line-clamp-1">
                {stats.topProducts[0]?.name || 'N/A'}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                {stats.topProducts[0]?.click_count || 0} clicks
              </p>
            </div>
          </div>
        )}

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {showForm ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Product
              </>
            )}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="backdrop-blur-md bg-white/70 border border-white/60 rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-5 sm:mb-6">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.product_code}
                    onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    required
                    disabled={editingProduct}
                    placeholder="e.g. PROD-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                    required
                    placeholder="e.g. Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                    placeholder="e.g. 150000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Affiliate Link <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200"
                  placeholder="https://shopee.co.id/..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2.5 text-sm bg-white/80 border border-slate-200 rounded-lg focus:border-blue-400 focus:outline-none transition-all duration-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:cursor-pointer"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading image...
                  </p>
                )}
                {formData.image_url && (
                  <div className="mt-4">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-slate-200 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="backdrop-blur-md bg-white/70 border border-white/60 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200/50">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-800">All Products</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{products.length} total products</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/95 text-white">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium">Image</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium">Code</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium">Name</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium hidden lg:table-cell">Category</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium">Clicks</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/50'
                    } hover:bg-blue-50/50 transition-colors duration-150`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-slate-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm text-slate-700">
                      {product.product_code}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm text-slate-800 max-w-xs">
                      <div className="line-clamp-2">{product.name}</div>
                      <div className="lg:hidden mt-1">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          {product.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-xs sm:text-sm text-slate-800">
                      {product.click_count}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-slate-700 rounded-md hover:bg-slate-800 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-lg bg-slate-900/95 text-slate-300 py-6 sm:py-8 mt-8 sm:mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm">&copy; 2024 Shopee Affiliate Catalog Admin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default AdminPanel;