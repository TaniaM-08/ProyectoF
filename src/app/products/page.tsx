import { Suspense } from 'react';
import { productCrud, categoryCrud } from '@/lib/prisma';
import ProductsClient from './components/ProductsClient';
import ProductsLoading from './components/ProductsLoading';

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    search: searchParams.search || undefined,
    categoryId: searchParams.category
      ? parseInt(searchParams.category)
      : undefined,
    minPrice: searchParams.minPrice
      ? parseFloat(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseFloat(searchParams.maxPrice)
      : undefined,
    featured:
      searchParams.featured === 'true'
        ? true
        : searchParams.featured === 'false'
        ? false
        : undefined,
  };

  const [rawProducts, categories] = await Promise.all([
    productCrud.getAll(filters),
    categoryCrud.getAll(),
  ]);

  const products = rawProducts.map(product => ({
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
    description: product.description ?? '',
    imageUrl: product.imageUrl ?? '/images/img_not_found.jpg',
    category: product.category ? { name: product.category.name } : { name: '' },
  }));

  return (
    <div className="bg-white overflow-hidden">
      <div className="relative bg-gradient-to-b from-gray-500 via-white to-white text-[#181818] overflow-hidden shadow-lg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mt-30 font-extrabold mb-4 tracking-tight text-[#181818] drop-shadow-lg">
              Nuestros Productos
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6 font-light">
              Descubre nuestra selección de productos de alta calidad para el control de plagas y limpieza profesional.
            </p>
          </div>
          <div className="w-32 h-1 mx-auto rounded-2xl shadow-md bg-[#94C11F]" />
        </div>
      </div>

      <div className="relative z-10">
        <Suspense fallback={<ProductsLoading />}>
          <div className="bg-white text-[#181818] rounded-xl shadow p-4">
            <ProductsClient
              initialProducts={products}
              categories={categories}
              initialFilters={filters}
            />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
