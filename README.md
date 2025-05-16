# No Bad Days Tracker

A modern web application for tracking and visualizing substance use patterns with a focus on harm reduction and recovery. This application helps users monitor their substance use, track interventions, and gain insights into their recovery journey.

## Features

- 📊 **Harm Recovery Index**: Visual tracking of substance use patterns with color-coded thresholds
- 🎯 **Substance Distribution**: Interactive donut chart showing substance usage distribution
- 📝 **Substance Log**: Detailed logging system for substance use and interventions
- 📈 **Data Visualization**: Beautiful, animated charts with tooltips and gradients
- 📱 **Responsive Design**: Fully responsive interface that works on all devices
- 🔒 **Privacy Focused**: Secure user authentication and data protection

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- @visx for data visualization
- Supabase for backend

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dberz/no-bad-days-tracker.git
   cd no-bad-days-tracker
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Working Across Multiple Machines

1. Always pull the latest changes before starting work:
   ```bash
   git pull
   ```

2. After making changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push
   ```

## Project Structure

```
├── app/                # Next.js app directory
├── components/         # React components
├── contexts/          # React contexts
├── db/                # Database schemas and types
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and types
├── public/            # Static assets
└── styles/            # Global styles
```

## Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "Add some feature"
   ```

3. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 