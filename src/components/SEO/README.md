# SEO Component

This component uses `react-helmet-async` to manage dynamic SEO metadata for the portfolio.

## Features

- **Dynamic Meta Tags**: Automatically updates title, description, and keywords
- **Open Graph Support**: Enhanced sharing on Facebook and other social platforms
- **Twitter Cards**: Optimized preview cards for Twitter
- **Structured Data**: JSON-LD schema markup for search engines including:
  - Person Schema (personal information)
  - Website Schema (site structure)
  - Professional Service Schema (services offered)
- **Canonical URLs**: Prevents duplicate content issues

## Usage

### Default SEO (Homepage)

```tsx
import SEO from "./components/SEO/SEO";

function App() {
  return (
    <>
      <SEO />
      {/* Your app content */}
    </>
  );
}
```

### Custom SEO (Specific Pages/Sections)

```tsx
<SEO
  title="Projects"
  description="Explore my portfolio of full-stack projects including Spring Boot, React, and microservices applications."
  keywords={["Projects", "Portfolio", "Spring Boot", "React"]}
  url="https://otmane.dev/#projects"
/>
```

## Props

| Prop          | Type     | Default                      | Description                |
| ------------- | -------- | ---------------------------- | -------------------------- |
| `title`       | string   | "Otmane Touhami • Portfolio" | Page title                 |
| `description` | string   | Default bio                  | Meta description           |
| `keywords`    | string[] | Default keywords array       | SEO keywords               |
| `image`       | string   | "/og-image.png"              | Social media preview image |
| `url`         | string   | "https://otmane.dev/"        | Canonical URL              |
| `type`        | string   | "website"                    | Open Graph type            |

## Structured Data

The component automatically generates three types of JSON-LD structured data:

1. **Person Schema**: Defines you as a person with contact info and skills
2. **Website Schema**: Describes the portfolio website
3. **Professional Service Schema**: Highlights your software development services

## Social Media Image

Create an Open Graph image at `public/og-image.png` with:

- Dimensions: 1200x630px
- Format: PNG or JPG
- Content: Your name, headline, and branding

## SEO Best Practices Implemented

✅ Unique, descriptive titles  
✅ Compelling meta descriptions (150-160 characters)  
✅ Relevant keywords  
✅ Canonical URLs to avoid duplicate content  
✅ Open Graph tags for social sharing  
✅ Twitter Card optimization  
✅ Structured data for rich search results  
✅ Mobile-friendly viewport settings

## Testing

### Test Open Graph Tags

- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

### Test Twitter Cards

- https://cards-dev.twitter.com/validator

### Test Structured Data

- https://search.google.com/test/rich-results
- https://validator.schema.org/

## Performance

`react-helmet-async` is used instead of `react-helmet` because:

- Better performance with async rendering
- Thread-safe for SSR (Server-Side Rendering)
- No blocking of the main thread
- React 18+ compatible
