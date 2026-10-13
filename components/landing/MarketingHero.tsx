"use client";

import { Sunburst, TribalSun } from "@/components/landing/HeroScenery";
import { useTours } from "@/lib/api";
import { landingLinks } from "@/lib/landing-links";
import { siteImages } from "@/lib/site-images";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

/** Only the first published tour is shown, on the featured card. */
const TOURS_LIMIT = 1;

/** Expo-out: fast start, long soft settle — reads as "smooth" rather than bouncy. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * landing.css styles `.landing-platform h1` (serif, loose leading) outside any cascade layer,
 * which beats Tailwind utilities — so the display type is set inline.
 */
const TITLE_STYLE = {
  fontFamily: "var(--font-geist-sans), var(--font-sans), system-ui, sans-serif",
  lineHeight: 0.9,
  letterSpacing: "-0.045em",
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay },
  }),
} as const;

/** Headline lines slide up from behind a mask. */
const lineReveal = {
  hidden: { y: "105%" },
  visible: (delay: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: EASE, delay },
  }),
} as const;

function HeadlineLines({ accentClassName }: { accentClassName: string }) {
  return (
    <>
      <span className="block overflow-hidden pb-[0.06em]">
        <motion.span variants={lineReveal} initial="hidden" animate="visible" custom={0.15} className="block">
          History
        </motion.span>
      </span>
      <span className="block overflow-hidden pb-[0.06em]">
        <motion.span
          variants={lineReveal}
          initial="hidden"
          animate="visible"
          custom={0.27}
          className="block whitespace-nowrap"
        >
          <span className={accentClassName}>Lives</span> Here
        </motion.span>
      </span>
    </>
  );
}

/** Portrait + layered scenery. Shared by the desktop stage and the mobile card. */
function PortraitStage({
  portraitY,
  sceneryY,
  compact = false,
}: {
  portraitY: MotionValue<number>;
  sceneryY: MotionValue<number>;
  compact?: boolean;
}) {
  return (
    <>
      <motion.div style={{ y: sceneryY }} className="absolute inset-0" aria-hidden>
        {/* Big terracotta arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.1 }}
          className={
            compact
              ? "absolute -top-24 -right-28 h-80 w-80 rounded-full border-[36px] border-[#c4632f]/70"
              : "absolute -top-[22%] -right-[18%] aspect-square w-[78%] rounded-full border-[70px] border-[#c4632f]/80"
          }
        />
        {/* Warm sun disc + watercolor wash behind the head */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
          className={
            compact
              ? "absolute top-20 right-6 h-52 w-52 rounded-full bg-[#eab47e]/70"
              : "absolute top-[22%] right-[6%] aspect-square w-[44%] rounded-full bg-[#eab47e]/75"
          }
        />
        <div
          className={
            compact
              ? "absolute top-10 left-6 h-44 w-44 rounded-full bg-[#f1d2b0]/80 blur-xl"
              : "absolute top-[10%] left-[14%] aspect-square w-[34%] rounded-full bg-[#f1d2b0]/80 blur-2xl"
          }
        />
        <motion.div
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: EASE, delay: 0.35 }}
          className={
            compact
              ? "absolute top-6 -right-16 h-64 w-64 text-[#c4632f]/45"
              : "absolute top-[4%] -right-[10%] aspect-square w-[58%] text-[#c4632f]/55"
          }
        >
          <TribalSun className="h-full w-full animate-spin-slow" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.45 }}
          className={
            compact
              ? "absolute bottom-24 -left-24 h-80 w-80 text-[#e8b98c]/70"
              : "absolute bottom-[-12%] left-[-6%] aspect-square w-[52%] text-[#e8b98c]/80"
          }
        >
          <Sunburst className="h-full w-full" />
        </motion.div>
      </motion.div>

      {/* Real landscape (the previous hero photo) settling in behind the portrait */}
      <motion.div
        style={{ y: sceneryY }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
        className={
          compact
            ? "absolute inset-x-0 bottom-0 h-[46%] [mask-image:linear-gradient(to_top,black_45%,transparent)]"
            : "absolute bottom-0 left-0 right-0 h-[50%] [mask-image:linear-gradient(to_top,black_45%,transparent),linear-gradient(to_right,transparent_8%,black_45%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
        }
        aria-hidden
      >
        <Image
          src={siteImages.heroLandscape}
          alt=""
          fill
          sizes={compact ? "100vw" : "56vw"}
          className="object-cover object-[center_64%] sepia-[0.25] saturate-[0.95]"
        />
      </motion.div>

      {/* Portrait */}
      <motion.div
        style={{ y: portraitY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.25 }}
        className={
          compact
            ? "absolute inset-x-0 top-6 bottom-0 flex justify-center"
            : "absolute bottom-0 left-[6%] h-[94%] w-[78%]"
        }
      >
        <Image
          src={siteImages.heroPortrait}
          alt="Portrait of a woman in a patterned gele and beaded necklace"
          fill
          priority
          sizes={compact ? "100vw" : "(min-width: 1024px) 45vw, 100vw"}
          className="object-contain object-bottom"
        />
      </motion.div>

    </>
  );
}

