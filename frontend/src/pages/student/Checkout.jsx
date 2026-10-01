import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { useOrders } from "../../context/OrderContext";

const pickupOptions = [10, 20, 30, 45, 60];
export default function Checkout() {
  const { cart, cafes, createOrder } = useOrders();
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(20);
  const [error, setError] = useState("");
  const cafe = cafes.find((item) => item.id === cart[0]?.cafeId);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const placeOrder = () => {
    try {
      const pickupAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      const order = createOrder({ pickupAt });
      navigate(`/student/order-success?id=${order.id}`);
    } catch (issue) { setError(issue.message); }
  };
  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <header className="border-b bg-white p-5"><Link to="/student/cart" className="flex items-center gap-2 text-gray-500"><ArrowLeft size={18} /> Back to cart</Link></header>
      <main className="mx-auto max-w-5xl p-5 lg:p-10">
        <h1 className="text-3xl font-black">Schedule your pickup</h1><p className="mt-2 text-gray-500">Choose when you expect to reach {cafe?.name || "the canteen"}.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px]">
          <section className="h-fit rounded-2xl bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-3 text-xl font-black"><Clock className="text-[#0f8f73]" /> Estimated arrival</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">{pickupOptions.map((value) => <button key={value} aria-pressed={minutes === value} onClick={() => setMinutes(value)} className={`rounded-xl border-2 p-4 font-bold ${minutes === value ? "border-[#0f8f73] bg-green-50" : "border-gray-200"}`}>In {value} minutes</button>)}</div>
            <p className="mt-6 text-sm text-gray-500">The canteen will review your order and notify you when it is ready for pickup.</p>
          </section>
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-xl font-black">Order summary</h2><p className="mt-2 font-semibold text-[#0f8f73]">{cafe?.name}</p>
            <div className="mt-5 space-y-3">{cart.map((item) => <div key={item.id} className="flex justify-between gap-3 text-sm"><span>{item.name} × {item.quantity}</span><strong>₹{item.price * item.quantity}</strong></div>)}</div>
            <div className="mt-5 flex justify-between border-t pt-5 text-xl font-black"><span>Total</span><span>₹{total}</span></div>
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            {!cart.length && <p className="mt-4 text-gray-500">Add items to your cart first.</p>}
            <button onClick={placeOrder} disabled={!cart.length} className="mt-6 w-full rounded-xl bg-[#0f8f73] py-3 font-black text-white disabled:bg-gray-300">Place test order</button>
          </aside>
        </div>
      </main>
    </div>
  );
}
