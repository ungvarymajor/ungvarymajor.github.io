import { useReveal } from "@/lib/use-reveal";

export function SectionTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  const ref = useReveal<HTMLHeadingElement>();
  return (
    <h2
      id={id}
      ref={ref}
      className="reveal text-center text-xl md:text-2xl uppercase tracking-display font-light text-foreground"
    >
      {children}
    </h2>
  );
}
