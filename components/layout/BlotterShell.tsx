import type { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';

type BlotterShellProps = { children: ReactNode };

export function BlotterShell({ children }: BlotterShellProps) {
  const [location] = useLocation();
  const isWrite = location === '/write';

  return (
    <div className="noise blotter-app">
      <div className="blotter-wrap">
        <nav className="blotter-tabs" aria-label="Mode selection">
          <Link href="/" data-testid="link-read-mode" className={`blotter-tab ${!isWrite ? 'active' : ''}`}>read mode</Link>
          <Link href="/write" data-testid="link-write-mode" className={`blotter-tab ${isWrite ? 'active' : ''}`}>write mode</Link>
        </nav>
        <main>{children}</main>
        <footer className="blotter-footer">{isWrite ? 'only you can write here' : 'ifrah.tech'}</footer>
      </div>
    </div>
  );
}