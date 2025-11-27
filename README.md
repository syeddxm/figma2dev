# Figma2Dev

A web-based tool that converts Figma designs into production-ready HTML and CSS code.

## Overview

Figma2Dev transforms Figma design files into clean, semantic HTML markup with automatically generated CSS classes. Provide your Figma access token and file key, and the tool generates downloadable HTML and CSS files.

## How It Works

Pretty straightforward process:

1. Enter your Figma token and file key (or just try the demo)
2. App fetches the file from Figma's API
3. Creates a CSSGenerator singleton to track styles
4. Renders the Figma node tree recursively - each node type (Document, Frame, Text, Rectangle) maps to HTML elements
5. As nodes render, they call the CSS generator to create class names
6. Generator outputs the final CSS file with all collected styles
7. Both files get saved to `/temp` and you can preview the output in an iframe or as code, or download them :)

## Architecture

### Key Components

- **Route Handler** (`routes/_index.tsx`) - Handles form input and orchestrates the conversion
- **CSSGenerator** (`lib/CSSGenerator.ts`) - Manages CSS rule generation and class naming
- **Figma Node Components** (`components/FigmaNodes/`) - Convert specific Figma node types to HTML
  - `FigmaDocument`: Root container
  - `FigmaFrame`: Layout containers with flex support
  - `FigmaText`: Text elements with typography
  - `FigmaRectangle`: Shape elements
- **API Integration** (`app/.server/get-figma.ts`) - Fetches design data from Figma

### CSS Generation

Class naming is inspired by Tailwind's utility-first approach. The generator deduplicates styles automatically, so identical properties reuse the same class.

Some examples of what you'll see:
- Colors: `bg-color-{random}`, `color-{random}`
- Typography: `text-{random}`
- Layout: `flex-horizontal`, `flex-vertical`, `width-full`
- Dimensions: `width-329px`, `height-200px`
- Positioning: `pos-absolute`, `left-16px`, `top-662px`
- Borders: `border-w-2px-c-{colorId}`, `border-radius-8px`

Google Fonts get automatically imported when detected. Absolute positioning is split into seperate classes for better composability.

## Figma API Reference

The conversion logic follows the [Figma REST API specification](https://developers.figma.com/docs/rest-api). We use the Files endpoint (`GET /v1/files/:file_key`) to retrieve design structure and work with their node types and style properties.

All design property mappings follow the official Figma REST API data structures from `@figma/rest-api-spec`.

## Getting Started

**Prerequisites:**
- Node.js (v18+)
- npm or pnpm
- Figma access token if you want to try your own files ([generate here](https://developers.figma.com/docs/rest-api/authentication/#access-tokens))

**Installation:**

```bash
npm install
```

**Development:**

```bash
npm run dev
```

**Build:**

```bash
npm run build
npm start
```

## Usage

1. Navigate to the app
2. Enter your Figma access token
3. Enter your Figma file key (found in the URL: `figma.com/file/{FILE_KEY}/...`)
4. Click "Generate Code" or try the demo
5. Preview the generated code
6. Download the HTML and CSS files

## Tech Stack

- **Framework**: Remix (needed for server-side file system access)
- **Frontend**: React
- **API**: Figma REST API
- **Type Safety**: TypeScript
- **Testing**: Jest, React Testing Library