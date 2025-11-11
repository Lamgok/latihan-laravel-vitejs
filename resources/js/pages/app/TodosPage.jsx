import React from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
// Hapus impor { route } dari "ziggy-js"

export default function AppLayout({ children, auth }) {
    const onLogout = () => {
        // Menggunakan POST untuk logout yang lebih aman
        router.post(route("auth.logout"));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link
                        // Menggunakan fungsi route() global
                        href={route("app.todos")}
                        className="text-xl font-bold text-primary"
                    >
                        TodoApp
                    </Link>
                    <div className="flex items-center space-x-4">
                        {/* Link ke halaman Todos */}
                        <Link href={route("app.todos")} as="button">
                            <Button variant="ghost">Todos</Button>
                        </Link>
                        {/* Tombol Logout/Login */}
                        {auth?.user ? (
                            <Button onClick={onLogout} variant="outline">
                                Logout ({auth.user.name})
                            </Button>
                        ) : (
                            // Link ke halaman login
                            <Link href={route("auth.login")} as="button">
                                <Button>Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-card py-6">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    &copy; 2025 Delcom Labs. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
