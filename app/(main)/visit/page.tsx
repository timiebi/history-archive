"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Bookmark,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TOURS = [
  {
    id: "mali",
    name: "Mud Architecture Trail",
    desc: "Explore the ancient adobe mosques of Djenné and the medieval library reserves of Timbuktu.",
    dest: "Djenné & Timbuktu, Mali",
    region: "West Africa",
    price: 1480,
    duration: "7 Days",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=600",
    highlights: ["Grand Mosque of Djenné", "Ahmed Baba Institute", "Nile Felucca Sailing"],
    operators: "Djenné Preservation Custodians & local guides"
  },
  {
    id: "zimbabwe",
    name: "Great Zimbabwe Citadel Journey",
    desc: "Stand among the massive mortarless granite walls and historical ruins of Great Zimbabwe.",
    dest: "Masvingo, Zimbabwe",
    region: "Southern Africa",
    price: 980,
    duration: "5 Days",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600",
    highlights: ["Great Enclosure Tour", "Hill Complex Ascent", "Shona Village Cultural Meet"],
    operators: "Zimbabwe National Monuments Trust & local elders"
  },
  {
    id: "egypt",
    name: "Giza & Nile Antiquity Safari",
    desc: "Walk the Sphinx temple complexes and navigate the ancient Nile on a traditional felucca.",
    dest: "Giza, Egypt",
    region: "North Africa",
    price: 1150,
    duration: "6 Days",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=600",
    highlights: ["Giza Great Pyramids", "Sphinx Valley Temple", "Nile Felucca Dinner Cruise"],
    operators: "Egypt Antiquities Authority & Cairo Historical Guides"
  },
  {
    id: "lalibela",
    name: "Rock-Hewn Churches Expedition",
    desc: "Explore the 11 medieval rock-hewn monolithic churches carved directly from volcanic stone.",
    dest: "Lalibela, Ethiopia",
    region: "East Africa",
    price: 1250,
    duration: "6 Days",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800",
    highlights: ["Biete Giyorgis (St. George)", "Rock-Cut Tunnels & Passageways", "Amhara Traditional Dinner"],
    operators: "Lalibela Heritage Conservation Committee"
  }
];

