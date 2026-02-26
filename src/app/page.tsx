"use client";
export const ssr = false;

import { useState, useEffect } from "react";
import SeatMap from "@/components/SeatMap";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { initLiff } from "@/lib/liff";

export default function Page() {
  const [date, setDate] = useState<Date>(new Date("2025-12-01"));
  const [lineUserId, setLineUserId] = useState<string | null>(null);

  useEffect(() => {
    initLiff()
      .then(async (l) => {
        if (l.isLoggedIn()) {
          // Already authorized — grab profile silently
          const profile = await l.getProfile();
          setLineUserId(profile.userId);
          console.log("✅ Auto-logged in as", profile.displayName);
        } else if (l.isInClient()) {
          // Inside LINE app but not yet authorized → auto-trigger login (no button click needed)
          l.login();
        }
        // External browser → do nothing, user clicks the button manually
      })
      .catch((e) => console.warn("⚠️ LIFF init skipped (normal in browser):", e?.message));
  }, []);

  // Restore date if we're returning from a LIFF login redirect
  useEffect(() => {
    const saved = sessionStorage.getItem("void_booking_date");
    if (saved) {
      setDate(new Date(saved));
      sessionStorage.removeItem("void_booking_date");
    }
  }, []);

  function previousDay() {
    setDate((d) => addDays(d, -1));
  }

  function nextDay() {
    setDate((d) => addDays(d, 1));
  }

  return (
    <main className="p-4 text-white">

      {/* TITLE */}
      <h1 className="text-center text-2xl font-bold mb-4 tracking-wide">
        VOID — Reservations
      </h1>

      {/* DATE NAVIGATION */}
      <div className="flex justify-center items-center gap-4 mb-6">

        {/* ← BUTTON */}
        <Button
          variant="outline"
          className="text-black bg-white"
          onClick={previousDay}
        >
          ←
        </Button>

        {/* CENTER DATE (opens calendar) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="text-black bg-white font-semibold">
              {format(date, "yyyy-MM-dd")}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0 bg-white text-black">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* → BUTTON */}
        <Button
          variant="outline"
          className="text-black bg-white"
          onClick={nextDay}
        >
          →
        </Button>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mb-6 text-sm text-gray-300 select-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border border-emerald-400 rounded-sm shadow-[0_0_8px_rgba(0,255,200,0.6)]"></div>
          Available
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#40FF7A]/35 border border-[#40FF7A]/40 rounded-sm shadow-[0_0_6px_rgba(64,255,122,0.4)]"></div>
          Booked
        </div>
      </div>

      {/* SEAT MAP */}
      <SeatMap date={format(date, "yyyy-MM-dd")} lineUserId={lineUserId} onLineLogin={setLineUserId} />
    </main>
  );
}