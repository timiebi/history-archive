/**
 * Dashboard area: no main app Navbar/Footer. Dashboard has its own header and sidebar.
 * Routes under (dashboard)/dashboard/* use only this layout + the dashboard shell.
 */
export default function DashboardAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
