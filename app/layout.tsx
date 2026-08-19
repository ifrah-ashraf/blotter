import type { Metadata } from "next";
import { JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import {Providers} from './provider'

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
      <body className="min-h-full flex flex-col font-sans"><Providers>
          {children}
        </Providers></body>
    </html>
  );
}
