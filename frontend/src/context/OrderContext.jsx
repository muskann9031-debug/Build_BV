import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("campusEatsOrders");

    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("campusEatsCart");

    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "campusEatsOrders",
      JSON.stringify(orders)
    );
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(
      "campusEatsCart",
      JSON.stringify(cart)
    );
  }, [cart]);

  const addToCart = (food) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === food.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = ({
    cafeId,
    cafeName,
    pickupTime,
    expiryTime,
    paymentMethod,
  }) => {
    const token = Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase();

    const total = cart.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

    const newOrder = {
      id: token,
      cafeId,
      cafeName,
      items: cart.map((item) => ({
        foodId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total,
      pickupTime,
      expiryTime,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: "RECEIVED",
    };

    setOrders((current) => [
      newOrder,
      ...current,
    ]);

    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}