'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Star, X } from 'lucide-react';
import { ProductFilters } from '@/lib/types';
import { formatPrice } from '@/utils';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialFilters: ProductFilters;
}

export default function ProductsClient({
  initialProducts,
  categories,
  initialFilters,
}: ProductsClientProps) {
  const [filters, setFilters] = useState({
    search: initialFilters.search || '',
    categoryId: initialFilters.categoryId || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    featured: initialFilters.featured || '',
    isActive: initialFilters.isActive || false,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      featured: '',
      isActive: false,
    });
  };

  // Filtrado en el cliente
  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch = filters.search
      ? product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.description ?? '').toLowerCase().includes(filters.search.toLowerCase())
      : true;
    const matchesCategory = filters.categoryId
      ? product.category && product.category.name && product.category.name === categories.find(c => c.id.toString() === filters.categoryId)?.name
      : true;
    const matchesMinPrice = filters.minPrice && typeof filters.minPrice === 'string'
      ? product.price >= parseFloat(filters.minPrice as string)
      : true;
    const matchesMaxPrice = filters.maxPrice && typeof filters.maxPrice === 'string'
      ? product.price <= parseFloat(filters.maxPrice as string)
      : true;
    const matchesFeatured = filters.featured === ''
      ? true
      : filters.featured === 'true'
      ? product.featured
      : !product.featured;
    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesFeatured
    );
  });

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white pt-1.5 relative rounded-xl shadow-lg">
      <Link
        href={`/products/${product.id}`}
        prefetch={false}
        className="block bg-white text-[#181818] rounded-xl hover:shadow-2xl hover:scale-[1.025] hover:border-[#94C11F] transition-all duration-500 ease-in-out overflow-hidden group h-full"
      >
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl || '/images/img_not_found.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover hover:scale-110 hover:brightness-95 transition-transform duration-500 ease-in-out bg-white"
            onError={e => {
              e.currentTarget.src = '/images/img_not_found.jpg';
            }}
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-[#94C11F] text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-current text-black" />
              Destacado
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-extrabold text-[#181818] text-lg mb-3 line-clamp-2 text-nowrap tracking-tight">
            {product.name}
          </h3>

          <p className="text-gray-700 text-sm mb-4 line-clamp-3 text-nowrap">
            {product.description ?? ''}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-[#94C11F] drop-shadow-sm">
              ${formatPrice(product.price)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div className="flex flex-row gap-4 items-center w-full">
          {/* Search */}
          <div className="flex-1 min-w-0 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94C11F] w-5 h-5 hover:cursor-pointer transition-all ease-in-out duration-300`}
              onClick={() => {
                if (filters.search) {
                  handleFilterChange('search', '');
                }
              }}
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="w-full min-w-0 pl-10 pr-4 py-3 border border-gray-200 bg-white text-[#181818] rounded-lg focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F] placeholder-gray-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border border-[#94C11F] rounded-lg transition-colors font-semibold shadow-sm
            ${
              showFilters === true
                ? 'bg-[#94C11F] text-black hover:bg-black hover:text-[#94C11F]'
                : 'bg-black text-white hover:bg-[#94C11F] hover:text-black'
            }`}
            aria-label="Mostrar filtros"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden lg:inline">Filtros</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.categoryId}
                onChange={e => handleFilterChange('categoryId', e.target.value)}
                className="px-4 py-2 border border-gray-200 bg-white text-[#181818] rounded-lg focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
              >
                <option value="" className="bg-[#94C11F] text-black">
                  Todas las categorías
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-black text-white">
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Precio mínimo"
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                className="px-4 py-2 border border-gray-200 bg-white text-[#181818] rounded-lg focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F] placeholder-gray-500"
              />

              <input
                type="number"
                placeholder="Precio máximo"
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                className="px-4 py-2 border border-gray-200 bg-white text-[#181818] rounded-lg focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F] placeholder-gray-500"
              />

              <select
                value={typeof filters.featured === 'string' ? filters.featured : ''}
                onChange={e => handleFilterChange('featured', e.target.value)}
                className="px-4 py-2 border border-gray-200 bg-white text-[#181818] rounded-lg focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
              >
                <option value="">Todos los productos</option>
                <option value="true">Solo destacados</option>
                <option value="false">No destacados</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-[#94C11F] hover:text-black hover:bg-[#94C11F] border border-[#94C11F] rounded-lg transition-colors font-semibold"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-[#94C11F] font-semibold">Mostrando {filteredProducts.length} productos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-48 h-48 inline-block mb-12 text-[#94C11F]" />
          <h3 className="text-xl font-extrabold text-[#181818] mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-700 mb-4">
            Intenta ajustar tus filtros de búsqueda
          </p>
          <button
            onClick={clearFilters}
            className="bg-[#94C11F] text-black px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-[#181818] hover:text-[#94C11F] border border-[#94C11F]"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
