import { login } from '@/routes';
import { router } from '@inertiajs/react';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-base-300/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <span className="text-sm font-semibold text-primary-foreground">
              M
            </span>
          </div>
          <span className="font-semibold text-foreground">Mealo Planner</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#preview"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Preview
          </a>
        </nav>

        {/* CTA */}
        <div className="flex gap-3">
          <button className="btn rounded-full btn-secondary">Join Beta</button>
          <button
            className="btn rounded-full btn-outline btn-secondary"
            onClick={() => router.get(login.url())}
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
