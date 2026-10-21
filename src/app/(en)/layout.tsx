import "../globals.css";
import { Motion } from "@/components/Motion";
import { Intro } from "@/components/Shared";
import { asset } from "@/content/site";
import { fontVars } from "@/lib/fonts";

// Root layout for the English site. The inline script marks JS as available
// before paint, so fade-ins start hidden only when the script that reveals them can run.
// Also skips the logo intro when it has already played in this visit.
const INIT = "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('tj-intro'))d.classList.add('intro-seen');else sessionStorage.setItem('tj-intro','1')}catch(e){}";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} style={{ "--logo-url": `url(${asset("/images/logo.svg")})` } as React.CSSProperties} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body>
        <Intro />
        {children}
        <Motion />
      </body>
    </html>
  );
}
