
# LMS Frontend

A modern, responsive Learning Management System frontend built with React, Tailwind CSS, and modern UI/UX principles.

## Features

- **Modern Design** - Clean, professional interface with beautiful gradients and animations
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Course Discovery** - Advanced search and filtering capabilities
- **Shopping Cart** - Seamless cart management and checkout process
- **User Dashboard** - Personal learning dashboard with progress tracking
- **Category Browsing** - Intuitive course categorization and navigation

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing for single-page application
- **Axios** - HTTP client for API communication
- **React Query** - Data fetching and caching library
- **Lucide React** - Beautiful, customizable icons
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Performant forms with easy validation

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Page components
│   ├── hooks/       # Custom React hooks
│   ├── services/    # API service functions
│   ├── utils/       # Utility functions
│   ├── contexts/    # React contexts
│   └── styles/      # Global styles
├── package.json
└── README.md
```

## Key Components

### Course Card
Beautiful course cards with:
- Course thumbnail and badges
- Instructor information
- Rating and student count
- Pricing with discount indicators
- Add to cart functionality

### Search & Filter
Advanced filtering system:
- Real-time search
- Category filtering
- Price range filters
- Level-based filtering
- Sort options

### Shopping Cart
Comprehensive cart features:
- Add/remove courses
- Price calculations
- Discount summaries
- Checkout process

## Styling & Design

### Color Palette
- **Primary**: Blue gradient (from-blue-600 to-indigo-600)
- **Secondary**: Purple accents
- **Background**: Gradient from slate-50 via blue-50 to indigo-100
- **Text**: Modern gray scale for excellent readability

### Typography
- Clean, modern font stack
- Proper hierarchy with varied font weights
- Responsive text sizing

### Layout
- Mobile-first responsive design
- Grid-based course listings
- Flexible component layouts
- Consistent spacing system

## API Integration

The frontend communicates with the backend API for:
- Course data retrieval
- User authentication
- Cart management
- User profile management

### API Configuration
Update the API base URL in your environment configuration:

```javascript
// .env.local
REACT_APP_API_URL=http://localhost:5000/api
```

## Performance Optimizations

- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Responsive images with proper sizing
- **Caching** - React Query for efficient data caching
- **Bundle Optimization** - Tree shaking and minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

### Component Structure
```jsx
// Component template
import React from 'react';
import { SomeIcon } from 'lucide-react';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div className="tailwind-classes">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Styling Conventions
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing (4, 8, 12, 16px increments)
- Use semantic color names

### State Management
- React hooks for local state
- Context API for global state
- React Query for server state

## Building for Production

```bash
# Create production build
npm run build

# The build folder contains optimized static files
# Deploy the contents to your web server
```

## Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add appropriate comments for complex logic
4. Test across different devices and browsers
5. Ensure accessibility standards are met

## Accessibility

- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast ratios

## Future Enhancements

- Dark mode support
- Progressive Web App (PWA) features
- Advanced animations with Framer Motion
- Internationalization (i18n)
- Video player integration
- Real-time notifications

## License

MIT License - see LICENSE file for details
