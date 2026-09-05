import { CheckCircle } from "lucide-react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { useOrders } from "../../context/OrderContext";

export default function OrderSuccess() {
  const [params] = useSearchParams();

  const orderId = params.get("id");

  const { orders } = useOrders();

  const order = orders.find(
    (item) => item.id === orderId
  );

  if (!order) {
    return (
      <div className="p-10">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-5">

      <div className="w-full max-w-xl bg-white rounded-[28px] shadow-card p-8 lg:p-12 text-center">

        <CheckCircle
          size={70}
          className="mx-auto text-green-500"
        />

        <h1 className="text-3xl font-black mt-6">
          Order Confirmed!
        </h1>

        <p className="text-gray-500 mt-2">
          Your order has been placed successfully.
        </p>

        <div className="mt-8 bg-[#075d50] text-white rounded-2xl p-7">

          <p className="text-sm text-white/60">
            ORDER ID
          </p>

          <p className="text-6xl font-black tracking-[0.3em] text-[#facc15] mt-3">
            {order.id}
          </p>

          <p className="font-bold mt-5">
            {order.cafeName}
          </p>

        </div>

        <div className="text-left mt-8 space-y-4">

          <Info
            label="Items"
            value={order.items
              .map(
                (item) =>
                  `${item.name} × ${item.quantity}`
              )
              .join(", ")}
          />

          <Info
            label="Expected Arrival"
            value={order.pickupTime}
          />

          <Info
            label="Order Expiry"
            value={new Date(
              order.expiryTime
            ).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          />

        </div>

        <div className="bg-amber-50 rounded-xl p-4 mt-7 text-sm text-amber-900">

          Reach the café around your selected time
          and provide your Order ID to the café
          staff.

        </div>

        <Link
          to={`/student/orders/${order.id}`}
          className="block mt-6 bg-[#0f8f73] text-white rounded-xl py-3.5 font-black"
        >
          Track Order
        </Link>

      </div>

    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-bold mt-1">
        {value}
      </p>
    </div>
  );
}