"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Share2,
  Package,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/utils";
import { useCart } from "@/app/cart/context";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  category: {
    id: number;
    name: string;
  };
  orderItems?: Array<{
    order: {
      id: number;
      orderNumber: string;
      status: string;
    };
  }>;
}

interface ProductDetailClientProps {
  product: Product;
  userId?: number;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const images = [
    product.imageUrl || "/images/img_not_found.jpg",
    "/images/img_not_found.jpg",
    "/images/img_not_found.jpg",
    "/images/img_not_found.jpg",
  ];

  const totalPrice = product.price * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const handleAddToCart = () => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 0,
    }, quantity);
    setIsAddingToCart(true);
    setShowAdded(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowAdded(false);
    }, 1200);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado");
    }
  };

  const green = "#94C11F";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {showLoginAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white border-2 border-[#94C11F] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
            <div className="flex flex-col items-center gap-3 mb-4">
              <ShoppingCart className="w-10 h-10 text-[#94C11F]" />
              <h3 className="text-2xl font-extrabold text-[#181818] mb-2">¡Accede para comprar!</h3>
              <p className="text-md text-gray-600 font-medium mb-2">Debes iniciar sesión o registrarte para agregar productos al carrito y finalizar tu compra.</p>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              <button
                onClick={() => { setShowLoginAlert(false); router.push("/auth/login"); }}
                className="w-full bg-[#94C11F] text-black font-bold py-3 rounded-xl hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all"
              >Iniciar sesión / Registrarse</button>
              <button
                onClick={() => setShowLoginAlert(false)}
                className="w-full bg-black text-[#94C11F] font-bold py-3 rounded-xl border border-[#94C11F] hover:bg-[#232323] transition-all"
              >Volver</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform bg-white"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`rounded-lg border-2 ${selectedImage === i ? "border-[#94C11F] ring-2 ring-[#94C11F]" : "border-gray-300 hover:border-[#94C11F]"} bg-white`}
              >
                <img src={img} className="w-full h-20 object-cover rounded-md bg-white" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold bg-[#94C11F] bg-opacity-20 text-[#181818] px-2 py-1 rounded-full">{product.category.name}</span>
            {product.featured && (
              <span className="flex items-center gap-1 text-[#181818] px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-[#94C11F] to-[#5A7D1A]">
                <Star className="w-4 h-4 text-[#94C11F]" /> Destacado
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-[#181818]">{product.name}</h1>
          <div className="text-3xl font-bold text-[#94C11F]">${formatPrice(product.price)}</div>
          <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            {[{ icon: Package, label: "Stock disponible" }, { icon: Truck, label: "Envío gratis" }, { icon: Shield, label: "Garantía incluida" }, { icon: Clock, label: "Entrega 24-48h" }].map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg shadow">
                <Icon className="text-[#94C11F] w-5 h-5" /> <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <label className="text-md text-gray-700 font-medium">Cantidad:</label>
              <div className="flex text-gray-700 items-center bg-gray-100 rounded-lg overflow-hidden">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[${green}] disabled:opacity-30">
                  <Minus />
                </button>
                <span className="px-4 text-lg font-semibold">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[${green}] disabled:opacity-30">
                  <Plus />
                </button>
              </div>
            </div>
            <div className={`text-2xl font-bold text-black`}>Total: ${formatPrice(totalPrice)}</div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className={`w-full bg-white text-[${green}] font-bold py-3 rounded-xl hover:bg-[${green}] hover:text-black border-2 border-[${green}] transition relative`}
              >
                {showAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    ¡Agregado!
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <ShoppingCart className="w-6 h-6" />
                    {isAddingToCart ? "Agregando..." : product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                  </span>
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 text-gray-700 font-semibold flex items-center gap-2 justify-center"
              >
                <Share2 className="w-5 h-5" /> Compartir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
