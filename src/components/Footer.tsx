import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-lg font-bold tracking-tighter">
          CLUB<span className="text-primary">//</span>PLAY
        </div>
        
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">О клубе</Link>
          <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
        </div>
        
        <div className="text-xs text-zinc-600">
          © 2026 Club Play. All rights reserved.
        </div>
      </div>
    </footer>
  );
}