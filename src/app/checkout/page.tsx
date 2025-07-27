'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../cart/context';
import { generateInvoicePDF } from '../../utils/invoicePDF';

export default function CheckoutPage() {
  const { cart, addToCart } = useCart();
  const router = useRouter();

  const [paymentType, setPaymentType] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCVC] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paid, setPaid] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itbms = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + itbms).toFixed(2);

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
  const orderNumber = `ORD-${Date.now()}`;

  const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const generatePDF = async () => {
    const order = {
      orderNumber,
      createdAt: new Date(),
      user: {
        name: user.name || '',
        email: user.email || '',
        address: address,
      },
      orderItems: cart.map(item => ({
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      paymentMethod: paymentType === 'tarjeta' ? 'Tarjeta' : 'Efectivo',
      total,
    };
    const doc = await generateInvoicePDF(order);
    doc.save(`factura_${orderNumber}.pdf`);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderBody = {
      userId: user.id,
      orderNumber,
      billingAddress: address,
      shippingAddress: address,
      notes: paymentType === 'tarjeta' ? `Pago con tarjeta: ${cardNumber}` : 'Pago en efectivo',
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });

      await generatePDF();

      cart.forEach(item => addToCart(item, -item.quantity));
      setPaid(true);

      setTimeout(() => {
        router.push('/');
      }, 2500);
    } catch (err) {
      alert('Error al procesar el pago. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 mt-20">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12">
        <form onSubmit={handlePay} className="space-y-5 bg-gray-50 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-black mb-6">Información de Pago</h2>

          <div>
            <label className="block text-sm font-medium text-black">Forma de pago:</label>
            <select
              value={paymentType}
              onChange={e => setPaymentType(e.target.value as any)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          {paymentType === 'tarjeta' && (
            <div className="space-y-4">
              <input
                type="text"
                value={formatCardNumber(cardNumber)}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                  setCardNumber(raw);
                }}
                placeholder="Número de tarjeta"
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm tracking-widest text-gray-700"
                required
              />
              <input
                type="text"
                value={nameOnCard}
                onChange={e => setNameOnCard(e.target.value)}
                placeholder="Nombre en la tarjeta"
                className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  value={expiry}
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                    setExpiry(val);
                  }}
                  placeholder="MM/AA"
                  className="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
                  required
                />
                <input
                  type="password"
                  value={cvc}
                  onChange={e => setCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  placeholder="CVC"
                  className="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
                  required
                />
              </div>
            </div>
          )}

          <h3 className="text-xl font-semibold text-black mt-6">Dirección de Envío</h3>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Dirección completa"
            className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Ciudad"
              className="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
              required
            />
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              placeholder="Código Postal"
              className="w-1/2 px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-[#94C11F] hover:text-black border border-[#94C11F] transition-all"
          >
            Pagar
          </button>

          {paid && (
            <div className="text-center text-[#94C11F] font-bold text-xl animate-pulse mt-4">
              ¡Pago realizado con éxito!
            </div>
          )}
        </form>

        <div>
          <h2 className="text-3xl font-bold text-black mb-6">Resumen</h2>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-black">
                <span>{item.name} x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="flex justify-between text-black">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-black">
              <span>ITBMS (7%):</span>
              <span>${itbms.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-black">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
