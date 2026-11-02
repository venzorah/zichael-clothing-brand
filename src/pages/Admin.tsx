import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { usePersistentState } from '../hooks/usePersistentState';
import { AdminAccount, AdminGate } from '../components/admin/AdminGate';
import { AdminShell } from '../components/admin/AdminShell';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminProducts } from '../components/admin/AdminProducts';
import { ProductEditor } from '../components/admin/ProductEditor';
import { AdminCategories } from '../components/admin/AdminCategories';
import { AdminContent } from '../components/admin/AdminContent';
import { AdminRequests } from '../components/admin/AdminRequests';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminReservations } from '../components/admin/AdminReservations';
import { AdminOffices } from '../components/admin/AdminOffices';

const SESSION_KEY = 'hoz.adminSession';

export function Admin() {
  const [account, setAccount] = usePersistentState<AdminAccount | null>('hoz.adminAccount', null);
  const [session, setSession] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));

  useEffect(() => {
    document.title = 'Admin | House of Zichael';
  }, []);

  const login = (email: string) => {
    sessionStorage.setItem(SESSION_KEY, email);
    setSession(email);
  };

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  if (!account || session !== account.email) {
    return <AdminGate account={account} onSetup={setAccount} onLogin={login} />;
  }

  return (
    <AdminShell name={account.name} onSignOut={signOut}>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductEditor key="new" />} />
        <Route path="products/:id" element={<ProductEditor />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="offices" element={<AdminOffices />} />
        <Route path="*" element={<AdminOverview />} />
      </Routes>
    </AdminShell>);

}