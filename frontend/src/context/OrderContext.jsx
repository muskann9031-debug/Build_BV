/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { cafes as directory, foods } from "../data/mockData";
import { readStoredValue, usePersistentState } from "../hooks/usePersistentState";
import { addCartItem, assertAvailable, buildOrder, transitionOrder, visibleOrders, orderNotifications } from "../utils/orderRules";

const OrderContext = createContext();
const emptyOrders = [];
const emptyCarts = {};
const defaultAvailability = { pausedCafes: [], disabledFoods: [] };

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [allOrders, setOrders] = usePersistentState("campusEatsOrdersV2", emptyOrders);
  const [carts, setCarts] = usePersistentState("campusEatsCartsV2", emptyCarts);
  const [availability, setAvailability] = usePersistentState("campusEatsAvailabilityV2", defaultAvailability);
  const [notice, setNotice] = useState("");
  const cart = user?.role === "student" ? (carts[user.email] || []) : [];
  const orders = visibleOrders(allOrders, user);
  const cafes = directory.map((cafe) => ({ ...cafe, status: availability.pausedCafes.includes(cafe.id) ? "Paused" : "Open" }));
  const isFoodAvailable = (food) => !availability.pausedCafes.includes(food.cafeId) && !availability.disabledFoods.includes(food.id);
  const requireStudent = () => {
    if (user?.role !== "student") throw new Error("Sign in as a student to manage a cart.");
  };
  const changeCart = (update) => {
    requireStudent();
    setCarts((current) => ({ ...current, [user.email]: update(current[user.email] || []) }));
  };
  const addToCart = (food) => {
    try {
      const menuFood = foods.find((item) => item.id === food.id);
      if (!menuFood) throw new Error("This item is not on the menu.");
      changeCart((current) => addCartItem(current, menuFood, directory, readStoredValue("campusEatsAvailabilityV2", defaultAvailability)));
      setNotice(`${food.name} added to your cart.`);
    } catch (error) { setNotice(error.message); }
  };
  const removeFromCart = (id) => changeCart((current) => current.filter((item) => item.id !== id));
  const clearCart = () => changeCart(() => []);
  const updateQuantity = (id, quantity) => {
    try {
      if (!Number.isInteger(quantity)) throw new Error("Enter a valid quantity.");
      changeCart((current) => current.flatMap((item) => {
        if (item.id !== id) return [item];
        if (quantity <= 0) return [];
        if (quantity > item.quantity) assertAvailable(item, directory, readStoredValue("campusEatsAvailabilityV2", defaultAvailability));
        return [{ ...item, quantity }];
      }));
    } catch (error) { setNotice(error.message); }
  };
  const createOrder = ({ pickupAt }) => {
    let created;
    setOrders((current) => {
      const latestCart = readStoredValue("campusEatsCartsV2", emptyCarts)[user?.email] || [];
      const latestAvailability = readStoredValue("campusEatsAvailabilityV2", defaultAvailability);
      created = buildOrder({ cart: latestCart, orders: current, user, cafes: directory, foods, availability: latestAvailability, pickupAt });
      return [created, ...current];
    });
    clearCart();
    return created;
  };
  const updateOrderStatus = (id, status, pickupCode) => {
    setOrders((current) => {
      const order = current.find((item) => item.id === id);
      if (!order) throw new Error("Order not found.");
      const updated = transitionOrder(order, user, status, pickupCode);
      return current.map((item) => item.id === id ? updated : item);
    });
  };
  const requireCanteen = () => {
    if (user?.role !== "canteen" || !directory.some((cafe) => cafe.id === user.cafeId)) {
      throw new Error("Sign in for a canteen to manage availability.");
    }
  };
  const toggleOrders = () => {
    requireCanteen();
    setAvailability((current) => ({ ...current, pausedCafes: current.pausedCafes.includes(user.cafeId)
      ? current.pausedCafes.filter((id) => id !== user.cafeId) : [...current.pausedCafes, user.cafeId] }));
  };
  const toggleFood = (id) => {
    requireCanteen();
    if (!foods.some((food) => food.id === id && food.cafeId === user.cafeId)) throw new Error("You can only manage your canteen's menu.");
    setAvailability((current) => ({ ...current, disabledFoods: current.disabledFoods.includes(id)
      ? current.disabledFoods.filter((foodId) => foodId !== id) : [...current.disabledFoods, id] }));
  };
  const notifications = orderNotifications(orders);

  return (
    <OrderContext.Provider value={{ orders, cart, cafes, foods, availability, notifications, isFoodAvailable,
      addToCart, updateQuantity, removeFromCart, clearCart, createOrder, updateOrderStatus, toggleOrders, toggleFood }}>
      {children}
      {notice && <div role="status" className="fixed bottom-20 left-5 right-5 z-50 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-xl bg-[#075d50] p-4 text-white shadow-xl">
        <p>{notice}</p><button aria-label="Dismiss message" onClick={() => setNotice("")} className="rounded border border-white/30 px-3 py-1">Close</button>
      </div>}
    </OrderContext.Provider>
  );
}
export function useOrders() { return useContext(OrderContext); }
