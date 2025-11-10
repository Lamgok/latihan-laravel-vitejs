import React, { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast"; // Assuming you set up react-hot-toast in a previous step

export default function TodosPage({ todos, auth, success }) {
    // --- State untuk tambah todo baru ---
    const { data, setData, post, processing, errors, reset } = useForm({
        task: "",
    });

    const handleStore = (e) => {
        e.preventDefault();
        post(route("app.todos.store"), {
            onSuccess: () => {
                toast.success(success || "Todo berhasil ditambahkan!");
                reset("task");
            },
            onError: () => {
                toast.error("Gagal menambahkan todo. Periksa input.");
            },
        });
    };

    // --- Logic Update Status ---
    const handleUpdateStatus = (todo) => {
        router.put(
            route("app.todos.update_status", todo.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        `Status todo diubah menjadi ${
                            todo.is_completed ? "Belum Selesai" : "Selesai"
                        }!`
                    );
                },
                onError: () => {
                    toast.error("Gagal mengubah status todo.");
                },
            }
        );
    };

    // --- Logic Delete ---
    const handleDelete = (todo) => {
        if (confirm("Apakah Anda yakin ingin menghapus todo ini?")) {
            router.delete(route("app.todos.destroy", todo.id), {
                onSuccess: () => {
                    toast.success("Todo berhasil dihapus!");
                },
                onError: () => {
                    toast.error("Gagal menghapus todo.");
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Todos" />
            <div className="container mx-auto py-10">
                <div className="max-w-xl mx-auto space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Todos</CardTitle>
                            <CardDescription>
                                Kelola daftar tugas harian Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Formulir Tambah Todo */}
                            <form
                                onSubmit={handleStore}
                                className="flex space-x-2 mb-6"
                            >
                                <Input
                                    id="task"
                                    type="text"
                                    placeholder="Apa yang perlu Anda lakukan?"
                                    value={data.task}
                                    onChange={(e) =>
                                        setData("task", e.target.value)
                                    }
                                    required
                                    disabled={processing}
                                    className={
                                        errors.task ? "border-red-500" : ""
                                    }
                                />
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing ? "Menyimpan..." : "Tambah"}
                                </Button>
                            </form>
                            {errors.task && (
                                <div className="text-sm text-red-500 mb-3">
                                    {errors.task}
                                </div>
                            )}

                            {/* Daftar Todos */}
                            <div className="space-y-3">
                                {todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className="flex items-center justify-between p-3 border rounded-lg transition-all hover:bg-muted/50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`todo-${todo.id}`}
                                                checked={todo.is_completed}
                                                onCheckedChange={() =>
                                                    handleUpdateStatus(todo)
                                                }
                                            />
                                            <label
                                                htmlFor={`todo-${todo.id}`}
                                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                    todo.is_completed
                                                        ? "line-through text-muted-foreground"
                                                        : ""
                                                }`}
                                            >
                                                {todo.task}
                                            </label>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(todo)}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                ))}

                                {todos.length === 0 && (
                                    <p className="text-center text-muted-foreground">
                                        Tidak ada todo. Mari buat yang pertama!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
