import { Helmet } from "react-helmet-async";
import { developer } from "../../data/developer-data";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "Otmane Touhami • Portfolio",
  description = "Distributed Systems & AI Master's Student · Full-Stack Engineer. Explore my projects, experience in Spring Boot, React, Angular, microservices, and more.",
  keywords = [
    "Otmane Touhami",
    "Portfolio",
    "Full Stack Developer",
    "Software Engineer",
    "Spring Boot",
    "React",
    "Angular",
    "TypeScript",
    "Microservices",
    "Distributed Systems",
    "AI",
    "Java",
    "Python",
    "Web Development",
  ],
  image = "/og-image.png",
  url = "https://otmane.dev/",
  type = "website",
}: SEOProps) {
  const fullTitle =
    title === "Otmane Touhami • Portfolio"
      ? title
      : `${title} | Otmane Touhami`;

  // Structured Data - Person Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: developer.profile.name,
    jobTitle: developer.profile.headline,
    description: developer.profile.bio,
    email: developer.profile.email,
    telephone: developer.profile.phone,
    url: developer.profile.socials.website,
    sameAs: [
      developer.profile.socials.github,
      developer.profile.socials.linkedin,
    ].filter(Boolean),
    knowsAbout: [
      "Spring Boot",
      "React",
      "Angular",
      "TypeScript",
      "Java",
      "Python",
      "Microservices",
      "Distributed Systems",
      "Artificial Intelligence",
    ],
  };

  // Structured Data - Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Otmane Touhami Portfolio",
    url: developer.profile.socials.website,
    description: description,
    author: {
      "@type": "Person",
      name: developer.profile.name,
    },
  };

  // Structured Data - Professional Service Schema
  const professionalSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${developer.profile.name} - Software Engineering Services`,
    description: developer.profile.headline,
    url: developer.profile.socials.website,
    serviceType: "Software Development",
    areaServed: "Worldwide",
    availableLanguage: ["English", "French", "Arabic"],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content="Otmane Touhami" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Otmane Touhami Portfolio" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(professionalSchema)}
      </script>
    </Helmet>
  );
}
