import { createFileRoute } from "@tanstack/react-router";
import "@fontsource/manrope/300.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Profilunk } from "@/components/site/Profilunk";
import { References } from "@/components/site/References";
import { About } from "@/components/site/About";
import { MoreServices } from "@/components/site/MoreServices";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { EMAILS, PHONE_DISPLAY_LIST } from "@/lib/contact";
import { translations } from "@/lib/i18n/translations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: translations.hu.meta.title },
      { name: "description", content: translations.hu.meta.description },
      { property: "og:title", content: translations.hu.meta.title },
      { property: "og:description", content: translations.hu.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "hu_HU" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Header />
      <main>
        <Hero />
        <Profilunk />
        <References />
        <About />
        <MoreServices />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Vámos Vill Kft.",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Dózsa György út 2/B",
              postalCode: "8248",
              addressLocality: "Nemesvámos",
              addressCountry: "HU",
            },
            telephone: [...PHONE_DISPLAY_LIST],
            email: EMAILS.office,
          }),
        }}
      />
    </>
  );
}
