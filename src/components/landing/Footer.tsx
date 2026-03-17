import { MobiusLogoMark } from "@/components/brand/MobiusLogo";

export function Footer() {
  return (
    <footer className="border-t border-surface-200/60">
      <div className="max-w-apple-wide mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MobiusLogoMark size={20} />
            <span className="text-body-sm font-medium text-surface-600">
              Otium
            </span>
          </div>
          <p className="text-caption text-surface-400">
            © {new Date().getFullYear()} Otium. Helping you discover what you love.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-caption text-surface-400 hover:text-surface-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-caption text-surface-400 hover:text-surface-600 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
