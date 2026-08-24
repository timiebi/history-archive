"use client";

import { Button } from "@/components/ui/button";
import { useTours } from "@/lib/api";
import type { Tour } from "@/lib/tourism";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

export type TourBookingWidgetProps = {
  /** Prefill a specific tour; omit for full catalogue picker (incl. custom). */
  tour?: Tour;
  /** Show destination select (catalogue). Hidden when a single tour is locked. */
  allowTourSelect?: boolean;
  /** Flatten chrome when nested inside TourBookingDrawer. */
  embedded?: boolean;
  /** Fired after mock success timeout (e.g. close parent drawer). */
  onComplete?: () => void;
  className?: string;
};

type BookingSuccessData = {
  tourName: string;
  destination: string;
  departureDate: string;
  guideType: string;
  groupSize: number;
  pricePerPerson: number;
  totalPrice: number;
  operators: string;
};

/**
 * Expedition trip request form (non-persistent demo).
 * No payment backend — requests are local UI only until booking persistence ships.
 */
export function TourBookingWidget({
  tour,
  allowTourSelect = !tour,
  embedded = false,
  onComplete,
  className = "",
}: TourBookingWidgetProps) {
  const { data: tours = [] } = useTours({ limit: 50 });
  const [selectedTourId, setSelectedTourId] = useState(tour?.id ?? tour?.slug ?? "");
  const [destination, setDestination] = useState(tour?.dest ?? "");
  const [departureDate, setDepartureDate] = useState("");
  const [guideType, setGuideType] = useState("historian");
  const [groupSize, setGroupSize] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<BookingSuccessData | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !departureDate || !name || !email) {
      alert("Please fill out all required fields.");
      return;
    }

    const activeTour =
      tour ||
      tours.find((t) => t.id === selectedTourId || t.slug === selectedTourId) || {
        name: `Custom Expedition to ${destination}`,
        price: 1200,
        operators: "Local heritage custodians (request only)",
      };

    setBookingSuccessData({
      tourName: activeTour.name,
      destination,
      departureDate,
      guideType,
      groupSize,
      pricePerPerson: activeTour.price,
      totalPrice: activeTour.price * groupSize,
      operators: "operators" in activeTour ? activeTour.operators : "Local custodians",
    });
    setCheckoutOpen(true);
  };

  const confirmBookingCheckout = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setCheckoutOpen(false);
      setIsSuccess(false);
      if (!tour) {
        setSelectedTourId("");
        setDestination("");
      }
      setDepartureDate("");
      setName("");
      setEmail("");
      setGroupSize(1);
      onComplete?.();
    }, 3000);
  };

  const shellClass = embedded
    ? `space-y-6 ${className}`
    : `max-w-3xl mx-auto bg-white/70 dark:bg-stone-950/70 backdrop-blur-md border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl shadow-sm space-y-6 ${className}`;

  return (
    <>
      <section id="booking-widget" className={shellClass}>
        {!embedded && (
          <div className="flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-850/40 pb-4">
            <Compass className="text-primary animate-spin-slow" size={20} />
            <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
              Trip request form
            </h2>
          </div>
        )}

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allowTourSelect ? (
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Select Destination (Required)
                </label>
                <div className="relative">
                  <select
                    value={selectedTourId}
                    onChange={(e) => {
                      setSelectedTourId(e.target.value);
                      const matched = tours.find(
                        (t) => t.id === e.target.value || t.slug === e.target.value
                      );
                      if (matched) setDestination(matched.dest);
                    }}
                    className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200 appearance-none"
                  >
                    <option value="">-- Choose an Expedition --</option>
                    {tours.map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name} ({t.dest})
                      </option>
                    ))}
                    <option value="custom">Custom Unlisted Travel</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Expedition
                </label>
                <input
                  type="text"
                  disabled
                  value={tour?.name ?? ""}
                  className="w-full text-xs font-mono p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-600 dark:text-stone-400 focus:outline-none cursor-not-allowed"
                />
              </div>
            )}

            {allowTourSelect && selectedTourId === "custom" ? (
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Write Custom Destination City/Country
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maseru, Lesotho"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-250"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Target Landmark
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="Auto-filled from tour choice"
                  value={destination}
                  className="w-full text-xs font-mono p-3 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-stone-400 dark:text-stone-600 focus:outline-none cursor-not-allowed"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Departure Date (Required)
              </label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Preferred Custodian Guide
              </label>
              <div className="relative">
                <select
                  value={guideType}
                  onChange={(e) => setGuideType(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200 appearance-none"
                >
                  <option value="historian">Heritage Historian Guide</option>
                  <option value="architect">Preservation Architect</option>
                  <option value="village">Local Village Elder</option>
                  <option value="safari">Eco-Safari Specialist</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Travelers / Group Size
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200"
              />
            </div>
          </div>

          <div className="border-t border-stone-200/40 dark:border-stone-850/40 pt-6 space-y-4">
            <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-550">
              Primary Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Full Name (Required)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adebayo Kwame"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                  Email Address (Required)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. adebayo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-orange-850 text-white font-mono text-[10px] font-black uppercase tracking-[0.25em] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Submit trip request</span>
            <ArrowRight size={12} />
          </button>
        </form>
      </section>

      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          checkoutOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setCheckoutOpen(false)}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity duration-300" />

        <div
          className={`absolute bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-xl bg-white dark:bg-[#0c0a09] border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-t-3xl md:rounded-2xl shadow-2xl transition-all duration-300 ease-out space-y-6 ${
            checkoutOpen ? "translate-y-0 scale-100" : "translate-y-24 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">
                Request Received
              </h3>
              <p className="text-xs text-stone-500 font-mono uppercase tracking-widest max-w-xs mx-auto">
                Trip request received — no payment was taken and no booking was confirmed. We will follow up by email
                when coordination is available.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-stone-200/40 dark:border-stone-850/40 pb-4">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-primary animate-spin-slow" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                    Gesi trip request
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="p-1 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-600 rounded-full cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {bookingSuccessData && (
                <div className="space-y-5">
                  <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-150 dark:border-stone-800 rounded-lg space-y-3 font-mono text-[10px] uppercase text-stone-700 dark:text-stone-300">
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-400">Expedition:</span>
                      <span className="font-black text-stone-900 dark:text-white text-right">
                        {bookingSuccessData.tourName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-stone-400">Destination:</span>
                      <span className="font-bold text-stone-900 dark:text-white text-right">
                        {bookingSuccessData.destination}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Departure:</span>
                      <span className="text-stone-900 dark:text-white">{bookingSuccessData.departureDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Guide focus:</span>
                      <span className="text-stone-900 dark:text-white">{bookingSuccessData.guideType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Group size:</span>
                      <span className="text-stone-900 dark:text-white">
                        {bookingSuccessData.groupSize} Travelers
                      </span>
                    </div>
                    <div className="border-t border-stone-200 dark:border-stone-800 my-2 pt-2 flex justify-between font-black">
                      <span className="text-stone-900 dark:text-white">Indicative total:</span>
                      <span className="text-primary text-xs">${bookingSuccessData.totalPrice}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                      Request status
                    </span>
                    <div className="border border-stone-200 dark:border-stone-800 p-3 rounded-lg bg-stone-50/50 dark:bg-stone-900/50">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-stone-600 dark:text-stone-400 leading-relaxed">
                        This is a trip request only. No payment is processed here, and nothing is confirmed until Gesi
                        follows up.
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg flex items-start gap-2.5">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 leading-normal">
                      <strong>Heritage-first:</strong> Trip requests help us connect travellers with local custodians.
                      Pricing shown is indicative for curated destinations, not a confirmed commercial package.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={confirmBookingCheckout}
                      className="flex-1 h-12 rounded-none font-black uppercase text-[10px] tracking-widest cursor-pointer"
                    >
                      Confirm trip request
                    </Button>
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(false)}
                      className="py-3 px-6 border border-stone-250 dark:border-stone-800 text-[10px] font-mono font-black uppercase tracking-widest text-stone-600 dark:text-stone-455 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg cursor-pointer transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
