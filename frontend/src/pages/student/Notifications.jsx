import {
  Bell,
  CheckCircle,
  ChefHat,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { notifications } from "../../data/mockData";

export default function Notifications() {
  return (
    <div className="min-h-screen bg-[#f8faf9] p-5 lg:p-10">

      <div className="max-w-4xl mx-auto">

        <div className="flex items-center gap-3">

          <Bell className="text-[#0f8f73]" />

          <h1 className="text-4xl font-black">
            Notifications
          </h1>

        </div>

        <div className="space-y-4 mt-8">

          {notifications.map(
            (notification) => {

              const config = {
                accepted: {
                  icon: CheckCircle,
                  color: "text-green-500",
                },
                preparing: {
                  icon: ChefHat,
                  color: "text-orange-500",
                },
                ready: {
                  icon: CheckCircle,
                  color: "text-green-500",
                },
                expired: {
                  icon: XCircle,
                  color: "text-red-500",
                },
                warning: {
                  icon: AlertTriangle,
                  color: "text-amber-500",
                },
              };

              const item =
                config[notification.type] ||
                config.accepted;

              const Icon = item.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-5 shadow-card flex gap-4 ${
                    !notification.read
                      ? "border-l-4 border-[#0f8f73]"
                      : ""
                  }`}
                >

                  <Icon
                    className={item.color}
                    size={24}
                  />

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <h3 className="font-black">
                        {notification.title}
                      </h3>

                      <span className="text-xs text-gray-400">
                        {notification.time}
                      </span>

                    </div>

                    <p className="text-gray-500 mt-1">
                      {notification.message}
                    </p>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}