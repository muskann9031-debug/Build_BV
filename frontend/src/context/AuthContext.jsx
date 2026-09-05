import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const demoUsers = {
  student: {
    email: "student@college.edu",
    password: "student123",
    name: "Tanu Verma",
    role: "student",
    course: "CSE",
    year: "3rd Year",
  },

  canteen: {
    email: "canteen@college.edu",
    password: "canteen123",
    name: "Central Café",
    role: "canteen",
  },

  admin: {
    email: "admin@campuseats.com",
    password: "admin123",
    name: "CampusEats Admin",
    role: "admin",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("campusEatsUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    const demoUser = demoUsers[role];

    localStorage.setItem(
      "campusEatsUser",
      JSON.stringify(demoUser)
    );

    setUser(demoUser);

    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem("campusEatsUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}