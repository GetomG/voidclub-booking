"use client";

import { seatInfo } from "@/lib/seatInfo";
import { useState } from "react";
import { initLiff } from "@/lib/liff";

export default function BookingModal({
  open,
  tableId,
  date,
  lineUserId,
  onLineLogin,
  onClose,
  onConfirm,
}: {
  open: boolean;
  tableId: string | null;
  date: string;
  lineUserId: string | null;
  onLineLogin: (userId: string) => void;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  if (!open || !tableId) return null;
  const info = seatInfo[tableId];

  /* ---------------------------------------------------------
     LINE LOGIN HANDLER 
  --------------------------------------------------------- */
  async function handleLineLogin() {
    try {
      setLoginLoading(true);
      const liff = await initLiff();
      if (!liff.isLoggedIn()) {
        if (liff.isInClient()) {
          // Inside LINE but isLoggedIn() is false — something unexpected.
          // Do NOT call liff.login() here; it would cause a redirect loop inside LINE.
          console.warn("⚠️ Inside LINE but isLoggedIn() = false — skipping login redirect");
          return;
        }
        // External browser: save date + active seat so they survive the redirect.
        sessionStorage.setItem("void_booking_date", date);
        if (tableId) sessionStorage.setItem("void_booking_seat", tableId);
        liff.login();
        return;
      }
      const profile = await liff.getProfile();
      console.log("✅ LINE PROFILE:", profile.displayName, profile.userId);
      onLineLogin(profile.userId);
    } catch (err) {
      console.error("LINE login failed:", err);
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => !loading && !confirmed && onClose()}
      />

      <div className="relative bg-black/80 border border-gray-600 p-5 rounded-xl w-full max-w-sm text-white">

        {/* ---------------------------------------------------------
           SUCCESS SCREEN
        --------------------------------------------------------- */}
        {confirmed ? (
          <div className="text-center">
            <div className="text-5xl mb-4 text-emerald-400">✓</div>

            <h2 className="text-xl font-bold mb-2 text-emerald-300">
              Reservation Confirmed!
            </h2>

            <p className="text-sm text-gray-300">
              Table <span className="font-semibold text-white">{tableId}</span>
            </p>

            <p className="text-sm text-gray-300">
              Name: <span className="font-semibold text-white">{name}</span>
            </p>

            <p className="text-xs text-gray-400 mt-4 mb-4">
              Please arrive before{" "}
              <span className="font-semibold text-white">23:00</span> on{" "}
              <span className="font-semibold text-white">{date}</span>.
            </p>

            <button
              className="px-4 py-2 bg-emerald-600 rounded-md hover:bg-emerald-500"
              onClick={() => {
                setConfirmed(false);
                setName("");
                onClose();
              }}
            >
              OK
            </button>
          </div>
        ) : (
          /* ---------------------------------------------------------
             BOOKING FORM SCREEN
          --------------------------------------------------------- */
          <>
            <h2 className="text-xl font-bold mb-2">{tableId}</h2>
            <p className="text-sm mb-1">{info.zone}</p>

            <p className="text-sm text-emerald-300 mb-4">
              Minimum Spend: {info.price.toLocaleString()} THB
            </p>

            {/* ⭐ LOGIN WITH LINE BUTTON */}
            <button
              className="mb-3 px-3 py-2 bg-green-600 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
              onClick={handleLineLogin}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              ) : lineUserId ? (
                "LINE Connected ✓"
              ) : (
                "Login with LINE"
              )}
            </button>

            <input
              className="w-full bg-black/40 border border-gray-600 rounded-md px-3 py-2 mb-4"
              placeholder="Enter booking name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-3 py-2 bg-gray-700 rounded-md disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!name.trim() || !lineUserId) return;
                  setLoading(true);
                  try {
                    await onConfirm(name.trim());
                    setConfirmed(true);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !name.trim() || !lineUserId}
                className="px-3 py-2 bg-emerald-600 rounded-md flex items-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white/40 border-t-white rounded-full w-4 h-4" />
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}