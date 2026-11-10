export function AnnouncementBar({ text }: { text?: string }) {
  if (!text) return null;
  return <div className="bg-accent py-2 text-center text-[0.6875rem] font-semibold tracking-[0.08em] text-ink uppercase">{text}</div>;
}
