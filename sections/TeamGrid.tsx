import { asset } from "@/lib/paths";

export function TeamGrid({ members }: { members: readonly { name: string; role: string; photo: string }[] }) {
  return (
    <ul className="mt-16 grid gap-12 sm:grid-cols-3">
      {members.map((m) => (
        <li key={m.name} className="text-center">
          <img
            src={asset(m.photo)}
            alt={m.name}
            width={222}
            height={222}
            loading="lazy"
            className="mx-auto h-[222px] w-[222px] rounded-full object-cover"
          />
          <p className="eyebrow mt-6">{m.name}</p>
          <p className="text-[13px] text-navy">{m.role}</p>
        </li>
      ))}
    </ul>
  );
}
