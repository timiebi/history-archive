import { LoggedInMarketingRedirect } from "@/components/landing/LoggedInMarketingRedirect";
import { MarketingLanding } from "@/components/landing/MarketingLanding";

/** Apex marketing — logged-in users soft-redirect to /explore unless ?marketing=1 */
export default function MarketingHomePage() {
  return (
    <>
      <LoggedInMarketingRedirect />
      <MarketingLanding />
    </>
  );
}
