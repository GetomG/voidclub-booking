"use client";
// bla bal bal
type Props = {
  id: string;
  status: "available" | "booked" ;
  x: number;
  y: number;
  onClick: (id: string) => void;
};

export default function Seat({ id, status, x, y, onClick }: Props) {
  // Determine zone
  const zone =
    id.startsWith("VA") ? "vvip-attic" :
    id.startsWith("VC") ? "vvip-center" :
    id.startsWith("VB") ? "vip-balcony" :
    id.startsWith("V")  ? "vip" :
    "regular";

  // ✅ Size adjustments
  const sizeClass =
    zone === "vvip-center"      // VC → largest
      ? "px-5 py-1.6 text-base"
      : zone === "vvip-attic"   // VA
      ? "px-2 py-4 text-sm"
      : zone === "vip" || zone === "vip-balcony" // V / VB
      ? "px-3.5 py-2 text-sm"
      : "px-3 py-1.5 text-xs"; // 1–32

  // 💜 HIGH TABLES (IDs 1–32)
  const baseStatusClass =
    zone === "regular"
      ? status === "booked"
        ? "bg-purple-500/15 text-purple-400 border border-purple-500/30 cursor-not-allowed brightness-[60%]"
        : "border border-purple-400 text-purple-200 bg-purple-700/20 shadow-[0_0_14px_rgba(200,100,255,0.7)] hover:shadow-[0_0_20px_rgba(220,140,255,1)] hover:border-purple-200 hover:text-white cursor-pointer"
      : "";

  // 🌊 VIP (V1–V14) — bright cyan glow
  const vipAquaClass =
    zone === "vip"
      ? status === "booked"
        ? "bg-[#04161b]/70 text-[#3a9eaa] border border-[#092d33] cursor-not-allowed brightness-[70%]"
        : "border border-[#41f3ff] text-[#bffbff] bg-[#41f3ff]/10 shadow-[0_0_20px_rgba(65,243,255,0.85)] hover:shadow-[0_0_30px_rgba(120,255,255,1)] hover:border-white hover:text-white cursor-pointer"
      : "";

  // ✨ **GOLD VVIP CENTER (VC1 & VC2)** — strongest styling
  const vipGoldClass =
    zone === "vvip-center"
      ? status === "booked"
        ? "bg-yellow-900/40 text-yellow-600 border border-yellow-800 cursor-not-allowed"
        : "border-[3px] border-yellow-300 text-yellow-200 bg-transparent shadow-[0_0_25px_rgba(255,215,0,0.75)] hover:shadow-[0_0_40px_rgba(255,215,0,1)] hover:border-white hover:text-white cursor-pointer"
      : "";



// 💚 VVIP ATTIC (VA1–VA4) — Neon mint with *soft* translucent fill
const vipAtticClass =
  zone === "vvip-attic"
    ? status === "booked"
      ? "bg-[#0a1d14]/70 text-[#2b7d4f] border border-[#103524] cursor-not-allowed brightness-[70%]"
      : "border-[3px] border-[#40FF7A] text-[#B8FFC8] bg-[#40FF7A]/15 shadow-[0_0_26px_rgba(64,255,122,0.65)] hover:shadow-[0_0_42px_rgba(64,255,122,1)] hover:border-white hover:text-white cursor-pointer"
    : "";

  // 💎 VIP BALCONY (VB*) — bright ice-blue glow
  const vipBalconyClass =
    zone === "vip-balcony"
      ? status === "booked"
        ? "bg-[#09131a]/70 text-[#4e9fb5] border border-[#122830] cursor-not-allowed brightness-[80%]"
        : "border border-[#9ce7ff] text-[#d5f6ff] bg-[#5ad6ff]/15 shadow-[0_0_18px_rgba(150,235,255,0.8)] hover:shadow-[0_0_26px_rgba(180,250,255,1)] hover:border-white hover:text-white cursor-pointer"
      : "";

  return (
    <button
      style={{ left: `${x}%`, top: `${y}%` }}
      className={`absolute -translate-x-1/2 -translate-y-1/2 
        rounded-md font-semibold select-none transition-all duration-200
        ${sizeClass}
        ${vipGoldClass || vipAtticClass || vipBalconyClass || vipAquaClass || baseStatusClass}      `}
      onClick={() => status !== "booked" && onClick(id)}
    >
      {id}
    </button>
  );
}