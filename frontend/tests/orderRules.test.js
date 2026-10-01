import test from "node:test";
import assert from "node:assert/strict";
import { cafes, foods } from "../src/data/mockData.js";
import { canteenAccessCodes } from "../src/data/canteenAccess.js";
import { studentAccount, canteenMember } from "../src/utils/authRules.js";
import { addCartItem, buildOrder, generateOrderId, normalizeStudentEmail, transitionOrder, visibleOrders, orderNotifications } from "../src/utils/orderRules.js";

const available = { pausedCafes: [], disabledFoods: [] };
const student = { role: "student", name: "Test Student", email: "student@banasthali.in" };
const food = foods[0];
const secondCanteenFood = foods.find((item) => item.cafeId !== food.cafeId);
const member = { role: "canteen", email: "member@example.com", cafeId: food.cafeId };
const now = new Date("2026-10-01T12:00:00Z");
const orderInput = { cart: [{ ...food, quantity: 2 }], orders: [], user: student, cafes, foods, availability: available, pickupAt: "2026-10-01T12:20:00Z", now };
const makeOrder = (overrides = {}) => buildOrder({ ...orderInput, ...overrides });

test("directory includes all eight confirmed canteens with distinct menus and name-based test codes", () => {
  assert.deepEqual(cafes.map((cafe) => cafe.name), ["Mukteshwari's Canteen", "Shanu's Canteen", "Spicy Bites", "Annapurna Canteen", "Agarwal Canteen", "Fun 'N' Frolic", "Desi Jayka", "Bella Bite"]);
  for (const cafe of cafes) {
    assert.equal(canteenAccessCodes[cafe.id], cafe.name);
    assert.ok(foods.some((item) => item.cafeId === cafe.id));
  }
  assert.equal(new Set(foods.map((item) => item.id)).size, foods.length);
});
test("student email must match the exact campus domain", () => {
  assert.equal(normalizeStudentEmail(" Student@BANASTHALI.IN "), student.email);
  for (const email of ["student@gmail.com", "student@banasthali.in.evil.com", "student@sub.banasthali.in", "@banasthali.in", "student @banasthali.in"]) {
    assert.throws(() => normalizeStudentEmail(email));
  }
});
test("signup requires a name; login uses the registered email alone", () => {
  assert.throws(() => studentAccount({ email: student.email, register: true, name: " " }, {}), /name/);
  const account = studentAccount({ email: student.email, name: " Test Student ", register: true }, {});
  const users = { [account.email]: account };
  assert.deepEqual(studentAccount({ email: "STUDENT@banasthali.in", register: false }, users), student);
  assert.throws(() => studentAccount({ email: student.email, register: true, name: "Other" }, users), /already registered/);
  assert.throws(() => studentAccount({ email: "unknown@banasthali.in", register: false }, users), /not registered/);
});
test("canteen membership requires a selection, email, and the matching code", () => {
  const credentials = { email: "Member@example.com", cafeId: "bella-bite", secretCode: "Bella Bite" };
  assert.equal(canteenMember(credentials, cafes, canteenAccessCodes).cafeId, "bella-bite");
  assert.throws(() => canteenMember({ ...credentials, cafeId: "" }, cafes, canteenAccessCodes), /Select/);
  assert.throws(() => canteenMember({ ...credentials, email: "invalid" }, cafes, canteenAccessCodes), /valid member email/);
  assert.throws(() => canteenMember({ ...credentials, secretCode: "Spicy Bites" }, cafes, canteenAccessCodes), /Incorrect/);
});
test("cart quantities increase within one canteen and reject mixed canteens", () => {
  const cart = addCartItem([], food, cafes, available);
  assert.equal(addCartItem(cart, food, cafes, available)[0].quantity, 2);
  assert.throws(() => addCartItem(cart, secondCanteenFood, cafes, available), /only one canteen/);
  assert.equal(cart[0].quantity, 1);
});
test("paused canteens and unavailable items cannot be added", () => {
  assert.throws(() => addCartItem([], food, cafes, { ...available, pausedCafes: [food.cafeId] }), /paused/);
  assert.throws(() => addCartItem([], food, cafes, { ...available, disabledFoods: [food.id] }), /unavailable/);
});
test("checkout rechecks availability after items entered the cart", () => {
  assert.throws(() => makeOrder({ availability: { ...available, pausedCafes: [food.cafeId] } }), /paused/);
  assert.throws(() => makeOrder({ availability: { ...available, disabledFoods: [food.id] } }), /unavailable/);
});
test("checkout rejects empty carts, mixed canteens, past pickup, invalid quantities, and invalid roles", () => {
  assert.throws(() => makeOrder({ cart: [] }), /empty/);
  assert.throws(() => makeOrder({ cart: [{ ...food, quantity: 1 }, { ...secondCanteenFood, quantity: 1 }] }), /one canteen/);
  assert.throws(() => makeOrder({ pickupAt: now.toISOString() }), /future pickup/);
  assert.throws(() => makeOrder({ pickupAt: "bad date" }), /future pickup/);
  assert.throws(() => makeOrder({ cart: [{ ...food, quantity: 0 }] }), /quantity/);
  assert.throws(() => makeOrder({ user: member }), /student/);
});
test("test orders preserve ownership, menu prices, pickup, and a three-character ID without charging", () => {
  const order = makeOrder({ cart: [{ ...food, price: 1, quantity: 2 }] });
  assert.match(order.id, /^[A-Z0-9]{3}$/);
  assert.equal(order.studentEmail, student.email);
  assert.equal(order.cafeId, food.cafeId);
  assert.equal(order.total, food.price * 2);
  assert.equal(order.status, "RECEIVED");
  assert.equal(order.paymentStatus, "NOT_REQUIRED_TEST");
  assert.equal(order.pickupAt, new Date(orderInput.pickupAt).toISOString());
});
test("ID generation resolves collisions and reports namespace exhaustion", () => {
  assert.equal(generateOrderId([{ id: "000" }, { id: "001" }], () => 0), "002");
  const full = Array.from({ length: 36 ** 3 }, (_, index) => ({ id: index.toString(36).toUpperCase().padStart(3, "0") }));
  assert.throws(() => generateOrderId(full), /in use/);
});
test("order lifecycle requires acceptance before preparation and staff verification at collection", () => {
  let order = makeOrder();
  for (const status of ["ACCEPTED", "PREPARING", "READY"]) order = transitionOrder(order, member, status, "", now);
  assert.equal(order.history.length, 4);
  assert.throws(() => transitionOrder(order, member, "COLLECTED", "BAD"), /does not match/);
  const collected = transitionOrder(order, member, "COLLECTED", order.id.toLowerCase(), now);
  assert.equal(collected.pickupVerifiedBy, member.email);
  assert.equal(collected.collectedAt, now.toISOString());
  assert.throws(() => transitionOrder(collected, member, "READY"), /cannot move/);
});
test("staff cannot change another canteen's orders or skip states", () => {
  const order = makeOrder();
  assert.throws(() => transitionOrder(order, { ...member, cafeId: secondCanteenFood.cafeId }, "ACCEPTED"), /selected canteen/);
  assert.throws(() => transitionOrder(order, student, "ACCEPTED"), /selected canteen/);
  assert.throws(() => transitionOrder(order, member, "READY"), /cannot move/);
  assert.throws(() => transitionOrder(order, member, "CANCELLED"), /cannot move/);
});

