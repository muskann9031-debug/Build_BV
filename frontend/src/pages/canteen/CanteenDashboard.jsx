import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  BarChart3,
  Settings,
  LogOut,
  Clock,
  ChefHat,
  CheckCircle,
  IndianRupee,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrderContext";

export default function CanteenDashboard() {
  const { logout } = useAuth();
  const { orders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();

  // Only active orders
  const activeOrders = orders
    .filter(
      (order) =>
        !["COLLECTED", "EXPIRED"].includes(order.status)
    )
    .sort((a, b) => {
      return (
        new Date(`1970/01/01 ${a.pickupTime}`) -
        new Date(`1970/01/01 ${b.pickupTime}`)
      );
    });

  const preparing = orders.filter(
    (order) => order.status === "PREPARING"
  ).length;

  const ready = orders.filter(
    (order) => order.status === "READY"
  ).length;

  const completed = orders.filter(
    (order) => order.status === "COLLECTED"
  ).length;

  const revenue = orders
    .filter((order) => order.status === "COLLECTED")
    .reduce((sum, order) => sum + order.total, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f8f7]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 bottom-0 hidden lg:flex w-64 bg-[#075d50] text-white p-6 flex-col">

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#facc15] text-[#075d50] flex items-center justify-center font-black">
            CE
          </div>

          <div>
            <p className="font-black text-xl">
              Campus<span className="text-[#facc15]">Eats</span>
            </p>

            <p className="text-xs text-white/50">
              Canteen
            </p>
          </div>
        </div>

        <nav className="space-y-2">

          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            text="Dashboard"
            to="/canteen"
            active
          />

          <SidebarItem
            icon={<ClipboardList size={18} />}
            text="Orders"
            to="/canteen/orders"
          />

          <SidebarItem
            icon={<Utensils size={18} />}
            text="Menu"
            to="/canteen/menu"
          />

          <SidebarItem
            icon={<BarChart3 size={18} />}
            text="Analytics"
            to="/canteen/analytics"
          />

          <SidebarItem
            icon={<Settings size={18} />}
            text="Settings"
            to="/canteen/settings"
          />

        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="lg:ml-64">

        {/* HEADER */}

        <header className="bg-white border-b border-gray-100 px-6 lg:px-10 py-5">

          <p className="text-sm font-bold text-[#0f8f73]">
            CENTRAL CAFÉ
          </p>

          <div className="flex justify-between items-end">

            <div>
              <h1 className="text-3xl font-black">
                Café Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage incoming orders and pickup priority.
              </p>
            </div>

            <span className="hidden sm:block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              ● Café Open
            </span>

          </div>

        </header>

        <div className="max-w-7xl mx-auto p-5 lg:p-10">

          {/* STAT CARDS */}

          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">

            <StatCard
              icon={<ClipboardList />}
              label="Today's Orders"
              value={orders.length}
            />

            <StatCard
              icon={<ChefHat />}
              label="Preparing"
              value={preparing}
            />

            <StatCard
              icon={<Clock />}
              label="Ready"
              value={ready}
            />

            <StatCard
              icon={<CheckCircle />}
              label="Completed"
              value={completed}
            />

            <StatCard
              icon={<IndianRupee />}
              label="Revenue"
              value={`₹${revenue}`}
            />

          </div>

          {/* PRIORITY QUEUE */}

          <section className="mt-10">

            <div className="flex justify-between items-end">

              <div>
                <p className="text-[#f59e0b] font-bold text-sm">
                  LIVE QUEUE
                </p>

                <h2 className="text-3xl font-black mt-1">
                  Smart Order Priority
                </h2>

                <p className="text-gray-500 mt-2">
                  Orders are sorted according to the
                  customer's selected arrival time.
                </p>
              </div>

              <Link
                to="/canteen/orders"
                className="hidden sm:block text-[#0f8f73] font-bold"
              >
                View all orders →
              </Link>

            </div>

            {/* Priority explanation */}

            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">

              <p className="font-bold text-amber-800">
                Earlier pickup time = Higher priority
              </p>

              <p className="text-sm text-amber-700 mt-1">
                Prepare the earliest-arriving active order first.
              </p>

            </div>

            {/* ORDERS */}

            <div className="space-y-4 mt-6">

              {activeOrders.length === 0 ? (

                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">

                  <ClipboardList
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <h3 className="text-xl font-black mt-4">
                    No pending orders
                  </h3>

                  <p className="text-gray-500 mt-2">
                    New orders will appear here.
                  </p>

                </div>

              ) : (

                activeOrders.map((order, index) => (

                  <PriorityOrderCard
                    key={order.id}
                    order={order}
                    priority={index + 1}
                    updateOrderStatus={updateOrderStatus}
                  />

                ))

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}


/* ========================================
   PRIORITY ORDER CARD
======================================== */

function PriorityOrderCard({
  order,
  priority,
  updateOrderStatus,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

        <div className="flex gap-5">

          {/* Priority */}

          <div className="w-16 h-16 rounded-2xl bg-[#075d50] text-white flex flex-col items-center justify-center shrink-0">

            <span className="text-[10px] uppercase text-white/60">
              Priority
            </span>

            <span className="text-2xl font-black text-[#facc15]">
              #{priority}
            </span>

          </div>

          {/* Order */}

          <div>

            <div className="flex items-center gap-3">

              <h3 className="text-2xl font-black tracking-wider">
                {order.id}
              </h3>

              <StatusBadge status={order.status} />

            </div>

            <p className="text-gray-500 mt-2">
              {order.items
                .map(
                  (item) =>
                    `${item.name} × ${item.quantity}`
                )
                .join(" • ")}
            </p>

          </div>

        </div>

        {/* INFO */}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 lg:gap-10">

          <div>
            <p className="text-xs text-gray-400 uppercase">
              Pickup
            </p>

            <p className="font-black mt-1">
              {order.pickupTime}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase">
              Total
            </p>

            <p className="font-black mt-1">
              ₹{order.total}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase">
              Status
            </p>

            <p className="font-black mt-1">
              {order.status}
            </p>
          </div>

        </div>

        {/* ACTION */}

        <div>

          {order.status === "RECEIVED" && (
            <button
              onClick={() =>
                updateOrderStatus(
                  order.id,
                  "PREPARING"
                )
              }
              className="bg-[#075d50] hover:bg-[#064e43] text-white px-5 py-3 rounded-xl font-bold"
            >
              Start Preparing
            </button>
          )}

          {order.status === "PREPARING" && (
            <button
              onClick={() =>
                updateOrderStatus(
                  order.id,
                  "READY"
                )
              }
              className="bg-[#f59e0b] hover:bg-[#d98906] text-white px-5 py-3 rounded-xl font-bold"
            >
              Mark Ready
            </button>
          )}

          {order.status === "READY" && (
            <Link
              to={`/canteen/orders/${order.id}`}
              className="inline-block bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
            >
              Verify Order
            </Link>
          )}

        </div>

      </div>

    </div>
  );
}


/* ========================================
   STATUS
======================================== */

function StatusBadge({ status }) {
  const styles = {
    RECEIVED:
      "bg-blue-50 text-blue-700",

    PREPARING:
      "bg-amber-50 text-amber-700",

    READY:
      "bg-green-50 text-green-700",

    COLLECTED:
      "bg-gray-100 text-gray-600",

    EXPIRED:
      "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        styles[status] || styles.RECEIVED
      }`}
    >
      {status}
    </span>
  );
}


/* ========================================
   STAT CARD
======================================== */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

      <div className="text-[#0f8f73]">
        {icon}
      </div>

      <p className="text-gray-500 text-sm mt-4">
        {label}
      </p>

      <p className="text-2xl font-black mt-1">
        {value}
      </p>

    </div>
  );
}


/* ========================================
   SIDEBAR
======================================== */

function SidebarItem({
  icon,
  text,
  to,
  active,
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active
          ? "bg-white text-[#075d50]"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}

      <span className="font-semibold">
        {text}
      </span>

    </Link>
  );
}