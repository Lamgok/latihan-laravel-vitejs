import React from "react";
import { Link, Head, useForm } from "@inertiajs/react";
// import { route } from "ziggy-js"; // Fungsi route() sudah global
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";

export default function RegisterPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // Menggunakan fungsi route() global
        post(route("auth.register.post"), {
            onSuccess: () => {
                reset("password");
            },
        });
    };

    return (
        <AuthLayout>
            <Head title="Daftar" />
            <div className="container mx-auto px-4 py-8">
                <div className="w-[360px] mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Akun</CardTitle>
                            <CardDescription>
                                Buat akun baru untuk mulai mengelola todo Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Nama Lengkap
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Masukkan nama Anda"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-sm text-red-600">
                                                {errors.name}
                                            </div>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contoh@email.com"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                        {errors.email && (
                                            <div className="text-sm text-red-600">
                                                {errors.email}
                                            </div>
                                        )}
                                    </Field>
                                    <Field>
                                        <div>
                                            <FieldLabel htmlFor="password">
                                                Kata Sandi
                                            </FieldLabel>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Masukkan kata sandi"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.password && (
                                            <div className="text-sm text-red-600">
                                                {errors.password}
                                            </div>
                                        )}
                                    </Field>
                                    <Field>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Daftar"}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            Sudah punya akun?{" "}
                                            {/* Menggunakan fungsi route() global */}
                                            <Link
                                                href={route("auth.login")}
                                                className="text-primary hover:underline"
                                            >
                                                Masuk di sini
                                            </Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthLayout>
    );
}
