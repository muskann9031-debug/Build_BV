import {
  ArrowLeft,
  Check,
  Circle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useOrders,
} from "../../context/OrderContext";

const statuses = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "COLLECTED",
];

export default function OrderTracking() {
  const { orderId } = useParams();

  const {
    orders,
  } = useOrders();

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

  const currentIndex =
    statuses.indexOf(order.status);

  const handleImHere = () => {
    alert(
      `You have arrived at the café.\n\nPlease provide Order ID ${order.id} to café staff.`
    );
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      <header className="bg-white border-b p-5">

        <Link
          to="/student/orders"
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft size={18} />
          My Orders
        </Link>

      </header>

      <main className="max-w-3xl mx-auto p-5 lg:p-10">

        <h1 className="text-3xl font-black">
          Track Order
        </h1>

        <div className="bg-[#075d50] text-white rounded-[28px] p-8 mt-8 text-center">

          <p className="text-white/60 text-sm">
            ORDER ID
          </p>

          <p className="text-6xl font-black tracking-[0.3em] text-[#facc15] mt-3">
            {order.id}
          </p>

          <p className="font-bold mt-5">
            {order.cafeName}
          </p>

        </div>

        <div className="bg-white rounded-2xl p-8 mt-6 shadow-card">

          <div className="flex justify-between">

            <div>
              <p className="text-gray-500 text-sm">
                Expected Arrival
              </p>

              <p className="text-xl font-black mt-1">
                {order.pickupTime}
              </p>
            </div>

            <div className="text-right">
              <p className="text-gray-500 text-sm">
                Expiry
              </p>

              <p className="text-xl font-black mt-1">
                {new Date(
                  order.expiryTime
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>

          </div>

          {/* TIMELINE */}

          <div className="mt-10">

            {statuses.map(
              (status, index) => {

                const completed =
                  index <= currentIndex;

                return (
                  <div
                    key={status}
                    className="flex gap-5"
                  >

                    <div className="flex flex-col items-center">

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completed
                            ? "bg-[#0f8f73] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {completed ? (
                          <Check size={18} />
                        ) : (
                          <Circle size={16} />
                        )}
                      </div>

                      {index <
                        statuses.length -
                          1 && (
                        <div
                          className={`w-0.5 h-14 ${
                            index <
                            currentIndex
                              ? "bg-[#0f8f73]"
                              : "bg-gray-200"
                          }`}
                        />
                      )}

                    </div>

                    <div className="pt-2">

                      <p className="font-black">
                        {status ===
                        "RECEIVED"
                          ? "Order Received"
                          : status ===
                            "PREPARING"
                          ? "Preparing"
                          : status ===
                            "READY"
                          ? "Ready for Pickup"
                          : "Collected"}
                      </p>

                      {index ===
                        currentIndex && (
                        <p className="text-[#0f8f73] text-sm mt-1 font-semibold">
                          Current status
                        </p>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {order.status === "READY" && (
            <div className="bg-green-50 rounded-xl p-5 mt-8">

              <p className="font-black text-green-700">
                🟢 Your order is ready for pickup.
              </p>

              <p className="text-green-700 text-sm mt-2">
                Reach the café and provide your
                Order ID.
              </p>

              <button
                onClick={handleImHere}
                className="mt-4 bg-[#075d50] text-white px-5 py-2.5 rounded-xl font-bold"
              >
                I'm Here
              </button>

            </div>
          )}

          {order.status === "COLLECTED" && (
            <div className="bg-green-50 text-green-700 rounded-xl p-5 mt-8 font-black">
              ✓ Order Collected
            </div>
          )}

          {order.status === "EXPIRED" && (
            <div className="bg-red-50 text-red-700 rounded-xl p-5 mt-8 font-black">
              ❌ This order has expired and can no
              longer be collected.
            </div>
          )}

        </div>

      </main>

    </div>
  );
}