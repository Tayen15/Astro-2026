'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteModal({ open, title, message, onConfirm, onCancel, loading = false }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm bg-white border border-slate-200"
            style={{ clipPath: 'polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }}
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-black text-slate-900 text-center uppercase tracking-tight mb-2">
                {title}
              </h3>

              {/* Message */}
              <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold text-xs tracking-wider uppercase transition-all hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  Batal
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-400 text-white font-bold text-xs tracking-wider uppercase transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Hapus'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
