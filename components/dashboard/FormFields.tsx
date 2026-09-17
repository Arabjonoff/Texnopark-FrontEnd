"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_OPTIONS, THEME_OPTIONS, type Field, type Option } from "@/lib/dashboard/resources";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { themeClasses } from "@/lib/theme";
import type { Theme } from "@/lib/types";

export const inputClass =
  "block w-full rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-sm text-dash-text placeholder:text-dash-muted/60 shadow-sm transition-colors focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/20 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/20";

type FieldProps = {
  field: Field;
  value: unknown;
  errors?: string[];
  relationOptions?: Option[];
};

function FieldShell({
  field,
  id,
  errors,
  children,
  asFieldset = false,
}: {
  field: Field;
  id: string;
  errors?: string[];
  children: React.ReactNode;
  asFieldset?: boolean;
}) {
  const Label = asFieldset ? "legend" : "label";
  const Wrapper = asFieldset ? "fieldset" : "div";
  return (
    <Wrapper className={cn("min-w-0", field.full && "sm:col-span-2")}>
      <Label {...(asFieldset ? {} : { htmlFor: id })} className="mb-1.5 block text-sm font-medium text-dash-text">
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
      </Label>
      {children}
      {errors?.length ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {errors.join(" ")}
        </p>
      ) : (
        field.help && (
          <p id={`${id}-help`} className="mt-1.5 text-xs text-dash-muted">
            {field.help}
          </p>
        )
      )}
    </Wrapper>
  );
}

function a11y(id: string, field: Field, errors?: string[]) {
  return {
    id,
    "aria-invalid": errors?.length ? true : undefined,
    "aria-describedby": errors?.length ? `${id}-error` : field.help ? `${id}-help` : undefined,
  };
}

function asString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

// --- Oddiy maydonlar ------------------------------------------------------------------------------

export function FormField({ field, value, errors, relationOptions }: FieldProps) {
  const id = useId();
  const common = a11y(id, field, errors);

  switch (field.type) {
    case "textarea":
      return (
        <FieldShell field={field} id={id} errors={errors}>
          <textarea
            {...common}
            name={field.name}
            rows={field.rows ?? 4}
            defaultValue={asString(value)}
            placeholder={field.placeholder}
            required={field.required}
            className={cn(inputClass, "resize-y leading-relaxed")}
          />
        </FieldShell>
      );

    case "select":
    case "relation":
      return (
        <FieldShell field={field} id={id} errors={errors}>
          <select {...common} name={field.name} defaultValue={asString(value)} required={field.required} className={inputClass}>
            {field.type === "relation" && <option value="">— Tanlanmagan —</option>}
            {(field.type === "relation" ? relationOptions ?? [] : field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case "switch":
      return <SwitchField field={field} value={Boolean(value)} />;

    case "icon":
      return <IconField field={field} value={asString(value)} errors={errors} />;

    case "theme":
      return <ThemeField field={field} value={asString(value)} errors={errors} />;

    case "image":
      return <ImageField field={field} value={typeof value === "string" ? value : null} errors={errors} />;

    case "stringList":
      return <StringListField field={field} value={Array.isArray(value) ? (value as string[]) : []} errors={errors} />;

    case "repeater":
      return <RepeaterField field={field} value={Array.isArray(value) ? (value as Record<string, string>[]) : []} errors={errors} />;

    default: {
      const inputType =
        field.type === "number" ? "number"
        : field.type === "url" ? "url"
        : field.type === "date" ? "date"
        : field.type === "time" ? "time"
        : field.type === "datetime" ? "datetime-local"
        : "text";
      // API datetime'ni Toshkent vaqti bilan qaytaradi: "2026-09-17T18:28:56+05:00" -> "2026-09-17T18:28"
      const defaultValue = field.type === "datetime" || field.type === "time" ? asString(value).slice(0, field.type === "time" ? 5 : 16) : asString(value);
      return (
        <FieldShell field={field} id={id} errors={errors}>
          <input
            {...common}
            type={inputType}
            name={field.name}
            defaultValue={defaultValue}
            placeholder={field.placeholder}
            required={field.required}
            inputMode={field.type === "number" ? "numeric" : undefined}
            min={field.type === "number" ? 0 : undefined}
            className={cn(inputClass, field.type === "slug" && "font-mono")}
          />
        </FieldShell>
      );
    }
  }
}

// --- Switch ------------------------------------------------------------------------------------

function SwitchField({ field, value }: { field: Field; value: boolean }) {
  const [checked, setChecked] = useState(value);
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-dash-border px-4 py-3 sm:col-span-2">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-dash-text">{field.label}</label>
        {field.help && <p className="text-xs text-dash-muted">{field.help}</p>}
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input id={id} type="checkbox" name={field.name} checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer sr-only" role="switch" />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-dash-primary peer-focus-visible:ring-2 peer-focus-visible:ring-dash-primary peer-focus-visible:ring-offset-2 dark:bg-slate-600" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

// --- Ikonka va rang tanlash ---------------------------------------------------------------------------

function IconField({ field, value, errors }: { field: Field; value: string; errors?: string[] }) {
  const id = useId();
  const [selected, setSelected] = useState(value || ICON_OPTIONS[0].value);
  return (
    <FieldShell field={field} id={id} errors={errors} asFieldset>
      <input type="hidden" name={field.name} value={selected} />
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-7">
        {ICON_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelected(option.value)}
            aria-pressed={selected === option.value}
            title={option.label}
            aria-label={option.label}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border transition-colors",
              selected === option.value
                ? "border-dash-primary bg-dash-primary/10 text-dash-primary"
                : "border-dash-border text-dash-muted hover:bg-dash-subtle hover:text-dash-text",
            )}
          >
            <DynamicIcon icon={option.value} className="h-5 w-5" />
          </button>
        ))}
      </div>
    </FieldShell>
  );
}

