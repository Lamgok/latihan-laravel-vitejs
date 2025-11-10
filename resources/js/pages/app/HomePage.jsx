import React, { useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
// Import Card, etc. jika masih dibutuhkan untuk tampilan default

export default function HomePage({ auth, technologies }) {
    // Redirect langsung ke halaman todos setelah login
    useEffect(() => {
        router.get(route("app.todos"));
    }, []);

    // Tampilkan loading atau elemen sementara
    return (
        <AppLayout auth={auth}>
            <Head title="Home" />
            <div className="container mx-auto py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">
                        Memuat daftar Todos...
                    </h1>
                </div>
            </div>
        </AppLayout>
    );
}
