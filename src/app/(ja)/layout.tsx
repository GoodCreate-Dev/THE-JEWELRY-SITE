import "../globals.css";
import { Motion } from "@/components/Motion";
import { fontVars } from "@/lib/fonts";

// Root layout for the Japanese site. The inline script marks JS as available
// before paint, so fade-ins start hidden only when the script that reveals them can run.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
