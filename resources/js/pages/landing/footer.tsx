import { Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Description */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                <span className="text-sm font-semibold text-primary-foreground">
                  M
                </span>
              </div>
              <span className="font-semibold text-secondary">
                Mealo Planner
              </span>
            </div>
            <p className="max-w-xs text-center text-sm text-muted-foreground md:text-left">
              A personal side project to make meal planning simple and
              enjoyable.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-base-300 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Made with care. Not a commercial product.
          </p>
        </div>
      </div>
    </footer>
  );
}
