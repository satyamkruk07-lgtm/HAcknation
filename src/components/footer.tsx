import { Instagram, Linkedin, Mail } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex-shrink-0">
          <Logo />
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} HackNation. Designed and Developed by ACM Student Chapter
        </p>
        <div className="text-sm">
          <h4 className="font-semibold mb-1">Contact ACM Co-ordinator</h4>
          <ul className="space-y-0 text-muted-foreground">
            <li>Kumar Satyam - <a href="tel:7060550243" className="hover:text-foreground">7060550243</a></li>
            <li>Shivam Kumar - <a href="tel:9693561946" className="hover:text-foreground">9693561946</a></li>
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="mailto:satyamkruk07@gmail.com"
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
            href="https://www.instagram.com/acm_sgoc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
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
