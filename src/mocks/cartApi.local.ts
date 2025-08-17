import { CartApi, CartItem, CartSnapshot } from "@mfe/contracts";

const initialProducts: CartItem[] = [
  {
    id: "1",
    name: "Teclado Gamer",
    price: 100.0,
    qty: 1,
  },
  {
    id: "2",
    name: "Mouse sem fio",
    price: 80.0,
    qty: 2,
  },
];

let snap: CartSnapshot = { items: initialProducts, total: 260, count: 2 };
const listeners = new Set<(s: CartSnapshot) => void>();
const emit = () => listeners.forEach((l) => l(snap));

export const cartApi: CartApi = {
  getSnapshot: () => snap,
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  addToCart(item) {
    snap = {
      ...snap,
      items: snap.items.map((i) =>
        i.id == item.id ? { ...i, qty: i.qty + 1 } : i
      ),
      total: snap.total + (item.price ?? 0),
    };
    emit();
  },
  removeFromCart(id) {
    const nextItems = snap.items.filter((i) => i.id !== id);
    const removed = snap.items.find((i) => i.id === id);
    snap = {
      items: nextItems,
      count: nextItems.length,
      total: snap.total - (removed ? removed.price * removed.qty : 0),
    };
    emit();
  },
  clear() {
    snap = { items: [], total: 0, count: 0 };
    emit();
  },
};
export default cartApi;
