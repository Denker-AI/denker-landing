import { Icons } from "@/components/icons";
import { DenkerLogo } from "@/components/denker-logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-glass-stroke bg-canvas px-6 py-12 lg:px-12" data-testid="landing-footer">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <DenkerLogo variant="wordmark" height={22} />
          <span className="text-xs text-muted">
            &copy; {new Date().getFullYear()} Denker. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Denker-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-primary"
            data-testid="footer-github"
          >
            <Icons.Github className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/company/denker-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-primary"
            data-testid="footer-linkedin"
          >
            <Icons.Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:hello@denker.ai"
            className="text-muted transition-colors hover:text-primary"
            data-testid="footer-email"
          >
            <Icons.Mail className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
