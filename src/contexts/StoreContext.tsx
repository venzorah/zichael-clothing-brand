import React, { createContext, useContext, useMemo } from 'react';
import { categories as seedCategories, products as seedProducts } from '../data/products';
import { offices as seedOffices } from '../data/offices';
import { defaultSiteContent } from '../data/content';
import { usePersistentState } from '../hooks/usePersistentState';
import { Category, Gender, Office, Product } from '../types/catalog';
import { SiteContent } from '../types/content';
import { CartItem, CustomRequest, CustomerUser, Order, Reservation } from '../types/commerce';

interface StoreValue {
  products: Product[];
  updateProduct: (id: string, patch: Partial<Product>) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  saveCategory: (category: Category) => void;
  deleteCategory: (slug: string) => void;
  content: SiteContent;
  saveContent: (content: SiteContent) => void;
  resetContent: () => void;
  offices: Office[];
  saveOffice: (office: Office) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'key'>) => void;
  updateQty: (key: string, qty: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  saved: string[];
  toggleSaved: (productId: string) => void;
  orders: Order[];
  placeOrder: (order: Order) => void;
  updateOrder: (ref: string, patch: Partial<Order>) => void;
  requests: CustomRequest[];
  submitRequest: (req: CustomRequest) => void;
  updateRequest: (ref: string, patch: Partial<CustomRequest>, statusNote?: string) => void;
  reservations: Reservation[];
  createReservation: (r: Reservation) => void;
  updateReservation: (ref: string, patch: Partial<Reservation>) => void;
  lastCollection: Gender;
  setLastCollection: (g: Gender) => void;
  user: CustomerUser | null;
  signIn: (u: CustomerUser) => void;
  signOut: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [products, setProducts] = usePersistentState<Product[]>('hoz.products.v2', seedProducts);
  const [categories, setCategories] = usePersistentState<Category[]>('hoz.categories.v1', seedCategories);
  const [content, setContent] = usePersistentState<SiteContent>('hoz.content.v1', defaultSiteContent);
  const [offices, setOffices] = usePersistentState<Office[]>('hoz.offices.v1', seedOffices);
  const [cart, setCart] = usePersistentState<CartItem[]>('hoz.cart', []);
  const [saved, setSaved] = usePersistentState<string[]>('hoz.saved', []);
  const [orders, setOrders] = usePersistentState<Order[]>('hoz.orders', []);
  const [requests, setRequests] = usePersistentState<CustomRequest[]>('hoz.requests', []);
  const [reservations, setReservations] = usePersistentState<Reservation[]>('hoz.reservations', []);
  const [lastCollection, setLastCollection] = usePersistentState<Gender>('hoz.collection', 'WOMEN');
  const [user, setUser] = usePersistentState<CustomerUser | null>('hoz.user', null);

  const value = useMemo<StoreValue>(() => {
    const now = () => new Date().toISOString();
    return {
      products,
      updateProduct: (id, patch) => setProducts((ps) => ps.map((p) => p.id === id ? { ...p, ...patch } : p)),
      saveProduct: (product) =>
      setProducts((ps) => ps.some((p) => p.id === product.id) ? ps.map((p) => p.id === product.id ? product : p) : [product, ...ps]),
      deleteProduct: (id) => {
        setProducts((ps) => ps.filter((p) => p.id !== id));
        setCart((c) => c.filter((i) => i.productId !== id));
        setSaved((s) => s.filter((x) => x !== id));
      },
      categories,
      saveCategory: (category) =>
      setCategories((cs) => cs.some((c) => c.slug === category.slug) ? cs.map((c) => c.slug === category.slug ? category : c) : [...cs, category]),
      deleteCategory: (slug) => setCategories((cs) => cs.filter((c) => c.slug !== slug)),
      content,
      saveContent: setContent,
      resetContent: () => setContent(defaultSiteContent),
      offices,
      saveOffice: (office) =>
      setOffices((os) => os.some((o) => o.id === office.id) ? os.map((o) => o.id === office.id ? office : o) : [...os, office]),
      cart,
      cartCount: cart.reduce((n, i) => n + i.qty, 0),
      addToCart: (item) => {
        const key = `${item.productId}|${item.size}|${item.colour}`;
        setCart((c) => {
          const existing = c.find((i) => i.key === key);
          if (existing) return c.map((i) => i.key === key ? { ...i, qty: Math.min(10, i.qty + item.qty) } : i);
          return [...c, { ...item, key }];
        });
      },
      updateQty: (key, qty) => setCart((c) => c.map((i) => i.key === key ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)),
      removeFromCart: (key) => setCart((c) => c.filter((i) => i.key !== key)),
      clearCart: () => setCart([]),
      saved,
      toggleSaved: (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]),
      orders,
      placeOrder: (order) => setOrders((o) => [order, ...o]),
      updateOrder: (ref, patch) => setOrders((os) => os.map((o) => o.ref === ref ? { ...o, ...patch } : o)),
      requests,
      submitRequest: (req) => setRequests((r) => [req, ...r]),
      updateRequest: (ref, patch, statusNote) =>
      setRequests((rs) =>
      rs.map((r) => {
        if (r.ref !== ref) return r;
        const next = { ...r, ...patch };
        if (patch.status && patch.status !== r.status) {
          next.history = [...r.history, { status: patch.status, at: now(), note: statusNote }];
        }
        return next;
      })
      ),
      reservations,
      createReservation: (r) => setReservations((rs) => [r, ...rs]),
      updateReservation: (ref, patch) =>
      setReservations((rs) =>
      rs.map((r) => {
        if (r.ref !== ref) return r;
        const next = { ...r, ...patch };
        if (patch.status && patch.status !== r.status) next.history = [...r.history, { status: patch.status, at: now() }];
        return next;
      })
      ),
      lastCollection,
      setLastCollection,
      user,
      signIn: setUser,
      signOut: () => setUser(null)
    };
  }, [products, categories, content, offices, cart, saved, orders, requests, reservations, lastCollection, user, setProducts, setCategories, setContent, setOffices, setCart, setSaved, setOrders, setRequests, setReservations, setLastCollection, setUser]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}