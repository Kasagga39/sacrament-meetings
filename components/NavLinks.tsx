'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLinkItem {
  href: string;
  label: string;
}

export interface NavLinksProps {
  links?: NavLinkItem[];
  tone?: 'dark' | 'light';
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { href: '/', label: 'Home' },
  { href: '/meetings', label: 'Meetings' },
  { href: '/meetings/current', label: 'This Week' },
];

function isActiveLink(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  if (href === '/meetings/current') {
    return pathname === '/meetings/current';
  }
  if (href === '/meetings') {
    return pathname === '/meetings' || pathname.startsWith('/meetings/');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavLinks({ links = DEFAULT_LINKS, tone = 'dark' }: NavLinksProps) {
  const pathname = usePathname() ?? '';
  const activeClass =
    tone === 'dark' ? 'bg-white text-primary' : 'bg-primary text-white';
  const inactiveClass =
    tone === 'dark'
      ? 'text-white/85 hover:bg-white/15 hover:text-white'
      : 'text-primary/80 hover:bg-primary/10 hover:text-primary';

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap items-center gap-2">
        {links.map((link) => {
          const isActive = isActiveLink(link.href, pathname);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}