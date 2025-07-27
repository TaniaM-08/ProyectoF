import CartClient from './components/CartClient';

export default function CartPage() {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="relative bg-gradient-to-b from-gray-500 via-white to-white text-[#181818] overflow-hidden shadow-lg">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl mt-20 font-extrabold mb-4 tracking-tight ">
              Carrito de Compras
            </h1>
            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto mb-6 font-light">
              Aquí puedes ver y gestionar los productos que has agregado a tu carrito.
            </p>
          </div>
          <div className="w-32 h-1 mx-auto rounded-2xl shadow-md bg-gradient-to-r from-[#94C11F] via-[#94C11F] to-[#94C11F]" />
        </div>
      </div>
      <div className="relative z-10">
        <CartClient />
      </div>
    </div>
  );
}