function ThemeField({ field, value, errors }: { field: Field; value: string; errors?: string[] }) {
  const id = useId();
  const [selected, setSelected] = useState(value || "blue");
  return (
    <FieldShell field={field} id={id} errors={errors} asFieldset>
      <input type="hidden" name={field.name} value={selected} />
      <div className="flex flex-wrap gap-2">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSelected(option.value)}
            aria-pressed={selected === option.value}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
              selected === option.value ? "border-dash-primary bg-dash-primary/10 text-dash-text" : "border-dash-border text-dash-muted hover:bg-dash-subtle",
            )}
          >
            <span className={cn("h-4 w-4 rounded-full", themeClasses[option.value as Theme].solid)} aria-hidden />
            {option.label}
          </button>
        ))}
      </div>
    </FieldShell>
  );
}

// --- Rasm yuklash ----------------------------------------------------------------------------------

function ImageField({ field, value, errors }: { field: Field; value: string | null; errors?: string[] }) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(value);
  const [cleared, setCleared] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <FieldShell field={field} id={id} errors={errors}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-dash-border bg-dash-subtle sm:w-44">
          {preview && !cleared ? (
            // eslint-disable-next-line @next/next/no-img-element -- yuklanayotgan fayl ko'rinishi
            <img src={preview} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="h-7 w-7 text-dash-muted" />
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <label htmlFor={id} className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 font-medium text-dash-text hover:bg-dash-subtle focus-within:ring-2 focus-within:ring-dash-primary">
            <ImagePlus className="h-4 w-4" />
            {preview && !cleared ? "Rasmni almashtirish" : "Rasm tanlash"}
            <input
              {...a11y(id, field, errors)}
              type="file"
              name={field.name}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setPreview(URL.createObjectURL(file));
                setFileName(file.name);
                setCleared(false);
              }}
            />
          </label>
          {fileName && <p className="max-w-60 truncate text-xs text-dash-muted">{fileName}</p>}
          {value && !fileName && (
            <label className="inline-flex items-center gap-2 text-dash-muted">
              <input type="checkbox" name={`${field.name}Clear`} checked={cleared} onChange={(e) => setCleared(e.target.checked)} className="h-4 w-4 rounded border-dash-border accent-red-600" />
              Rasmni olib tashlash
            </label>
          )}
          <p className="text-xs text-dash-muted">PNG, JPG, WEBP yoki SVG</p>
        </div>
      </div>
    </FieldShell>
  );
}

// --- Ro'yxat maydonlari ---------------------------------------------------------------------------------

