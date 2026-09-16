import Link from 'next/link';
import NavLinks from './NavLinks';

const WARD_NAME = 'Springfield 1st Ward';

export default function Header() {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-primary text-white no-print">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="flex flex-col gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span className="font-serif text-2xl font-bold leading-tight">{WARD_NAME}</span>
          <span className="text-sm text-white/80">{today}</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}