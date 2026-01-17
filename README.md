# Michale Apps

A collection of personal web apps built with Next.js.

## Apps

### Meal Planner

Plan weekly meals using Gousto recipes.

**Features:**
- Browse recipes with filtering by protein, carbs, and prep time
- Select up to 5 recipes for your weekly meal plan
- Smart ingredient recommendations based on shared ingredients
- Generate aggregated shopping lists with quantity calculations
- Save and manage multiple meal plans
- Adjustable serving sizes (2 or 4 people)

**Data:** Recipe data is fetched from Gousto's public API and stored as static JSON. A GitHub Action refreshes the data weekly.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS 4
- **Storage**: localStorage for client-side persistence
- **Hosting**: Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

Push to `main` to trigger automatic deployment on Vercel.