test("students and canteens see only their own orders; admins see all", () => {
  const own = makeOrder();
  const otherStudent = { ...own, id: "AZ1", studentEmail: "other@banasthali.in" };
  const otherCanteen = { ...own, id: "B7J", cafeId: secondCanteenFood.cafeId };
  const all = [own, otherStudent, otherCanteen];
  assert.deepEqual(visibleOrders(all, student), [own, otherCanteen]);
  assert.deepEqual(visibleOrders(all, member), [own, otherStudent]);
  assert.deepEqual(visibleOrders(all, { role: "admin" }), all);
  assert.deepEqual(visibleOrders(all, null), []);
});

test("readiness creates a persisted notification only for the owning student's order", () => {
  let order = makeOrder();
  assert.deepEqual(orderNotifications([order]), []);
  for (const status of ["ACCEPTED", "PREPARING", "READY"]) order = transitionOrder(order, member, status, "", now);
  const notifications = orderNotifications(visibleOrders([order], student));
  assert.equal(notifications.length, 2);
  const ready = notifications.find((item) => item.title === "Ready for pickup");
  assert.equal(ready.orderId, order.id);
  assert.match(ready.message, /prepared/);
  assert.deepEqual(orderNotifications(visibleOrders([order], { ...student, email: "other@banasthali.in" })), []);
});

test("pausing new orders does not stop fulfillment of an existing order", () => {
  const order = makeOrder();
  assert.throws(() => makeOrder({ availability: { ...available, pausedCafes: [food.cafeId] } }), /paused/);
  assert.equal(transitionOrder(order, member, "ACCEPTED", "", now).status, "ACCEPTED");
});
