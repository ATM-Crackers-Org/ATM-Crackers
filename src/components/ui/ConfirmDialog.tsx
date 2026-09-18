"use client";

import React, { useEffect } from "react";
import { FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this? This action cannot be undone.",
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, isLoading, onClose]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-zinc-100 transform transition-all animate-scale-up z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <IoClose className="text-xl" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-inner ${
              isDanger
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
            }`}
          >
            {isDanger ? <FaTrashCan /> : <FaTriangleExclamation />}
          </div>

          {/* Title */}
          <h3
            id="confirm-dialog-title"
            className="text-lg font-bold text-zinc-900 mb-2"
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-500 mb-3 max-w-xs leading-relaxed">
            {message}
          </p>

          {/* Optional Item Highlight */}
          {itemName && (
            <div className="w-full bg-zinc-50 border border-zinc-200/80 rounded-xl px-3 py-2 mb-5 text-center">
              <span className="text-xs font-semibold text-zinc-800 line-clamp-2">
                &ldquo;{itemName}&rdquo;
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl border border-zinc-200 text-xs sm:text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white transition-all shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
