import { useState } from "react";
import {
  ChefHat,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Mail,
  Lock,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    id: "student",
    name: "Student",
    icon: GraduationCap,
    description: "Order food and track your pickup",
  },
  {
    id: "canteen",
    name: "Canteen",
    icon: ChefHat,
    description: "Manage orders and prepare food",
  },
  {
    id: "admin",
    name: "Admin",
    icon: ShieldCheck,
    description: "Manage the CampusEats platform",
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState("student");

  const { login } = useAuth();
  const navigate = useNavigate();

  const selectedUser = {
    student: {
      email: "student@college.edu",
      password: "student123",
    },
    canteen: {
      email: "canteen@college.edu",
      password: "canteen123",
    },
    admin: {
      email: "admin@campuseats.com",
      password: "admin123",
    },
  };

  const [email, setEmail] = useState(
    selectedUser.student.email
  );

  const [password, setPassword] = useState(
    selectedUser.student.password
  );

  const handleRoleChange = (role) => {
    setSelectedRole(role);

    setEmail(selectedUser[role].email);
    setPassword(selectedUser[role].password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = login(selectedRole);

    navigate(`/${user.role}`);
  };

  const handleDemoLogin = (role) => {
    const user = login(role);

    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen bg-[#075d50] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-6xl bg-white rounded-[30px] overflow-hidden shadow-2xl grid lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="relative bg-[#075d50] text-white p-8 sm:p-12 lg:p-14 min-h-[650px] flex flex-col justify-between overflow-hidden">

          {/* Decorative circles */}

          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#0f8f73] opacity-40" />

          <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[#0b695b] opacity-50" />

          {/* Logo */}

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-[#facc15] text-[#075d50] flex items-center justify-center font-black text-lg">
                CE
              </div>

              <div className="text-2xl font-black">
                Campus
                <span className="text-[#facc15]">
                  Eats
                </span>
              </div>

            </div>

          </div>

          {/* Hero content */}

          <div className="relative z-10 my-12">

            <p className="text-[#facc15] uppercase tracking-[0.2em] text-xs font-bold">
              College Food Ordering
            </p>

            <h1 className="text-4xl sm:text-5xl font-black leading-[1.08] mt-5">
              Order ahead.
              <br />
              Reach on time.
              <br />
              Pick up without waiting.
            </h1>

            <p className="text-white/70 max-w-md mt-6 text-base leading-relaxed">
              Skip the canteen queue and order your
              favourite campus food before you arrive.
            </p>

          </div>

          {/* Bottom feature */}

          <div className="relative z-10 grid grid-cols-3 gap-3">

            <Feature
              number="01"
              text="Choose food"
            />

            <Feature
              number="02"
              text="Schedule pickup"
            />

            <Feature
              number="03"
              text="Collect"
            />

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="p-7 sm:p-10 lg:p-14">

          {/* Header */}

          <div>

            <p className="text-[#0f8f73] font-bold text-sm uppercase tracking-wider">
              Welcome back
            </p>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Welcome to CampusEats
            </h2>

            <p className="text-gray-500 mt-2">
              Order ahead. Reach on time. Pick up without
              waiting.
            </p>

          </div>

          {/* =================================================
              ROLE SELECTOR
          ================================================== */}

          <div className="mt-8">

            <p className="text-sm font-bold text-gray-700 mb-3">
              Continue as
            </p>

            <div className="grid grid-cols-3 gap-3">

              {roles.map((role) => {

                const Icon = role.icon;

                const isSelected =
                  selectedRole === role.id;

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() =>
                      handleRoleChange(role.id)
                    }
                    className={`
                      relative
                      rounded-2xl
                      border-2
                      p-4
                      transition-all
                      duration-200
                      text-center
                      ${
                        isSelected
                          ? "border-[#0f8f73] bg-[#ecfdf7] shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }
                    `}
                  >

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0f8f73]" />
                    )}

                    <div
                      className={`
                        mx-auto
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${
                          isSelected
                            ? "bg-[#0f8f73] text-white"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      <Icon size={19} />
                    </div>

                    <p className="font-bold text-sm mt-3">
                      {role.name}
                    </p>

                  </button>
                );
              })}

            </div>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                {selectedRole === "student"
                  ? "College Email / Student ID"
                  : selectedRole === "canteen"
                  ? "Canteen ID"
                  : "Admin ID"}
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder={
                    selectedUser[selectedRole].email
                  }
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-[#0f8f73] focus:ring-2 focus:ring-[#0f8f73]/10 transition"
                />

              </div>

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-[#0f8f73] focus:ring-2 focus:ring-[#0f8f73]/10 transition"
                />

              </div>

            </div>

            {/* Selected role */}

            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">

              <div>

                <p className="text-xs text-gray-500">
                  Selected role
                </p>

                <p className="font-bold text-gray-900">
                  {selectedRole.charAt(0).toUpperCase() +
                    selectedRole.slice(1)}
                </p>

              </div>

              <span className="text-xs font-bold text-[#0f8f73] bg-[#ecfdf7] px-3 py-1.5 rounded-full">
                Demo Mode
              </span>

            </div>

            {/* Login button */}

            <button
              type="submit"
              className="w-full bg-[#0f8f73] hover:bg-[#08765f] text-white rounded-xl py-3.5 font-black flex items-center justify-center gap-2 transition"
            >

              Login as{" "}
              {selectedRole.charAt(0).toUpperCase() +
                selectedRole.slice(1)}

              <ArrowRight size={18} />

            </button>

          </form>

          {/* =================================================
              DEMO ACCOUNTS
          ================================================== */}

          <div className="mt-8">

            <div className="flex items-center gap-3">

              <div className="h-px bg-gray-200 flex-1" />

              <span className="text-xs font-bold text-gray-400 uppercase">
                Quick Demo
              </span>

              <div className="h-px bg-gray-200 flex-1" />

            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">

              <DemoButton
                label="Student"
                email="student@college.edu"
                onClick={() =>
                  handleDemoLogin("student")
                }
              />

              <DemoButton
                label="Canteen"
                email="canteen@college.edu"
                onClick={() =>
                  handleDemoLogin("canteen")
                }
              />

              <DemoButton
                label="Admin"
                email="admin@campuseats.com"
                onClick={() =>
                  handleDemoLogin("admin")
                }
              />

            </div>

          </div>

          {/* Footer */}

          <p className="text-center text-xs text-gray-400 mt-8">
            CampusEats • College Café Pickup Platform
          </p>

        </div>

      </div>

    </div>
  );
}

/* ============================================================
   SMALL COMPONENTS
============================================================ */

function Feature({ number, text }) {
  return (
    <div className="border border-white/10 bg-white/5 rounded-xl p-3">

      <p className="text-[#facc15] text-xs font-black">
        {number}
      </p>

      <p className="text-xs text-white/70 mt-1">
        {text}
      </p>

    </div>
  );
}

function DemoButton({
  label,
  email,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-gray-200 rounded-xl p-3 text-left hover:border-[#0f8f73] hover:bg-[#ecfdf7] transition"
    >

      <p className="text-sm font-black text-gray-900">
        {label}
      </p>

      <p className="text-[10px] text-gray-400 mt-1 truncate">
        {email}
      </p>

    </button>
  );
}