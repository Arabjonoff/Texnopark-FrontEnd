import "server-only";

import { dashGet } from "@/lib/dashboard/api";
import type { Option, Resource } from "@/lib/dashboard/resources";
import type { Paginated, ResourceItem } from "@/lib/dashboard/types";

/** Formadagi "relation" maydonlari uchun tanlov ro'yxatlari (masalan video story -> kurs) */
export async function loadRelations(resource: Resource): Promise<Record<string, Option[]>> {
  const needed = new Set(resource.sections.flatMap((section) => section.fields.map((field) => field.relation).filter(Boolean)));
  const relations: Record<string, Option[]> = {};

  if (needed.has("courses")) {
    const courses = await dashGet<Paginated<ResourceItem>>("/courses/?page_size=100&ordering=title");
    relations.courses = courses.results.map((course) => ({ value: String(course.id), label: String(course.title) }));
  }
  return relations;
}