function ToursContent() {
  const searchParams = useSearchParams();
  const initialTour = searchParams.get("tour") || "";
  const initialDest = searchParams.get("destination") || "";
  const initialRegion = searchParams.get("region") || "";

  // Booking Form State
  const [selectedTourId, setSelectedTourId] = useState(initialTour);
  const [destination, setDestination] = useState(initialDest || initialRegion);
  const [departureDate, setDepartureDate] = useState("");
  const [guideType, setGuideType] = useState("historian");
  const [groupSize, setGroupSize] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Filters State
  const [selectedRegionFilter, setSelectedRegionFilter] = useState(initialRegion || "All");

  // Interaction State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<unknown>(null);

  // Pre-fill form if a tour is pre-selected from URL queries
  useEffect(() => {
    if (initialTour) {
      const match = TOURS.find((t) => t.id === initialTour);
      if (match) {
        setSelectedTourId(match.id);
        setDestination(match.dest);
      }
    }
  }, [initialTour]);

  // Handle direct tour card selection
  const selectTourCard = (tour: typeof TOURS[number]) => {
    setSelectedTourId(tour.id);
    setDestination(tour.dest);
    
    // Smooth scroll down to booking widget
    const el = document.getElementById("booking-widget");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !departureDate || !name || !email) {
      alert("Please fill out all required fields.");
      return;
    }
    
    // Find active tour metadata or fall back to custom destination name
    const activeTour = TOURS.find((t) => t.id === selectedTourId) || {
      name: `Custom Expedition to ${destination}`,
      price: 1200,
      duration: "Flexible duration",
      operators: "Collaborating with local operators & Booking.com partners"
    };

    setBookingSuccessData({
      tourName: activeTour.name,
      destination,
      departureDate,
      guideType,
      groupSize,
      pricePerPerson: activeTour.price,
      totalPrice: activeTour.price * groupSize,
      operators: activeTour.operators
    });
    setCheckoutOpen(true);
  };

  const confirmBookingCheckout = () => {
    setIsSuccess(true);
    setTimeout(() => {
      setCheckoutOpen(false);
      setIsSuccess(false);
      // Reset form
      setSelectedTourId("");
      setDestination("");
      setDepartureDate("");
      setName("");
      setEmail("");
      setGroupSize(1);
    }, 3000);
  };

  const filteredTours = TOURS.filter(
    (t) => selectedRegionFilter === "All" || t.region.toLowerCase().includes(selectedRegionFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-16">
      {/* Editorial Page Header */}
      <header className="max-w-3xl space-y-4">
        <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-orange-850 dark:text-orange-500 block">
          Gesi Tours & Expeditions
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white leading-none">
          Walk the Soils <br /> of Empires
        </h1>
        <p className="text-stone-600 dark:text-stone-400 font-serif italic text-lg leading-relaxed max-w-2xl">
          We partner with certified local guides and conservation agencies to offer verified travel safaris. Walk the physical landmarks of African sovereignty and preserve local history.
        </p>
      </header>

      {/* Region Filter Ribbon */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/50 dark:border-stone-850/60 pb-6">
        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-500 mr-4">Filter Region:</span>
        {["All", "West", "East", "Central", "North", "Southern"].map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegionFilter(reg)}
            className={`px-4 py-2 font-mono text-[9px] font-black uppercase tracking-widest border rounded-full transition-all cursor-pointer ${
              selectedRegionFilter === reg
                ? "bg-stone-900 border-stone-900 text-white dark:bg-stone-100 dark:border-stone-100 dark:text-stone-900"
                : "bg-transparent border-stone-250 dark:border-stone-800 text-stone-600 dark:text-stone-455 hover:bg-stone-100 dark:hover:bg-stone-900"
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Expeditions Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredTours.map((tour) => (
          <div 
            key={tour.id} 
            className={`group flex flex-col md:flex-row bg-white dark:bg-stone-900 border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 ${
              selectedTourId === tour.id 
                ? "border-orange-600 dark:border-orange-500 ring-1 ring-orange-600/40" 
                : "border-stone-200/50 dark:border-stone-850/60"
            }`}
          >
            {/* Cover Image */}
            <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto min-h-[220px]">
              <Image
                src={tour.img}
                alt={tour.name}
                fill
                className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-stone-950/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-stone-950/85 backdrop-blur-xs border border-white/10 text-white font-mono text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm">
                {tour.region}
              </span>
            </div>

            {/* Details Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-[9px] font-mono text-stone-500 uppercase tracking-widest">
                    <MapPin size={10} className="text-orange-500" />
                    <span>{tour.dest}</span>
                  </div>
                  <span className="text-[9px] font-mono text-amber-500 font-bold">★ {tour.rating}</span>
                </div>

                <h3 className="text-xl font-black uppercase text-stone-900 dark:text-white leading-tight">
                  {tour.name}
                </h3>
                
                <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed line-clamp-2">
                  {tour.desc}
                </p>

                <div className="flex flex-wrap gap-1 pt-1.5">
                  {tour.highlights.map((h, i) => (
                    <span key={i} className="text-[8px] font-mono bg-stone-100 dark:bg-stone-850/80 px-2 py-0.5 text-stone-600 dark:text-stone-400 uppercase tracking-widest rounded-xs">
                      • {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-150 dark:border-stone-850/60 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono uppercase text-stone-500 block">Pricing:</span>
                  <span className="text-base font-mono font-black text-stone-950 dark:text-white">${tour.price}</span>
                  <span className="text-[8px] font-mono text-stone-400"> / person</span>
                </div>

                <button
                  type="button"
                  onClick={() => selectTourCard(tour)}
                  className="py-2.5 px-4 bg-stone-900 dark:bg-stone-800 hover:bg-primary dark:hover:bg-primary text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition active:scale-98 cursor-pointer"
                >
                  <span>Choose</span>
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Widget */}
      <section 
        id="booking-widget" 
        className="max-w-3xl mx-auto bg-white/70 dark:bg-stone-950/70 backdrop-blur-md border border-stone-200/50 dark:border-stone-850/60 p-8 rounded-2xl shadow-sm space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-stone-200/40 dark:border-stone-850/40 pb-4">
          <Compass className="text-primary animate-spin-slow" size={20} />
          <h2 className="text-xl font-black uppercase italic tracking-tight text-stone-900 dark:text-white">
            Expedition Booking Form
          </h2>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination Selection */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Select Destination (Required)
              </label>
              <div className="relative">
                <select
                  value={selectedTourId}
                  onChange={(e) => {
                    setSelectedTourId(e.target.value);
                    const matched = TOURS.find((t) => t.id === e.target.value);
                    if (matched) setDestination(matched.dest);
                  }}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200 appearance-none"
                >
                  <option value="">-- Choose an Expedition --</option>
                  {TOURS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.dest})
                    </option>
                  ))}
                  <option value="custom">Custom Unlisted Travel</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Custom Destination input if Custom selected */}
            {selectedTourId === "custom" ? (
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
            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Departure Date (Required)
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-stone-850 dark:text-stone-200"
                />
              </div>
            </div>

            {/* Guide type */}
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
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Group Size */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                Travelers / Group Size
              </label>
              <input
                type="number"
                min="1"
                max="15"
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
            <span>Submit Booking Request</span>
            <ArrowRight size={12} />
          </button>
        </form>
      </section>

      {/* Checkout Drawer (Bottom Sheet Mocking Booking.com Integration) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
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
                Booking Request Sent!
              </h3>
              <p className="text-xs text-stone-500 font-mono uppercase tracking-widest max-w-xs mx-auto">
                Collaborating partners are processing your tickets. Check your email inbox for flight options and booking credentials shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-stone-200/40 dark:border-stone-850/40 pb-4">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-primary animate-spin-slow" />
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-900 dark:text-white">
                    Gesi Reservation Checkout
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
                    <div className="flex justify-between">
                      <span className="text-stone-400">Expedition:</span>
                      <span className="font-black text-stone-900 dark:text-white">{(bookingSuccessData as any).tourName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Destination:</span>
                      <span className="font-bold text-stone-900 dark:text-white">{(bookingSuccessData as any).destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Departure:</span>
                      <span className="text-stone-900 dark:text-white">{(bookingSuccessData as any).departureDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Guide focus:</span>
                      <span className="text-stone-900 dark:text-white">{(bookingSuccessData as any).guideType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Group size:</span>
                      <span className="text-stone-900 dark:text-white">{(bookingSuccessData as any).groupSize} Travelers</span>
                    </div>
                    <div className="border-t border-stone-200 dark:border-stone-800 my-2 pt-2 flex justify-between font-black">
                      <span className="text-stone-900 dark:text-white">Total Package Price:</span>
                      <span className="text-primary text-xs">${(bookingSuccessData as any).totalPrice}</span>
                    </div>
                  </div>

                  {/* Booking Partners Section */}
                  <div className="space-y-3">
                    <span className="text-[8px] font-mono font-black uppercase tracking-widest text-stone-500 block">
                      Preservation & Flight Partners
                    </span>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {/* Booking.com Mock Logo box */}
                      <div className="border border-stone-200 dark:border-stone-800 p-3 rounded-lg flex flex-col justify-center items-center gap-1.5 select-none bg-stone-50/50 dark:bg-stone-900/50">
                        <div className="text-[10px] font-sans font-black text-blue-700 tracking-tight">Booking.com</div>
                        <span className="text-[7px] font-mono text-stone-450 uppercase tracking-widest">Flight & Hotels</span>
                      </div>
                      
                      {/* Gesi Local Preservation */}
                      <div className="border border-stone-200 dark:border-stone-800 p-3 rounded-lg flex flex-col justify-center items-center gap-1.5 select-none bg-stone-50/50 dark:bg-stone-900/50">
                        <div className="text-[10px] font-serif font-black text-orange-800 dark:text-orange-500 tracking-tight">Gesi Guides</div>
                        <span className="text-[7px] font-mono text-stone-450 uppercase tracking-widest">Heritage Tours</span>
                      </div>
                      
                      {/* Ethiopian Airlines Mock */}
                      <div className="border border-stone-200 dark:border-stone-800 p-3 rounded-lg flex flex-col justify-center items-center gap-1.5 select-none bg-stone-50/50 dark:bg-stone-900/50">
                        <div className="text-[10px] font-sans font-black text-red-650 tracking-tight">African Air</div>
                        <span className="text-[7px] font-mono text-stone-450 uppercase tracking-widest">Partner Airlines</span>
                      </div>
                    </div>
                  </div>

                  {/* Fund warning */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg flex items-start gap-2.5">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 leading-normal">
                      <strong>Preservation Support:</strong> 5% of this package cost (${(bookingSuccessData as any).totalPrice * 0.05}) is donated to local archaeological preservation councils to protect regional heritage.
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={confirmBookingCheckout}
                      className="flex-1 h-12 rounded-none font-black uppercase text-[10px] tracking-widest cursor-pointer"
                    >
                      Confirm & Pay Request
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
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#fafaf9] dark:bg-[#0c0a09] pt-28 pb-32 flex items-center justify-center">
        <p className="text-stone-500 font-mono text-sm uppercase tracking-widest animate-pulse">Loading Gesi Tours…</p>
      </main>
    }>
      <ToursContent />
    </Suspense>
  );
}
