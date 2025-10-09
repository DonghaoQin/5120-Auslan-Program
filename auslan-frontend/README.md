# 🤟 Hello Auslan - Interactive Learning Platform

A comprehensive web application for learning Australian Sign Language (Auslan) through interactive modules, storytelling, and gamified quizzes.

## 🌟 Features

### 📚 **Learning Modules**
- **Letters & Numbers**: Interactive alphabet and number learning with visual feedback
- **Basic Words**: Vocabulary learning with video demonstrations from backend API
- **Story Books**: Immersive reading experience with clickable Auslan words
- **Progress Tracking**: Local storage-based learning progress with visual indicators

### 🎮 **Interactive Quizzes**
- **Words Quiz**: Video-based multiple choice questions with category filtering
- **Letters & Numbers Quiz**: Image-based sign recognition with instant feedback
- **Adaptive Learning**: Separate modes for "All Items" vs "Learned Only"
- **Performance Analytics**: Score tracking, accuracy metrics, and time measurement

### 📖 **Story Book Experience**
- **Interactive Reading**: Click on highlighted words to watch Auslan videos
- **Multi-Book Library**: Expandable collection of stories
- **Two-Page Layout**: Realistic book reading experience with page flip animations
- **Keyboard Navigation**: Arrow key support for seamless navigation

### 📱 **Mobile Integration**
- **QR Code Access**: Direct link to mobile flashcard practice
- **Responsive Design**: Optimized for all device sizes
- **Progressive Enhancement**: Works offline with cached content

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: CSS-in-JS with custom animations
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Data Persistence**: localStorage for progress tracking
- **API Integration**: RESTful backend integration
- **Icons & QR**: React QR Code Canvas, Custom SVG icons

## 📁 Project Structure

```
auslan-frontend/
├── public/
│   ├── assets/
│   │   └── signs/           # Letter & number sign images
│   └── index.html
├── src/
│   ├── components/
│   │   ├── NavBar.jsx       # Main navigation component
│   │   ├── NavBar.css       # Navigation styling
│   │   └── ProgressBar.jsx  # Learning progress indicator
│   ├── data/
│   │   └── letters.js       # Letters & numbers data
│   ├── pages/
│   │   ├── HomePage.jsx     # Landing page
│   │   ├── BasicWords.jsx   # Vocabulary learning module
│   │   ├── LettersNumbers.jsx # Alphabet & numbers module
│   │   ├── StoryBook.jsx    # Interactive reading experience
│   │   ├── WordQuiz.jsx     # Video-based quiz
│   │   ├── LNQuiz.jsx       # Letters & numbers quiz
│   │   └── InsightsPage.jsx # Learning analytics
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles
│   └── main.jsx             # Application entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auslan-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🔧 Configuration

### API Endpoints
The application connects to the Auslan Backend API:
- **Base URL**: `https://auslan-backend.onrender.com`
- **Videos Endpoint**: `/videos/` (for word videos)
- **Book1 Endpoint**: `/book1/` (for story book videos)

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://auslan-backend.onrender.com
VITE_FLASHCARD_URL=https://helloauslan.me/flashcard
```

## 📚 Core Components

### Navigation System
```jsx
// Enhanced navigation with active states and analytics
<NavBar />
```

### Learning Modules

#### Letters & Numbers (`LettersNumbers.jsx`)
- **Interactive Grid**: Visual letter/number cards with hover effects
- **Progress Tracking**: Marks learned items with visual indicators  
- **Search & Filter**: Real-time filtering capabilities
- **Keyboard Support**: Arrow key navigation

#### Basic Words (`BasicWords.jsx`)
- **Category Organization**: Grouped vocabulary (Greetings, Family, etc.)
- **Video Integration**: Backend API-powered Auslan demonstrations
- **Progress Persistence**: localStorage-based learning tracking
- **Mobile QR Integration**: Quick access to flashcard practice

#### Story Books (`StoryBook.jsx`)
- **Interactive Reading**: Clickable words trigger Auslan videos
- **Dynamic Content**: Backend-driven video integration
- **Page Navigation**: Smooth transitions with keyboard support
- **Multi-Book Support**: Expandable story collection

### Quiz System

#### Words Quiz (`WordQuiz.jsx`)
```jsx
// Features include:
- Video-based questions with 4 multiple choice options
- Category filtering (Essentials, Greetings, Family, etc.)
- Real-time feedback with animations
- Performance analytics (score, accuracy, time)
- Retry functionality with progress tracking
```

#### Letters & Numbers Quiz (`LNQuiz.jsx`)
```jsx
// Features include:
- Image-based sign recognition
- Adaptive difficulty (All items vs Learned only)
- Instant visual feedback
- Wrong answer review system
- Progress integration with main learning module
```

## 🎨 Design System

### Color Palette
```css
:root {
  --primary-blue: #3B82F6;
  --primary-purple: #8B5CF6;
  --success-green: #10B981;
  --warning-orange: #F59E0B;
  --error-red: #EF4444;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --background: #F9FAFB;
}
```

### Animation Framework
- **Micro-interactions**: Hover effects, button animations
- **Page Transitions**: Smooth fade-in/slide-up animations  
- **Feedback Animations**: Success bounces, error shakes
- **Loading States**: Skeleton screens and progress indicators

### Responsive Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## 📊 Data Management

### Learning Progress
```javascript
// Stored in localStorage
const STORAGE_KEY = "LN_LEARNED_V2";
const progress = {
  learnedItems: ['A', 'B', 'C', '1', '2'],
  lastAccessed: Date.now(),
  totalProgress: 0.23
};
```

### API Integration
```javascript
// Dynamic video loading with caching
const fetchVideos = async () => {
  const response = await fetch(`${API_URL}?t=${Date.now()}`);
  const videos = await response.json();
  sessionStorage.setItem("WORDS_API_CACHE_V1", JSON.stringify(videos));
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navigation between all pages works
- [ ] Learning progress persists across sessions
- [ ] Videos load correctly from backend API
- [ ] Quiz functionality works in both modes
- [ ] Mobile responsiveness on different devices
- [ ] QR code generation and scanning
- [ ] Keyboard navigation in story books

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 Deployment

### Build Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Deployment Platforms
- **Vercel**: Automatic deployments from Git
- **Netlify**: Static site hosting with form handling
- **GitHub Pages**: Free hosting for public repositories

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use functional components with hooks
- Follow React best practices
- Maintain consistent naming conventions
- Add comments for complex logic
- Ensure responsive design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Auslan Community**: For providing authentic sign language content
- **React Team**: For the amazing framework and tooling
- **Vite**: For lightning-fast development experience
- **Contributors**: All developers who helped build this platform

## 📞 Support

For questions, issues, or contributions:
- 📧 Email: support@helloauslan.me
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)

---

**Built with ❤️ for the Auslan learning community**

*"Making Australian Sign Language accessible to everyone, one interaction at a time."*
