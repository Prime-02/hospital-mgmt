'use client';

interface DeleteConfirmDialogProps {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeleteConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    loading = false,
    onConfirm,
    onCancel,
}: DeleteConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up">
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm mb-5">{description}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="btn-secondary">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="btn-danger disabled:opacity-60"
                    >
                        {loading ? 'Deleting…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}