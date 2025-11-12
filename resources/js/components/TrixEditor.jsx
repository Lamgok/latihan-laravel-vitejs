import React, { useRef, useEffect } from "react";
// Trix diakses secara global, asumsikan sudah diimpor/dimuat.

/**
 * Komponen wrapper untuk Trix Editor.
 * Mengelola sinkronisasi antara custom element Trix dan state React (Inertia Form).
 * * @param {{
 * value: string;
 * onChange: (value: string) => void;
 * placeholder: string;
 * }} props
 */
export default function TrixEditor({ value, onChange, placeholder = "" }) {
    const editorRef = useRef(null);

    // Effect untuk menangani inisialisasi dan event listeners Trix
    useEffect(() => {
        const editorElement = editorRef.current;
        if (!editorElement) return;

        // --- Event Listener untuk mengupdate state Inertia ---
        const handleChange = (event) => {
            // Mengirim konten HTML dari Trix ke fungsi onChange (setData)
            onChange(event.target.value);
        };

        editorElement.addEventListener("trix-change", handleChange);

        // --- Sinkronisasi nilai awal/edit (props 'value') ke Trix ---
        const trixEditorInstance = editorElement.editor;
        if (trixEditorInstance) {
            // Periksa apakah nilai props berbeda dengan nilai yang ada di editor saat ini
            if (trixEditorInstance.getHTML() !== (value || "")) {
                // Gunakan setHTML untuk mengisi konten (penting untuk mode Edit)
                trixEditorInstance.setHTML(value || "");
            }
        }

        // Cleanup: Hapus event listener saat komponen di-unmount
        return () => {
            editorElement.removeEventListener("trix-change", handleChange);
        };
    }, [value, onChange]);

    return (
        <div className="relative">
            {/* Input Tersembunyi: Penting! Trix menggunakan ini untuk menyimpan data yang akan disubmit. */}
            <input
                id="description-editor-input"
                type="hidden"
                name="description"
                // Sinkronkan nilai input hidden dengan state React
                value={value || ""}
                onChange={() => {}}
            />

            {/* Wrapper dengan Styling Shadcn/UI (border, shadow, focus ring) */}
            <div className="w-full rounded-md border border-input shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden">
                {/* Trix Editor Custom Element */}
                <trix-editor
                    // Hubungkan trix-editor dengan input hidden di atas
                    input="description-editor-input"
                    // Gunakan ref untuk manipulasi DOM
                    ref={editorRef}
                    // Atur placeholder
                    placeholder={placeholder}
                    // Gunakan class 'trix-editor' yang sudah kita definisikan di app.css
                    className="trix-editor"
                />
            </div>
        </div>
    );
}
