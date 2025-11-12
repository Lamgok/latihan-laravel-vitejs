import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

// Inisialisasi SweetAlert2 Mixin untuk Toast (Notifikasi di sudut)
const MySwalToast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

export default function useSweetAlert() {
    const { props } = usePage();
    const flashSuccess = props.flash?.success; // Untuk HomePage (CRUD actions)
    const generalSuccess = props.success; // Untuk LoginPage (Register success)

    // Fungsi utama untuk menampilkan Alert Sukses (Toast)
    const showSuccessToast = (message) => {
        MySwalToast.fire({
            icon: "success",
            title: message,
        });
    };

    // Fungsi untuk menampilkan Alert Gagal (Modal standar)
    const showErrorAlert = (message) => {
        Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: message,
            confirmButtonText: "Tutup",
        });
    };

    // Efek yang berjalan setiap kali props Inertia berubah
    useEffect(() => {
        if (flashSuccess) {
            showSuccessToast(flashSuccess);
        }

        if (generalSuccess) {
            showSuccessToast(generalSuccess);
        }

        // Anda bisa menambahkan penanganan error Inertia di sini jika diperlukan:
        // const flashError = props.flash?.error;
        // if (flashError) {
        //     showErrorAlert(flashError);
        // }
    }, [flashSuccess, generalSuccess]);

    // Kembalikan Swal API untuk penggunaan manual (misalnya konfirmasi delete)
    return {
        Swal, // Mengembalikan objek SweetAlert2 penuh
        showSuccessToast,
        showErrorAlert,
    };
}
