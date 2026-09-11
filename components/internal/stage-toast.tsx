"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useInternal } from "./internal-context";

/** Kesintiye uğratmayan anlık geri bildirim — kısa süre sonra kendiliğinden kaybolur */
export function StageToast() {
  const { toast, dismissToast } = useInternal();
  const toastId = toast?.id;

  useEffect(() => {
    if (!toastId) return;
    const timer = setTimeout(dismissToast, 4000);
    return () => clearTimeout(timer);
  }, [toastId, dismissToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {toast ? (
        <div className="toast-enter bg-ink shadow-panel pointer-events-auto flex max-w-full items-center gap-2.5 rounded-[10px] px-4 py-3 text-white">
          <span className="bg-success grid size-5 shrink-0 place-items-center rounded-full">
            <Check className="size-3.5 text-white" aria-hidden="true" />
          </span>
          <p className="break-anywhere text-[14px] font-medium">{toast.text}</p>
        </div>
      ) : null}
    </div>
  );
}
