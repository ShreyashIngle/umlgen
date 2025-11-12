# UMLGen AI - Todo & Features

## Current Features ✅

### Core Functionality
- [x] **AI-Powered UML Generation** - Uses Google Gemini 2.5 Flash model
- [x] **Multiple Diagram Types** - Support for 9 diagram types:
  - Use Case Diagram
  - Class Diagram  
  - Sequence Diagram
  - Activity Diagram
  - Component Diagram
  - Deployment Diagram
  - State Diagram
  - ER Diagram
  - Gantt Chart
- [x] **Interactive Chat Interface** - Conversational UML generation
- [x] **Real-time Preview** - Instant diagram rendering via PlantUML
- [x] **Code Editor** - Edit PlantUML code directly with syntax highlighting

### Security & Storage
- [x] **Encrypted API Key Storage** - XOR encryption for local storage
- [x] **Auto-save/Load** - Persistent API key across sessions
- [x] **API Key Management** - Add, update, clear functionality

### UI/UX Features
- [x] **Dark/Light Mode** - Full theme support
- [x] **Responsive Design** - Works on desktop, tablet, mobile
- [x] **Progress Tracking** - 4-step generation process indicator
- [x] **Toast Notifications** - User feedback for all actions
- [x] **Smooth Animations** - Framer Motion throughout

### Diagram Interaction
- [x] **Advanced Zoom Controls** - Manual zoom with multiple methods:
  - Button controls (+/- with percentage display)
  - Ctrl+Mouse wheel zoom
  - Trackpad pinch gestures
  - Touch pinch on mobile
  - Zoom range: 10% to 500%
- [x] **Pan & Drag** - Move around zoomed diagrams
- [x] **Horizontal/Vertical Scroll** - Navigate large diagrams
- [x] **Fullscreen Mode** - Expanded view for detailed work
- [x] **Download Options** - Export as PNG or SVG
- [x] **Copy Code** - One-click PlantUML code copying

### Performance Optimizations
- [x] **Throttled Events** - 60fps event handling for smooth interaction
- [x] **GPU Acceleration** - Hardware-accelerated transforms
- [x] **Reduced Motion Support** - Accessibility compliance
- [x] **Touch-Optimized** - Enhanced mobile/tablet experience

## Pending Improvements 🔄

### High Priority
- [ ] **Either/Or Input Method** - Allow ONLY diagram selection OR custom prompt, not both
- [ ] **Enhanced Error Handling** - Better API error messages and recovery
- [ ] **Diagram History** - Save and revisit previous generations
- [ ] **Export Improvements** - Higher resolution exports, PDF support

### Medium Priority  
- [ ] **Diagram Templates** - Pre-built templates for common patterns
- [ ] **Collaboration Features** - Share diagrams via URL
- [ ] **Multiple API Support** - Support for other AI providers
- [ ] **Offline Mode** - Cache and work without internet

### Low Priority
- [ ] **Diagram Validation** - Check PlantUML syntax before rendering
- [ ] **Custom Themes** - User-defined color schemes
- [ ] **Keyboard Shortcuts** - Power user productivity features
- [ ] **Tutorial/Onboarding** - Guide new users through features

## Technical Architecture

### Frontend Stack
- **React 18** - Modern hooks-based components
- **Vite** - Fast development and building
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Consistent icon system

### Key Libraries
- **@google/generative-ai** - Gemini API integration
- **plantuml-encoder** - PlantUML URL encoding
- **react-hot-toast** - User notifications
- **clsx + tailwind-merge** - Conditional styling

### File Structure
