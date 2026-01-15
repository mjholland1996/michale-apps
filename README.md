# Gousto Meal Planner

A web app for planning weekly meals using Gousto recipes.

## Features

- Browse paginated list of Gousto recipes with images, prep times, and ratings
- Select up to 5 recipes for your weekly meal plan
- Review and confirm your selection
- View detailed ingredients and cooking instructions for confirmed recipes
- Persistent storage using localStorage

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Data**: Static JSON files fetched from Gousto's public API
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

## Data Refresh

Recipe data is stored as static JSON files in the `data/` directory. A GitHub Action runs weekly to refresh the data from Gousto's API.

To manually refresh the data:

```bash
# Fetch recipe summaries only
npm run fetch-recipes -- --force

# Fetch summaries and full details
npm run fetch-recipes:full -- --force
```

## Deployment

The app is configured for deployment on Vercel. Push to `main` to trigger automatic deployment.