export function MarketingHero() {
  const reduceMotion = useReducedMotion();
  const { data: tours = [], isPending: toursPending } = useTours({ limit: TOURS_LIMIT });
  /** Featured card = first published tour from the Tourism API (no hardcoded fallbacks). */
  const featuredTour = useMemo(() => (tours.length ? tours[0] : null), [tours]);

  // Layered scroll parallax: portrait, scenery and copy drift at different rates.
  // The hero is the first thing on the page, so raw page scroll is the progress.
  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 70]);
  const sceneryY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : -50]);
  const copyY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 40]);

  const featureCard = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 1 }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 2 }}
      >
        {toursPending ? (
          <div className="h-[150px] w-[340px] animate-pulse rounded-3xl bg-white/70" />
        ) : (
          <Link
            href={featuredTour ? `/visit/${featuredTour.slug}` : landingLinks.visit}
            className="group flex w-[340px] items-center gap-4 rounded-3xl bg-white/90 p-4 pl-6 no-underline shadow-[0_30px_60px_-24px_rgba(87,45,20,0.45)] ring-1 ring-white/80 backdrop-blur-xl transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_36px_70px_-24px_rgba(87,45,20,0.55)]"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-(--clay)">
                {featuredTour ? "Featured tour" : "Tours & Travel"}
              </p>
              <p className="line-clamp-2 pt-2 text-lg font-medium leading-snug text-stone-900">
                {featuredTour ? featuredTour.name : "Heritage expeditions"}
              </p>
              <span className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border border-(--clay)/60 text-(--clay) transition-all duration-300 ease-out group-hover:bg-(--clay) group-hover:text-white">
                <ArrowRight size={14} />
              </span>
            </div>
            <div className="relative h-[118px] w-[132px] shrink-0 overflow-hidden rounded-2xl bg-stone-200">
              <Image
                src={featuredTour?.img || siteImages.featuredHeritage}
                alt=""
                fill
                sizes="132px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                unoptimized={Boolean(featuredTour?.img)}
              />
            </div>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#f8f1e7] [--clay:#b5441f]">
      {/* Paper grain */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
        aria-hidden
      />

      {/* ---------- Mobile / tablet: portrait card ---------- */}
      <div className="px-4 pt-4 pb-14 lg:hidden">
        <div className="relative h-[620px] overflow-hidden rounded-[28px] bg-[#f3e2cd] shadow-[0_30px_60px_-30px_rgba(87,45,20,0.6)] sm:h-[680px]">
          <PortraitStage portraitY={portraitY} sceneryY={sceneryY} compact />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#1c120c]/15 via-45% to-[#140c08]/95" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <h1 style={TITLE_STYLE} className="text-[clamp(2.75rem,12vw,4.25rem)] font-black uppercase text-white">
              <HeadlineLines accentClassName="text-white" />
            </h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="max-w-sm pt-4 text-[15px] leading-relaxed text-white/85"
            >
              Open-access African heritage. Read the stories, then walk the places they describe.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.62} className="pt-6">
              <Link
                href={landingLinks.explore}
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 text-sm font-semibold text-(--clay) no-underline transition-transform duration-300 ease-out active:scale-[0.98]"
              >
                Enter Gesi
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="pt-8">
          <Link
            href={landingLinks.visit}
            className="inline-flex items-center gap-3 text-sm font-semibold text-stone-800 no-underline"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white/60">
              <Compass size={16} />
            </span>
            Heritage tours
          </Link>
        </div>
      </div>

      {/* ---------- Desktop: copy left, portrait stage right ---------- */}
      <div className="relative hidden min-h-[max(680px,calc(100svh-64px))] lg:flex lg:items-center">
        <div className="absolute inset-y-0 right-0 w-[56%]">
          <PortraitStage portraitY={portraitY} sceneryY={sceneryY} />
          <div className="absolute right-[5%] bottom-[14%] z-10">{featureCard}</div>
        </div>

        <motion.div style={{ y: copyY }} className="landing-container relative z-10 py-20">
          <div className="max-w-[640px]">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.05}
              className="flex items-center gap-4 text-sm font-medium uppercase tracking-[0.4em] text-(--clay)"
            >
              <span>Read</span>
              <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
              <span>Explore</span>
              <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
              <span>Walk it</span>
            </motion.p>

            <h1 style={TITLE_STYLE} className="pt-7 text-[clamp(4rem,6.4vw,6.25rem)] font-black uppercase text-stone-950">
              <HeadlineLines accentClassName="text-(--clay)" />
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="max-w-[30rem] pt-6 text-xl leading-relaxed text-stone-600"
            >
              Open-access African heritage. Read the stories, then walk the places they describe.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.62}
              className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-10"
            >
              <Link
                href={landingLinks.explore}
                className="group inline-flex h-14 items-center gap-3 rounded-xl bg-(--clay) px-8 text-base font-medium text-white no-underline shadow-[0_14px_34px_-14px_var(--clay)] transition-[transform,box-shadow,filter] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-16px_var(--clay)] hover:brightness-110 active:translate-y-0"
              >
                Enter Gesi
                <ArrowRight size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
              <Link
                href={landingLinks.visit}
                className="group inline-flex items-center gap-4 text-base font-semibold text-stone-900 no-underline"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-300 bg-white/50 backdrop-blur transition-all duration-300 ease-out group-hover:border-(--clay) group-hover:text-(--clay)">
                  <Compass size={18} className="transition-transform duration-500 ease-out group-hover:rotate-45" />
                </span>
                <span className="transition-colors duration-300 group-hover:text-(--clay)">Heritage tours</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