function moveItem<T>(list: T[], from: number, to: number) {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function StringListField({ field, value, errors }: { field: Field; value: string[]; errors?: string[] }) {
  const id = useId();
  // Har qatorga barqaror kalit — o'chirish/ko'chirishda fokus va matn aralashib ketmasin
  const [items, setItems] = useState(() => value.map((text, i) => ({ key: `${i}-${text}`, text })));
  return (
    <FieldShell field={field} id={id} errors={errors} asFieldset>
      <input type="hidden" name={field.name} value={JSON.stringify(items.map((item) => item.text))} />
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item.key} className="flex items-center gap-2">
            <span className="w-6 shrink-0 text-right text-xs tabular-nums text-dash-muted">{index + 1}.</span>
            <input
              value={item.text}
              aria-label={`${field.label}, ${index + 1}-qator`}
              placeholder={field.placeholder}
              onChange={(event) =>
                setItems((list) => list.map((row) => (row.key === item.key ? { ...row, text: event.target.value } : row)))
              }
              className={inputClass}
            />
            <button type="button" onClick={() => setItems((list) => list.filter((row) => row.key !== item.key))} className="shrink-0 rounded-lg p-2 text-dash-muted hover:bg-red-500/10 hover:text-red-600" aria-label={`${index + 1}-qatorni o'chirish`}>
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setItems((list) => [...list, { key: `new-${Date.now()}-${Math.random()}`, text: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-dash-primary hover:bg-dash-primary/10"
      >
        <Plus className="h-4 w-4" /> {field.addLabel ?? "Qo'shish"}
      </button>
    </FieldShell>
  );
}

function RepeaterField({ field, value, errors }: { field: Field; value: Record<string, string>[]; errors?: string[] }) {
  const id = useId();
  const subFields = field.subFields ?? [];
  const [rows, setRows] = useState(() => value.map((row, i) => ({ key: `${i}`, data: row })));

  const update = (key: string, name: string, text: string) =>
    setRows((list) => list.map((row) => (row.key === key ? { ...row, data: { ...row.data, [name]: text } } : row)));

  return (
    <FieldShell field={field} id={id} errors={errors} asFieldset>
      <input type="hidden" name={field.name} value={JSON.stringify(rows.map((row) => row.data))} />
      {rows.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-dash-border">
          <div className="hidden gap-2 border-b border-dash-border bg-dash-subtle px-3 py-2 text-xs font-medium text-dash-muted sm:flex">
            <span className="w-12" />
            {subFields.map((sub) => (
              <span key={sub.name} className={sub.width ?? "flex-1"}>{sub.label}</span>
            ))}
            <span className="w-9" />
          </div>
          <ul className="divide-y divide-dash-border">
            {rows.map((row, index) => (
              <li key={row.key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center">
                <div className="flex w-12 shrink-0 items-center gap-2 text-dash-muted sm:flex-col sm:gap-0">
                  <span className="text-xs tabular-nums sm:hidden">{index + 1}.</span>
                  <button type="button" onClick={() => setRows((list) => moveItem(list, index, index - 1))} disabled={index === 0} className="rounded p-0.5 hover:bg-dash-subtle hover:text-dash-text disabled:opacity-30" aria-label={`${index + 1}-qatorni yuqoriga`}>
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setRows((list) => moveItem(list, index, index + 1))} disabled={index === rows.length - 1} className="rounded p-0.5 hover:bg-dash-subtle hover:text-dash-text disabled:opacity-30" aria-label={`${index + 1}-qatorni pastga`}>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                {subFields.map((sub) => (
                  <input
                    key={sub.name}
                    type={sub.type}
                    value={row.data[sub.name] ?? ""}
                    placeholder={sub.placeholder}
                    aria-label={`${sub.label}, ${index + 1}-qator`}
                    onChange={(event) => update(row.key, sub.name, event.target.value)}
                    className={cn(inputClass, sub.width ?? "sm:flex-1")}
                  />
                ))}
                <button type="button" onClick={() => setRows((list) => list.filter((item) => item.key !== row.key))} className="self-end rounded-lg p-2 text-dash-muted hover:bg-red-500/10 hover:text-red-600 sm:self-auto" aria-label={`${index + 1}-qatorni o'chirish`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setRows((list) => [...list, { key: `new-${Date.now()}`, data: {} }])}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-dash-primary hover:bg-dash-primary/10"
      >
        <Plus className="h-4 w-4" /> {field.addLabel ?? "Qator qo'shish"}
      </button>
    </FieldShell>
  );
}
