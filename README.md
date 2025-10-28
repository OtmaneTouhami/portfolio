# Portfolio Website

A modern, interactive portfolio website featuring both a **GUI mode** and a unique **CLI (Command-Line Interface) mode**, built with React, TypeScript, and Vite.

## ✨ Features

### Dual Interface Modes

- **GUI Mode**: A sleek, modern web interface with smooth animations and particle effects
- **CLI Mode**: An interactive terminal-style interface for a unique user experience
- Seamless switching between modes with state persistence

### GUI Components

- **Hero Section**: Dynamic introduction with social links and call-to-action
- **Experience Timeline**: Professional work history with visual timeline
- **Education Timeline**: Academic background and achievements
- **Certifications**: Professional certifications and credentials
- **Tech Stack**: Visual showcase of technical skills and technologies
- **Projects Gallery**: Featured projects with links and descriptions
- **Resume Downloads**: Multi-language resume downloads (EN/FR)
- **Contact Form**: Integrated email contact system via EmailJS
- **Interactive Background**: Particle effects using tsParticles

### CLI Features

- **Tab Completion**: Context-aware command suggestions
- **Command History**: Navigate previous commands with arrow keys
- **Aliases**: Create custom command shortcuts
- **Rich Commands**: View sections, projects, resume, contact info, and more
- **Easter Eggs**: Hidden commands for fun interactions
- **Contact Form**: Terminal-based message submission

## 🛠️ Tech Stack

### Core Technologies

- **React 19**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling

### Key Libraries

- **Framer Motion**: Smooth animations and transitions
- **tsParticles**: Interactive particle backgrounds
- **EmailJS**: Client-side email integration
- **Zustand**: Lightweight state management
- **React Icons**: Comprehensive icon library
- **Lenis**: Smooth scrolling experience

### Development Tools

- **ESLint**: Code linting with TypeScript support
- **PostCSS**: CSS processing and optimization

## 📁 Project Structure

```
portfolio/
├── public/
│   └── resume/           # Resume PDFs and markdown files
├── src/
│   ├── components/       # React components
│   │   ├── About/
│   │   ├── Certifications/
│   │   ├── CLI/         # Terminal interface
│   │   ├── Contact/
│   │   ├── Education/
│   │   ├── Experience/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── Projects/
│   │   ├── Resume/
│   │   ├── TechStack/
│   │   └── Timeline/
│   ├── data/            # Static data and configuration
│   │   ├── developer-data.ts  # Main data source
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── resume.ts
│   │   └── timeline.ts
│   ├── hooks/           # Custom React hooks
│   │   └── useAppStore.ts
│   ├── lib/             # Utility functions
│   ├── styles/          # Additional styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── .env                 # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm/yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/OtmaneTouhami/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Add your data**

   Update `src/data/developer-data.ts` with your personal information:

   - Profile information
   - Projects
   - Timeline (education & experience)
   - Certifications
   - Tech stack
   - Resume paths

5. **Add resume files**

   Place your resume PDFs in `public/resume`:

   - `en.pdf` (English resume)
   - `fr.pdf` (French resume)

### Development

Start the development server:

```bash
pnpm dev
```

The site will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

### Linting

Run ESLint:

```bash
pnpm lint
```

## 🎮 CLI Mode Usage

Switch to CLI mode by clicking the terminal icon. Here are some example commands:

### Basic Commands

```bash
# Show help
portfolio --help

# List all sections
portfolio sections ls

# View a specific section
portfolio sections about
portfolio sections experience

# List projects
portfolio projects ls

# View project details
portfolio projects "BudgetWise+"

# Open project link
portfolio projects open 1

# Download resume
portfolio resume -d en
portfolio resume -d fr

# Contact information
portfolio contact

# Tech stack
portfolio stack
```

### Utility Commands

```bash
# Change username
username-switch "YourName"

# Create alias
alias p='portfolio'
alias proj='portfolio projects'

# View aliases
alias

# Remove alias
unalias p

# View command history
history

# Clear screen
clear

# Switch back to GUI
switch gui
```

### Easter Eggs

```bash
portfolio coffee
portfolio konami
portfolio matrix
portfolio fortune
portfolio roll
portfolio rick
portfolio zen
portfolio haiku
portfolio ping
```

## 📧 Email Configuration

This portfolio uses [EmailJS](https://www.emailjs.com/) for the contact form:

1. Create an EmailJS account
2. Set up an email service
3. Create an email template
4. Copy your credentials to `.env`

Template variables:

- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - Message content

## 🎨 Customization

### Colors

Tailwind theme colors are configured in `tailwind.config.js`. The primary accent color is cyan (`#06b6d4`).

### Fonts

The project uses system fonts for optimal performance. Update the font family in `index.css` if needed.

### Icons

Tech stack icons are configured in `src/components/TechStack/TechStack.tsx` using `react-icons/si` (Simple Icons).

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The build output in `dist/` can be deployed to:

- Netlify
- GitHub Pages
- CloudFlare Pages
- AWS S3 + CloudFront

## 🔒 Environment Variables

Required environment variables:

| Variable                   | Description         |
| -------------------------- | ------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS service ID  |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS public key  |

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Otmane Touhami**

- GitHub: [@OtmaneTouhami](https://github.com/OtmaneTouhami)
- LinkedIn: [otmane-touhami](https://www.linkedin.com/in/otmane-touhami/)
- Email: otmanetouhami01@gmail.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/OtmaneTouhami/portfolio/issues).

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

**Note**: Remember to update `src/data/developer-data.ts` with your own information before deploying.
