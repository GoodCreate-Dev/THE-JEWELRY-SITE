import type { Metadata } from "next";
import "../globals.css";
import { Motion } from "@/components/Motion";
import { Intro, PageCover } from "@/components/Shared";
import { asset } from "@/content/site";
import { fontVars } from "@/lib/fonts";
import { share } from "@/lib/meta";

// Root layout for the English site. The inline script marks JS as available
// before paint, so fade-ins start hidden only when the script that reveals them can run.
// Also skips the logo intro when it has already played in this visit, and keeps a closed notice closed.
const INIT = "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('tj-intro'))d.classList.add('intro-seen');else sessionStorage.setItem('tj-intro','1');if(sessionStorage.getItem('tj-notice'))d.classList.add('notice-closed')}catch(e){}";

// Share previews (LINE, Instagram, X, email); pages add their own title and description.
export const metadata: Metadata = { metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3001"), ...share("en") };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} style={{ "--logo-url": `url(${asset("/images/logo.svg")})` } as React.CSSProperties} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT }} />
      </head>
      <body>
        <Intro />
        {children}
        <PageCover />
        <Motion />
      </body>
    </html>
  );
}
