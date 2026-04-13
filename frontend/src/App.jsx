import Home from "./pages/Home";
import React, { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import AOS from "aos";
import "aos/dist/aos.css";
import "hover.css/css/hover-min.css";
import "./App.css";
import Layout from "./Layout";
import Privacy from "./pages/Privacy";
import ReadMore from "./pages/ReadMore";
import Blog from "./pages/Blog";
import Storelocation from "./pages/Storelocation";
import Product from "./pages/Product";
import Collections from "./pages/Collections";
import Showmore from "./pages/Showmore";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Scroll from "./pages/Scroll";
import Profile from "./pages/Profile";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Faq from "./pages/Faq";
import Term from "./pages/Term";
import Buynow from "./pages/Buynow";
import Whishlist from "./pages/Whishlist";
import Offers from "./pages/Offers";
import Man from "./pages/Man";
import FilterPage from "./pages/FilterPage";
import SearchResults from "./pages/SearchResults";
import Splashscreen from "./Splashscreen";
import { WishlistProvider } from "./Context/WhishlistContext";
import { CartProvider } from "./Context/CartContext";
import { BuynowProvider } from "./Context/BuynowContext";
import Cartoffacnvas from "./Cartoffacnvas";

// Get Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkSetupMessage = () => (
  <div style={{ padding: '40px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
    <h2 style={{ color: '#dc3545' }}>🔐 Clerk Not Configured</h2>
    <p style={{ marginTop: '16px' }}>
      Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to <code>frontend/.env</code> to enable authentication.
      Get your key at <a href="https://clerk.com" target="_blank" rel="noopener noreferrer">clerk.com</a>.
    </p>
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  // Check if Clerk is configured with a valid key
  const isClerkConfigured = clerkPubKey && 
    clerkPubKey !== 'your_clerk_publishable_key_here' && 
    clerkPubKey.startsWith('pk_');

  if (!isClerkConfigured) {
    console.warn('⚠️ Clerk not configured. Add VITE_CLERK_PUBLISHABLE_KEY to frontend/.env');
  }

  return (
    <>
      {showSplash ? (
        <Splashscreen />
      ) : isClerkConfigured ? (
        // Clerk is configured - use authentication
        <ClerkProvider publishableKey={clerkPubKey}>
          <BrowserRouter>
            <WishlistProvider>
              <BuynowProvider>
                <CartProvider>
                  <Cartoffacnvas />
                  <Routes>
                    {/* Main Routes - Inside Layout */}
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="sign-in/*" element={<SignInPage />} />
                      <Route path="sign-up/*" element={<SignUpPage />} />
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="readmore" element={<ReadMore />} />
                      <Route path="storelocation" element={<Storelocation />} />
                      <Route path="product/:id" element={<Product />} />
                      <Route path="collections" element={<Collections />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="showmore" element={<Showmore />} />
                      <Route path="aboutus" element={<About />} />
                      <Route path="faqpage" element={<Faq />} />
                      <Route path="term" element={<Term />} />
                      <Route path="buynow" element={<Buynow />} />
                      <Route path="wishlist" element={<Whishlist />} />
                      <Route path="offers" element={<Offers />} />
                      <Route path="man" element={<Man />} />
                      <Route path="filter/:type/:value" element={<FilterPage />} />
                      <Route path="search" element={<SearchResults />} />
                      <Route 
                        path="profile" 
                        element={
                          <>
                            <SignedIn>
                              <Profile />
                            </SignedIn>
                            <SignedOut>
                              <RedirectToSignIn />
                            </SignedOut>
                          </>
                        } 
                      />
                    </Route>
                  </Routes>
                </CartProvider>
              </BuynowProvider>
            </WishlistProvider>
            <Scroll />
          </BrowserRouter>
        </ClerkProvider>
      ) : (
        // Clerk not configured - show all pages without auth
        <BrowserRouter>
          <WishlistProvider>
            <BuynowProvider>
              <CartProvider>
                <Cartoffacnvas />
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="privacy" element={<Privacy />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="readmore" element={<ReadMore />} />
                    <Route path="storelocation" element={<Storelocation />} />
                    <Route path="product/:id" element={<Product />} />
                    <Route path="collections" element={<Collections />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="showmore" element={<Showmore />} />
                    <Route path="aboutus" element={<About />} />
                    <Route path="faqpage" element={<Faq />} />
                    <Route path="term" element={<Term />} />
                    <Route path="buynow" element={<Buynow />} />
                    <Route path="wishlist" element={<Whishlist />} />
                    <Route path="offers" element={<Offers />} />
                    <Route path="man" element={<Man />} />
                    <Route path="filter/:type/:value" element={<FilterPage />} />
                    <Route path="search" element={<SearchResults />} />
                    
                    {/* Sign In/Up Routes - Show setup message */}
                    <Route path="sign-in" element={<ClerkSetupMessage />} />
                    <Route path="sign-up" element={<ClerkSetupMessage />} />
                    <Route path="profile" element={<ClerkSetupMessage />} />
                  </Route>
                </Routes>
              </CartProvider>
            </BuynowProvider>
          </WishlistProvider>
          <Scroll />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
