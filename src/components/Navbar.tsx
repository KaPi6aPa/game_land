import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { LeadForm } from "./LeadForm";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tighter hover:opacity-80 transition-opacity">
            CLUB<span className="text-primary">//</span>PLAY
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">О клубе</Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Приватность</Link>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>Apply</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-background p-4 flex flex-col gap-4 animate-slide-up">
            <Link to="/about" className="text-sm font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>О клубе</Link>
            <Link to="/privacy" className="text-sm font-medium p-2" onClick={() => setIsMobileMenuOpen(false)}>Приватность</Link>
            <Button onClick={() => { setIsModalOpen(true); setIsMobileMenuOpen(false); }}>
              Подать заявку
            </Button>
          </div>
        )}
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Вступить в клуб">
        <LeadForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}