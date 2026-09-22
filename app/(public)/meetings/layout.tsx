import NavLinks from '@/components/NavLinks';
import type { NavLinkItem } from '@/components/NavLinks';

const SECTION_LINKS: NavLinkItem[] = [
  { href: '/meetings', label: 'All Meetings' },
  { href: '/meetings/current', label: 'This Week' },
];

export default function MeetingsLayout(props: LayoutProps<'/meetings'>) {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-10">
      <div className="no-print mb-8">
        <NavLinks links={SECTION_LINKS} tone="light" />
      </div>
      {props.children}
    </div>
  );
}