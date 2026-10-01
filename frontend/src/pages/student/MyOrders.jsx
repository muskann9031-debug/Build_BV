import { Link } from "react-router-dom";
import { useState } from "react";
import { useOrders } from "../../context/OrderContext";

const tabs = [
  "Active",
  "Completed",
  "Expired",
];

export default function MyOrders() {
  const [tab, setTab] =
    useState("Active");

  const { orders } = useOrders();

  const filtered = orders.filter(
    (order) => {

      if (tab === "Active") {
        return ![
          "COLLECTED",
          "EXPIRED",
        ].includes(order.status);
      }

      if (tab === "Completed") {
        return order.status === "COLLECTED";
      }

      return order.status === "EXPIRED";
    }
  );

  return (
    <div className="min-h-screen bg-[#f8faf9] p-5 lg:p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-black">
          My Orders
        </h1>

        <div className="flex gap-3 mt-8 border-b">

          {tabs.map((item) => (

            <button
              key={item}
              onClick={() => setTab(item)}
              className={`px-5 py-3 font-bold border-b-2 ${
                tab === item
                  ? "border-[#0f8f73] text-[#0f8f73]"
                  : "border-transparent text-gray-500"
              }`}
            >
              {item}
            </button>

          ))}

        </div>

        <div className="space-y-4 mt-6">

          {filtered.length === 0 ? (

            <div className="bg-white rounded-2xl p-12 text-center">

              <h2 className="text-xl font-black">
                No {tab.toLowerCase()} orders
              </h2>

              <p className="text-gray-500 mt-2">
                Your orders will appear here.
              </p>

            </div>

          ) : (

            filtered.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 shadow-card"
              >

                <div className="flex flex-wrap justify-between gap-4">

                  <div>

                    <p className="text-2xl font-black tracking-widest">
                      {order.id}
                    </p>

                    <p className="font-bold mt-2">
                      {order.cafeName}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {order.items
                        .map(
                          (item) =>
                            `${item.name} × ${item.quantity}`
                        )
                        .join(", ")}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-black text-xl">
                      ₹{order.total}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {order.pickupTime}
                    </p>

                    <p className="text-[#0f8f73] font-bold text-sm mt-1">
                      {order.status}
                    </p>

                  </div>

                </div>

                <Link
                  to={`/student/orders/${order.id}`}
                  className="inline-block mt-5 border border-[#0f8f73] text-[#0f8f73] px-4 py-2 rounded-xl font-bold"
                >
                  View Details
                </Link>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}