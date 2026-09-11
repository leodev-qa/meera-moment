import { Link } from "@tanstack/react-router";
import { campaignTemplates } from "@/lib/events";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export function TemplateGrid({
  selectedId,
  onSelect,
  asLinks = false,
}: {
  selectedId?: string;
  onSelect?: (id: string) => void;
  asLinks?: boolean;
}) {
  const { lang } = useLang();
  const templates = campaignTemplates();

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {templates.map((ev) => {
        const selected = selectedId === ev.id;
        const body = (
          <>
            <img
              src={ev.sample}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 px-3 py-2.5 text-start text-sm font-medium tracking-tight text-cream">
              {ev.name[lang]}
            </span>
          </>
        );
        const cls = cn(
          "group relative aspect-square overflow-hidden rounded-xl shadow-border transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.96]",
          selected && "ring-2 ring-leaf ring-offset-2 ring-offset-forest-deep",
        );
        if (asLinks) {
          return (
            <Link
              key={ev.id}
              to="/booth"
              search={{ event: ev.id }}
              className={cls}
            >
              {body}
            </Link>
          );
        }
        return (
          <button
            key={ev.id}
            type="button"
            onClick={() => onSelect?.(ev.id)}
            className={cls}
          >
            {body}
          </button>
        );
      })}
    </div>
  );
}
