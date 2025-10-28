/// <reference types="vite/client" />

// CSS Modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// CSS
declare module "*.css";

// Images
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}
