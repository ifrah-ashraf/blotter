import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import { Providers } from './provider'
import { Footer } from '@/components/ui/footer'
import { Analytics } from "@vercel/analytics/next"

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: "Blotter app",
  description: "Personal logbook",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <div className="flex-1">{children}</div>
        </Providers>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}