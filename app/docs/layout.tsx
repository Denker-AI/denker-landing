import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen bg-canvas"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 15% 20%, rgba(58,248,140,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 55% 45% at 80% 60%, rgba(96,165,250,0.05) 0%, transparent 70%)
        `,
        backgroundSize: "100% 100%, 100% 100%",
        backgroundAttachment: "fixed, fixed",
      }}
    >
      <LandingNav />
      {children}
      <LandingFooter />
    </div>
  );
}
