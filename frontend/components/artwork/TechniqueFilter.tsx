"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Technique } from "@/types/artwork";

type TechniqueFilterProps = {
  techniques: Technique[];
  activeTechnique?: string;
  activeOrdering?: string;
  availableOnly?: boolean;
};

export default function TechniqueFilter({
  techniques,
  activeTechnique,
  activeOrdering,
  availableOnly = false,
}: TechniqueFilterProps) {
  const router = useRouter();

  function buildParams() {
    const params = new URLSearchParams();

    if (activeTechnique) {
      params.set("technique", activeTechnique);
    }

    if (activeOrdering) {
      params.set("ordering", activeOrdering);
    }

    if (availableOnly) {
      params.set("available", "true");
    }

    return params;
  }

  function handleTechniqueChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = buildParams();
    const technique = event.target.value;

    if (technique) {
      params.set("technique", technique);
    } else {
      params.delete("technique");
    }

    const query = params.toString();

    router.push(query ? `/gallery?${query}` : "/gallery");
  }

  const availableParams = buildParams();

  if (availableOnly) {
    availableParams.delete("available");
  } else {
    availableParams.set("available", "true");
  }

  const availableQuery = availableParams.toString();

  const availableUrl = availableQuery
    ? `/gallery?${availableQuery}`
    : "/gallery";

  return (
    <div className="mt-14 border-y border-black/10 py-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <label className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Technique
          </span>

          <select
            value={activeTechnique || ""}
            onChange={handleTechniqueChange}
            aria-label="Filter artworks by technique"
            className="
              cursor-pointer
              border-0
              border-b
              border-black/20
              bg-transparent
              pb-1
              text-[10px]
              uppercase
              tracking-[0.16em]
              text-black/65
              outline-none
              transition
              focus:border-[#9b1c1c]
            "
          >
            <option value="">All techniques</option>

            {techniques.map((technique) => (
              <option key={technique.id} value={technique.slug}>
                {technique.name}
              </option>
            ))}
          </select>
        </label>

        <Link
          href={availableUrl}
          aria-pressed={availableOnly}
          className={`
            border-b
            pb-1
            text-[10px]
            uppercase
            tracking-[0.22em]
            transition-colors

            ${
              availableOnly
                ? "border-[#9b1c1c] text-[#9b1c1c]"
                : "border-transparent text-black/45 hover:text-black"
            }
          `}
        >
          Available only
        </Link>
      </div>
    </div>
  );
}
