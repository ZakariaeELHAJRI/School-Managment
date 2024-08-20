// components/RootLayout.js
'use client';

import React, { useState } from "react";
import { Provider } from "react-redux";
import { Tajawal } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css';
import '../../styles/theme.scss';
import "./globals.css";
import 'simplebar/dist/simplebar.min.css';
import NavbarVertical from "@/layouts/navbar/NavbarVertical";
import NavbarTop from "@/layouts/navbar/NavbarTop";
import { store } from "../../store/store";


const tajawal = Tajawal({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900']
});
function Layout({ children }) {
  const [showMenu, setShowMenu] = useState(true);


  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <html lang="en" dir="rtl">

      <body className={tajawal.className}>
        <div id="db-wrapper" className={`${showMenu ? '' : 'toggled'}`}>
          <div className="navbar-vertical navbar">
            <NavbarVertical
              showMenu={showMenu}
              onClick={(value) => setShowMenu(value)}
            />
          </div>
          <main id="page-content" dir="rtl">
            <header className="header">
              <NavbarTop
                data={{
                  showMenu: showMenu,
                  SidebarToggleMenu: ToggleMenu
                }}
              />
            </header>
            <section className="container-fluid p-4">
             
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}

function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <Layout>
        {children}
      </Layout>
    </Provider>
  );
}

export default RootLayout;
