"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function KvkkDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      onKeyDown={(event) => {
        // Esc ile kapanmayı tarayıcı varsayılanına bırakma (gömülü önizlemelerde çalışmayabiliyor)
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
      aria-labelledby="kvkk-title"
      className="rounded-panel bg-surface shadow-panel text-ink backdrop:bg-ink/40 m-auto w-[min(640px,calc(100vw-32px))] max-h-[85vh] overflow-hidden p-0"
    >
      <div className="flex max-h-[85vh] flex-col">
        <div className="border-line flex items-start justify-between gap-4 border-b px-6 py-4">
          <h2 id="kvkk-title" className="t-h3">
            Aydınlatma metni
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-quiet -mr-2 size-11 shrink-0 p-0"
            aria-label="Aydınlatma metnini kapat"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="t-body text-muted flex flex-col gap-4 overflow-y-auto px-6 py-6">
          <p>
            Pivota Yazılım A.Ş. olarak, açık pozisyonlarımıza yaptığınız
            başvuruda paylaştığınız kişisel verileri 6698 sayılı Kişisel
            Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla
            işliyoruz.
          </p>
          <div>
            <h3 className="t-body text-ink font-semibold">
              Hangi verileri işliyoruz?
            </h3>
            <p className="mt-2">
              Ad-soyad, iletişim bilgileri, özgeçmişinizde yer alan eğitim ve
              deneyim bilgileri ile ön eleme sorularına verdiğiniz yanıtlar.
            </p>
          </div>
          <div>
            <h3 className="t-body text-ink font-semibold">Hangi amaçla?</h3>
            <p className="mt-2">
              Yalnızca başvurduğunuz pozisyonun değerlendirilmesi, işe alım
              sürecinin yürütülmesi ve sizinle iletişim kurulması amacıyla.
            </p>
          </div>
          <div>
            <h3 className="t-body text-ink font-semibold">Ne kadar süreyle?</h3>
            <p className="mt-2">
              Verileriniz süreç sonuçlandıktan sonra en fazla 12 ay boyunca
              saklanır, sürenin sonunda silinir. Dilediğiniz zaman
              kvkk@pivota.com adresine yazarak verilerinizin silinmesini talep
              edebilirsiniz.
            </p>
          </div>
          <div>
            <h3 className="t-body text-ink font-semibold">Haklarınız</h3>
            <p className="mt-2">
              Kanunun 11. maddesi kapsamında verilerinize erişme, düzeltilmesini
              veya silinmesini isteme ve işlemeye itiraz etme haklarına
              sahipsiniz.
            </p>
          </div>
        </div>

        <div className="border-line bg-canvas border-t px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-outline">
            Anladım
          </button>
        </div>
      </div>
    </dialog>
  );
}
