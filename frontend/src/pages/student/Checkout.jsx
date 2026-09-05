import {
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  Smartphone,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import {
  useOrders,
} from "../../context/OrderContext";

const pickupOptions = [
  "10–15 min",
  "20–25 min",
  "30–35 min",
  "40–45 min",
  "45–50 min",
];

export default function Checkout() {
  const {
    cart,
    createOrder,
  } = useOrders();

  const navigate = useNavigate();

  const [selectedPickup, setSelectedPickup] =
    useState("20–25 min");

  const [payment, setPayment] =
    useState("UPI");

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const getPickupTime = () => {
    const now = new Date();

    const ranges = {
      "10–15 min": 15,
      "20–25 min": 25,
      "30–35 min": 35,
      "40–45 min": 45,
      "45–50 min": 50,
    };

    now.setMinutes(
      now.getMinutes() +
        ranges[selectedPickup]
    );

    return now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handlePlaceOrder = () => {
    const now = new Date();

    const expiry = new Date(
      now.getTime() + 75 * 60 * 1000
    );

    const order = createOrder({
      cafeId: "central",
      cafeName: "Central Café",
      pickupTime: getPickupTime(),
      expiryTime: expiry.toISOString(),
      paymentMethod: payment,
    });

    navigate(
      `/student/order-success?id=${order.id}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f8faf9]">

      <header className="bg-white border-b p-5">

        <Link
          to="/student/cart"
          className="flex items-center gap-2 text-gray-500"
        >
          <ArrowLeft size={18} />
          Back to Cart
        </Link>

      </header>

      <main className="max-w-6xl mx-auto p-5 lg:p-10">

        <h1 className="text-4xl font-black">
          Schedule Your Pickup
        </h1>

        <p className="text-gray-500 mt-2">
          Choose when you expect to reach the café.
        </p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 mt-10">

          <div className="space-y-6">

            {/* PICKUP */}

            <section className="bg-white rounded-2xl p-6 shadow-card">

              <div className="flex items-center gap-3">

                <Clock className="text-[#0f8f73]" />

                <div>
                  <h2 className="font-black text-xl">
                    When will you reach the café?
                  </h2>

                  <p className="text-gray-500 text-sm">
                    This is your expected arrival /
                    pickup time, not delivery.
                  </p>
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">

                {pickupOptions.map(
                  (option) => (

                    <button
                      key={option}
                      onClick={() =>
                        setSelectedPickup(
                          option
                        )
                      }
                      className={`p-4 rounded-xl border-2 text-left ${
                        selectedPickup === option
                          ? "border-[#0f8f73] bg-[#ecfdf7]"
                          : "border-gray-200"
                      }`}
                    >

                      <p className="font-bold">
                        Reach in
                      </p>

                      <p className="text-lg font-black mt-1">
                        {option}
                      </p>

                    </button>

                  )
                )}

              </div>

              <div className="mt-6 bg-[#ecfdf7] rounded-xl p-4">

                <p className="text-sm text-gray-500">
                  Expected Arrival
                </p>

                <p className="text-2xl font-black text-[#075d50]">
                  {getPickupTime()}
                </p>

              </div>

            </section>

            {/* EXPIRY */}

            <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">

              <p className="font-black text-amber-800">
                ⚠️ Order Expiry
              </p>

              <p className="text-2xl font-black text-amber-900 mt-2">
                1 hour 15 minutes
              </p>

              <p className="text-sm text-amber-800 mt-2">
                Your order automatically expires
                1 hour 15 minutes after placement
                if it is not collected.
              </p>

            </section>

            {/* PAYMENT */}

            <section className="bg-white rounded-2xl p-6 shadow-card">

              <h2 className="text-xl font-black">
                Payment Method
              </h2>

              <div className="grid sm:grid-cols-3 gap-3 mt-5">

                <PaymentButton
                  icon={<Smartphone size={18} />}
                  name="UPI"
                  selected={payment === "UPI"}
                  onClick={() =>
                    setPayment("UPI")
                  }
                />

                <PaymentButton
                  icon={<CreditCard size={18} />}
                  name="Card"
                  selected={payment === "Card"}
                  onClick={() =>
                    setPayment("Card")
                  }
                />

                <PaymentButton
                  icon={<Check size={18} />}
                  name="Demo Payment"
                  selected={
                    payment === "Demo Payment"
                  }
                  onClick={() =>
                    setPayment("Demo Payment")
                  }
                />

              </div>

            </section>

          </div>

          {/* SUMMARY */}

          <aside className="bg-white rounded-2xl p-6 shadow-card h-fit">

            <h2 className="text-xl font-black">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span className="font-bold">
                    ₹
                    {item.price *
                      item.quantity}
                  </span>
                </div>

              ))}

            </div>

            <hr className="my-5" />

            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!cart.length}
              className="w-full mt-6 bg-[#0f8f73] hover:bg-[#08765f] disabled:bg-gray-300 text-white rounded-xl py-3.5 font-black"
            >
              Pay ₹{subtotal} & Place Order
            </button>

          </aside>

        </div>

      </main>

    </div>
  );
}

function PaymentButton({
  icon,
  name,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-bold ${
        selected
          ? "border-[#0f8f73] bg-[#ecfdf7] text-[#075d50]"
          : "border-gray-200"
      }`}
    >
      {icon}
      {name}
    </button>
  );
}