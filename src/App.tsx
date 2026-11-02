import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { StoreProvider } from './contexts/StoreContext';
import { InstallProvider } from './contexts/InstallContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Collection } from './pages/Collection';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderStatus } from './pages/OrderStatus';
import { CustomOrder } from './pages/CustomOrder';
import { CustomOrderSuccess } from './pages/CustomOrderSuccess';
import { TrackRequest } from './pages/TrackRequest';
import { Showrooms } from './pages/Showrooms';
import { Account } from './pages/Account';
import { InfoPage } from './pages/InfoPage';
import { Faq } from './pages/Faq';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/Admin';

export function App() {
  return (
    <ThemeProvider>
      <StoreProvider>
        <InstallProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/*" element={<Admin />} />
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="women" element={<Collection gender="WOMEN" />} />
                <Route path="women/:category" element={<Collection gender="WOMEN" />} />
                <Route path="men" element={<Collection gender="MEN" />} />
                <Route path="men/:category" element={<Collection gender="MEN" />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order/:ref" element={<OrderStatus />} />
                <Route path="custom-order" element={<CustomOrder />} />
                <Route path="custom-order/success/:ref" element={<CustomOrderSuccess />} />
                <Route path="track" element={<TrackRequest />} />
                <Route path="showrooms" element={<Showrooms />} />
                <Route path="account" element={<Account />} />
                <Route path="about" element={<InfoPage slug="about" />} />
                <Route path="shipping-returns" element={<InfoPage slug="shipping-returns" />} />
                <Route path="privacy" element={<InfoPage slug="privacy" />} />
                <Route path="terms" element={<InfoPage slug="terms" />} />
                <Route path="faq" element={<Faq />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster position="top-center" toastOptions={{ style: { borderRadius: 0, fontFamily: 'Inter, sans-serif' } }} />
          </BrowserRouter>
        </InstallProvider>
      </StoreProvider>
    </ThemeProvider>);

}