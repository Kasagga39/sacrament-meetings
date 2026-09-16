const WARD_NAME = 'Springfield 1st Ward';

export default function Footer() {
  return (
    <footer className="no-print border-t border-stone-200 bg-paper">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 py-6 text-center">
        <p className="text-sm font-medium text-stone-700">{WARD_NAME} &middot; Sacrament Meeting Planner</p>
        <p className="text-xs text-stone-500">
          A tool for ward leaders to plan and share the weekly sacrament meeting agenda.
        </p>
      </div>
    </footer>
  );
}