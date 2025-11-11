import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
// Import fungsi route dari Ziggy
import { route } from "ziggy-js";

createInertiaApp({
    // Menambahkan title untuk memastikan Inertia berfungsi normal
    title: (title) => (title ? `${title} - ${APP_NAME}` : APP_NAME),
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        // PERBAIKAN UTAMA: Mendefinisikan route() di window dengan parameter Ziggy yang dimuat dari Blade.
        // Data rute Ziggy (@routes) disimpan oleh Laravel di props Inertia pada objek global.
        if (typeof window !== "undefined") {
            // Kita harus memastikan route() menerima data routing dari Inertia.props
            window.route = (name, params, absolute) =>
                route(name, params, absolute, {
                    ...props.initialPage.props.ziggy, // Mengambil data rute Ziggy yang di-share melalui Inertia
                    location: new URL(props.initialPage.url),
                }).url();
        }

        createRoot(el).render(<App {...props} />);
    },
});

const APP_NAME = import.meta.env.VITE_APP_NAME || "Laravel";
