import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SectionTitle } from "./SectionTitle";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

export function Contact() {
  const { locale, t } = useLocale();
  const [submitting, setSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, t.contact.errors.name),
        email: z.string().email(t.contact.errors.email),
        message: z.string().min(5, t.contact.errors.message),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success(t.contact.success);
    reset();
    void values;
  };

  return (
    <section id="kapcsolat" className="relative bg-surface py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />

      <div className="relative mx-auto max-w-[760px] px-5 md:px-8">
        <SectionTitle>{t.contact.title}</SectionTitle>

        <div className="relative mt-12 overflow-hidden rounded-2xl border border-white/15 bg-surface-raised p-6 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.45)] md:p-8">
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-primary md:h-20 md:w-20"
            style={{ borderBottomLeftRadius: "100%" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 bg-primary/85 md:h-14 md:w-14"
            style={{ borderTopRightRadius: "100%" }}
          />

          <form
            key={locale}
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex flex-col gap-5 pt-12 md:pt-14"
            noValidate
          >
            <Field label={t.contact.name} error={errors.name?.message}>
              <input
                {...register("name")}
                type="text"
                autoComplete="name"
                className="w-full rounded-xl border border-white/20 bg-surface px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder={t.contact.namePh}
              />
            </Field>

            <Field label={t.contact.email} error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-white/20 bg-surface px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder={t.contact.emailPh}
              />
            </Field>

            <Field label={t.contact.message} error={errors.message?.message}>
              <textarea
                {...register("message")}
                rows={5}
                className="w-full resize-y rounded-xl border border-white/20 bg-surface px-4 py-3 text-[15px] leading-7 text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder={t.contact.messagePh}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 self-center rounded-xl border border-white/20 bg-surface px-10 py-3 text-sm font-medium uppercase tracking-display text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
            >
              {submitting ? t.contact.sending : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground/92">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-primary">{error}</span> : null}
    </label>
  );
}
