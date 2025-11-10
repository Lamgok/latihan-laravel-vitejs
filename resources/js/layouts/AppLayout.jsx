import React from "react";
import { Link, router } from "@inertiajs/react"; // Pastikan 'router' diimport
import { Button } from "@/components/ui/button";

export default function AppLayout({ children, auth }) {
    const onLogout = () => {
        router.get(route("auth.logout")); // Menggunakan route helper
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="border-b bg-card py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link
                        href={route("app.todos")}
                        className="text-xl font-bold text-primary"
                    >
                        TodoApp
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href={route("app.todos")} as="button">
                            <Button variant="ghost">Todos</Button>
                        </Link>
                        {/* Tombol Logout */}
                        {auth?.user ? (
                            <Button onClick={onLogout} variant="outline">
                                Logout ({auth.user.name})
                            </Button>
                        ) : (
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
