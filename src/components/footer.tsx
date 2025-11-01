import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} HackTrack. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:contact@hacktrack.com"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Mail"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/kumar-satyam-055841394"
            className="text-muted-foreground hover:text-foreground"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://www.instagram.com/official_satya_.0001_?igsh=dGk3ZWw3MDZ1eWI5"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
