"use client";

import { Trash2 } from "lucide-react";
import { useCart } from "../context";

export default function CartClient() {
  const { cart, addToCart } = useCart();

  const removeFromCart = (id: number) => {
    addToCart({ id, name: "", price: 0, imageUrl: "", quantity: 0 }, -9999);
  };

  const updateQuantity = (id: number, delta: number) => {
    const prod = cart.find((p) => p.id === id);
    if (!prod) return;
    if (prod.quantity === 1 && delta === -1) {
      removeFromCart(id);
    } else if (prod.quantity + delta > 0) {
      addToCart(prod, delta);
    }
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 ">
      <h2 className="text-2xl font-bold text-[#94C11F] mb-6">Productos en tu carrito</h2>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          No hay productos en el carrito.
        </div>
      ) : (
        <>
          {cart.map((product) => (
            <div
              key={product.id}
              className="relative flex items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-4"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg bg-gray-100 mr-4"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-[#94C11F] font-bold">
                  ${product.price} x {product.quantity}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-[#94C11F] hover:text-black transition"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-lg text-gray-800">
                    {product.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-[#94C11F] hover:text-black transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          <div className="text-right mt-8">
            <span className="text-xl font-bold text-[#94C11F]">Total: ${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-end mt-8">
            <a href="/checkout" className="bg-[#94C11F] text-black font-semibold px-8 py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all text-lg shadow-md">Comprar Ahora</a>
          </div>
        </>
      )}
    </div>
  );
}
