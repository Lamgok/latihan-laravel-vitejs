import React, { useState, useEffect } from "react";
import { usePage, useForm, router, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import {
    CheckCircle2,
    Circle,
    Trash2,
    Edit,
    Plus,
    Search,
    ImageIcon,
} from "lucide-react";
// Import komponen Trix Editor yang baru
import TrixEditor from "@/components/TrixEditor"; // <-- BARIS BARU

// --- Komponen Sub: Todo Item ---
const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg mb-3 bg-card hover:shadow-sm transition-all">
            <div className="flex items-start gap-3">
                <button onClick={() => onToggleStatus(todo)} className="mt-1">
                    {todo.is_finished ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                </button>
                <div className="flex gap-3">
                    {todo.cover_url && (
                        <img
                            src={todo.cover_url}
                            alt={todo.title}
                            className="w-16 h-16 object-cover rounded-md border"
                        />
                    )}
                    <div>
                        <h3
                            className={`font-medium ${
                                todo.is_finished
                                    ? "line-through text-muted-foreground"
                                    : ""
                            }`}
                        >
                            {todo.title}
                        </h3>
                        {todo.description && (
                            // MENGGUNAKAN dangerouslySetInnerHTML untuk merender konten Trix (HTML)
                            <div
                                // Class prose memastikan konten HTML yang disimpan terlihat bagus
                                className="text-sm text-muted-foreground line-clamp-2 prose max-w-none max-h-16 overflow-hidden"
                                dangerouslySetInnerHTML={{
                                    __html: todo.description,
                                }}
                            />
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(todo.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(todo)}
                >
                    <Edit className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(todo.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// --- Komponen Sub: Modal Form (Add/Edit) ---
const TodoModal = ({ isOpen, onClose, todoToEdit = null }) => {
    const { data, setData, post, processing, reset, errors, clearErrors } =
        useForm({
            title: todoToEdit?.title || "",
            description: todoToEdit?.description || "", // Deskripsi akan menampung HTML
            is_finished: todoToEdit?.is_finished || false,
            cover: null,
            _method: todoToEdit ? "PUT" : "POST", // Trick untuk upload file saat Edit
        });

    useEffect(() => {
        // Reset/set data form saat modal dibuka/tutup atau todoToEdit berubah
        if (todoToEdit) {
            setData({
                title: todoToEdit.title,
                description: todoToEdit.description || "",
                is_finished: todoToEdit.is_finished,
                cover: null,
                _method: "PUT",
            });
        } else {
            reset();
            setData("_method", "POST");
        }
        clearErrors();
    }, [todoToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = todoToEdit ? `/todos/${todoToEdit.id}` : "/todos";

        post(url, {
            onSuccess: () => {
                reset();
                onClose();
            },
            forceFormData: true, // Penting untuk upload file
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg animate-in fade-in-0 zoom-in-95">
                <CardHeader>
                    <CardTitle>
                        {todoToEdit ? "Ubah Todo" : "Tambah Todo Baru"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Judul</label>
                            <Input
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Apa yang ingin dikerjakan?"
                                required
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Deskripsi (Opsional)
                            </label>
                            {/* MENGGANTIKAN TEXTAREA DENGAN TRIX EDITOR */}
                            <TrixEditor
                                value={data.description}
                                onChange={(value) =>
                                    setData("description", value)
                                }
                                placeholder="Detail tambahan, bisa menyertakan format teks (Bold, List, Quote)..."
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-medium block mb-1">
                                Cover Gambar (Opsional)
                            </label>
                            <div className="flex items-center gap-2">
                                <label
                                    htmlFor="cover-upload"
                                    className="cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent"
                                >
                                    <ImageIcon className="h-4 w-4" />
                                    <span className="text-sm">
                                        Pilih Gambar
                                    </span>
                                </label>
                                <input
                                    id="cover-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("cover", e.target.files[0])
                                    }
                                />
                                {data.cover && (
                                    <span className="text-sm text-muted-foreground">
                                        {data.cover.name}
                                    </span>
                                )}
                            </div>
                            {errors.cover && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.cover}
                                </p>
                            )}
                        </div>
                        {todoToEdit && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_finished"
                                    className="rounded border-gray-300"
                                    checked={data.is_finished}
                                    onChange={(e) =>
                                        setData("is_finished", e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_finished"
                                    className="text-sm"
                                >
                                    Tandai Selesai
                                </label>
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

// --- Komponen Utama: Dashboard ---
export default function HomePage() {
    const { auth, todos, stats, filters, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    // State untuk search & filter
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    // Debounce search agar tidak reload setiap ketikan
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || "")) {
                router.get(
                    "/",
                    { search, status: statusFilter },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Handle filter change
    const handleFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(
            "/",
            { search, status: newStatus },
            { preserveState: true, replace: true }
        );
    };

    // Chart Data preparation
    const chartData = [
        { name: "Selesai", value: stats.finished, color: "#22c55e" }, // Green
        { name: "Belum Selesai", value: stats.unfinished, color: "#ef4444" }, // Red
    ];

    // Handlers
    const handleAdd = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };
    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };
    const handleDelete = (id) => {
        // Menggunakan window.confirm karena tidak ada modal UI custom yang terdefinisi
        if (window.confirm("Yakin ingin menghapus todo ini?")) {
            router.delete(`/todos/${id}`);
        }
    };
    const handleToggleStatus = (todo) => {
        router.post(
            `/todos/${todo.id}`,
            {
                _method: "PUT",
                is_finished: !todo.is_finished,
                title: todo.title,
                description: todo.description, // Tambahkan deskripsi agar tidak hilang
            },
            { preserveScroll: true }
        );
    };

    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header & Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <h1 className="text-3xl font-bold mb-2">
                            Dashboard, {auth.name}! 👋
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Kelola tugas harianmu dengan mudah.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-green-600">
                                        {stats.finished}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Tugas Selesai
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-2xl font-bold text-red-600">
                                        {stats.unfinished}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Belum Selesai
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <Card className="flex items-center justify-center h-[200px] md:h-auto">
                        {/* Diagram Bulat (Pie Chart) */}
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Toolbar (Search, Filter, Add) */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex w-full md:w-auto gap-2 flex-1 max-w-lg">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari tugas..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="unfinished">Belum Selesai</option>
                            <option value="finished">Selesai</option>
                        </select>
                    </div>
                    <Button onClick={handleAdd} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Tugas
                    </Button>
                </div>

                {/* Flash Message */}
                {flash?.success && (
                    <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Todo List */}
                <div className="space-y-4">
                    {todos.data.length > 0 ? (
                        todos.data.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            Belum ada tugas yang ditemukan.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                    {todos.links.map((link, i) =>
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 text-sm rounded-md border ${
                                    link.active
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-accent"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="px-3 py-1 text-sm text-muted-foreground border rounded-md opacity-50 cursor-not-allowed"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )
                    )}
                </div>

                {/* Modal Component */}
                <TodoModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    todoToEdit={editingTodo}
                />
            </div>
        </AppLayout>
    );
}
