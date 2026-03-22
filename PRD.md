# TAPIPOCITOS - Product Requirements Document

A comprehensive website showcasing a family tapestry business with 30+ years of Uruguayan tradition, featuring elegant product displays, project galleries, and a complete admin CMS panel for content management.

**Experience Qualities**:
1. **Artisanal Warmth** - The design evokes the tactile quality of fine fabrics and handcrafted furniture, with subtle textures and warm color tones that reflect three decades of family tradition
2. **Elegant Simplicity** - Clean, purposeful layouts that let the craftsmanship speak for itself, with smooth animations that enhance rather than distract
3. **Trust & Heritage** - Visual elements and typography that communicate reliability, quality, and the generational expertise of the Calistro family

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Multiple content types (products, projects, testimonials, services), protected admin panel with full CMS capabilities, form submissions, image management, authentication system, and dynamic content rendering

## Essential Features

### Public Product Catalog
- **Functionality**: Display tapestry products with images, materials, dimensions, and availability status; users can request quotes for items
- **Purpose**: Showcase craftsmanship and allow customers to browse available furniture pieces without direct e-commerce
- **Trigger**: Click on "Productos" in navigation or product card in gallery
- **Progression**: Browse grid → Filter by type → Click product → View details/gallery → "Solicitar este producto" → Auto-filled contact form → Submit request
- **Success criteria**: Products load quickly with optimized images, filtering works smoothly, quote requests capture product details and send email

### Project Gallery (Trabajos Realizados)
- **Functionality**: Filterable grid of completed restoration and upholstery projects with before/after capabilities
- **Purpose**: Demonstrate expertise and inspire confidence through real work examples
- **Trigger**: Navigate to "Trabajos" or click gallery items on home
- **Progression**: View grid with filters (Sofás/Sillas/Restauraciones/Especiales) → Click project → Lightbox with full gallery + description → "Solicitar algo similar" → Contact form
- **Success criteria**: Smooth filtering transitions, zoom-in animations on hover, responsive grid layout, lightbox navigation works flawlessly

### Admin CMS Panel
- **Functionality**: Protected dashboard for managing products, projects, services, testimonials, and all site content with image uploads
- **Purpose**: Enable Leonardo and family to update content without developer assistance
- **Trigger**: Navigate to /admin/login, enter credentials
- **Progression**: Login → Dashboard overview → Select section (Products/Projects/Services/Team) → Create/Edit/Delete items → Upload images (drag-drop) → Save → Changes reflect on public site
- **Success criteria**: JWT authentication works securely, all CRUD operations persist to database, image uploads handle multiple files, changes appear immediately on frontend

### Quote Request System
- **Functionality**: Smart contact forms that auto-populate product/service details and send formatted emails to TAPIPOCITOS
- **Purpose**: Convert interest into actionable leads with all necessary context preserved
- **Trigger**: Click "Solicitar presupuesto" buttons throughout site
- **Progression**: Click CTA → Form opens (pre-filled if from product/project) → Fill name/email/phone/message → Optional photo upload → Submit → Confirmation toast → Email sent to contacto@tapipocitos.uy
- **Success criteria**: Form validation prevents incomplete submissions, emails arrive with all data formatted clearly, optional image attachments work, success feedback is clear

### Dynamic Homepage Hero
- **Functionality**: Animated hero section with subtle background texture, family story introduction, and prominent CTAs
- **Purpose**: Immediately communicate heritage, quality, and clear paths to action
- **Trigger**: Page load
- **Progression**: Hero fades in → Background parallax on scroll → Text appears with stagger → CTA buttons highlighted on hover → Scroll to services section
- **Success criteria**: Animations feel smooth (60fps), text is readable over background, CTAs are obvious, mobile layout adapts gracefully

### Services Showcase
- **Functionality**: Icon-based service cards with descriptions and links to related work examples
- **Purpose**: Clearly communicate the breadth of capabilities (restoration, custom upholstery, interior design, special projects)
- **Trigger**: Scroll to services section or navigate from menu
- **Progression**: Cards appear with fade-up animation → Hover shows subtle lift effect → Click service → Filter gallery to related projects
- **Success criteria**: All services clearly explained, icons are intuitive, hover states feel responsive, linking to work examples functions correctly

## Edge Case Handling

- **Empty States**: When admin has no products yet, show helpful "Agregar tu primer producto" prompt with illustration
- **Image Upload Failures**: Display clear error messages, allow retry, validate file types/sizes before upload attempt
- **Form Submission Errors**: Show specific validation messages (invalid email format, missing required fields), preserve entered data
- **Offline/Network Issues**: Display toast notifications for failed requests, queue form submissions for retry
- **Authentication Expiry**: Redirect to login with "sesión expirada" message, preserve intended destination after re-login
- **Missing Product Images**: Show elegant placeholder with TAPIPOCITOS branding instead of broken image icons
- **Long Product Names**: Truncate with ellipsis in grid view, show full name in detail view
- **Mobile Image Galleries**: Implement swipe gestures, optimize image sizes for bandwidth

## Design Direction

The design should feel like stepping into a refined artisan workshop - warm leather tones, subtle fabric textures, and crafted details that honor three decades of family tradition while maintaining modern web standards. The interface should be minimal yet rich, letting the beauty of the upholstered furniture take center stage while providing effortless navigation.

## Color Selection

Custom palette inspired by upholstery materials and Uruguayan warmth

- **Primary Color**: Deep Leather Brown (#5A3B2E / oklch(0.29 0.04 45)) - Communicates craftsmanship, warmth, and the core material of the trade; used for headers, primary CTAs, and key accents
- **Secondary Colors**: 
  - Arena Clara (#F4EDE4 / oklch(0.94 0.01 75)) - Soft background that doesn't compete with product photos
  - Gris Suave (#D9D3CC / oklch(0.86 0.008 65)) - Subtle borders and muted elements
- **Accent Color**: Warm Orange (#C97A40 / oklch(0.65 0.10 55)) - Draws attention to CTAs, hover states, and important interactive elements
- **Foreground/Background Pairings**:
  - Background (Arena Clara #F4EDE4): Dark brown text (#2A1810 / oklch(0.18 0.02 40)) - Ratio 9.2:1 ✓
  - Card (White #FFFFFF): Dark brown text (#2A1810) - Ratio 12.5:1 ✓
  - Primary (Deep Leather #5A3B2E): Light sand text (#FAF6F1 / oklch(0.97 0.01 75)) - Ratio 7.8:1 ✓
  - Secondary (Gris Suave #D9D3CC): Dark brown text (#2A1810) - Ratio 8.1:1 ✓
  - Accent (Warm Orange #C97A40): White text (#FFFFFF) - Ratio 4.6:1 ✓
  - Muted (Azul Pizarra #384B5C): Light sand text (#FAF6F1) - Ratio 8.9:1 ✓

## Font Selection

Typography should blend traditional elegance with modern readability, reflecting the balance between 30-year heritage and contemporary craftsmanship.

- **Typographic Hierarchy**:
  - H1 (Site Title/Hero): Playfair Display Bold / 56px / tight leading (-0.02em) / for dramatic elegance
  - H2 (Section Headers): Playfair Display SemiBold / 36px / normal leading / section dividers
  - H3 (Product/Project Titles): Playfair Display Medium / 24px / relaxed leading
  - Body Text: Open Sans Regular / 16px / 1.6 line-height / optimal readability
  - Captions/Meta: Open Sans / 14px / muted color / for dates, materials, dimensions
  - Buttons/UI: Inter Medium / 15px / tracking 0.01em / clean modern interface elements
  - Navigation: Inter Medium / 14px / uppercase / letter-spacing 0.05em

## Animations

Animations should feel like the gentle settling of quality furniture - substantial but never rushed, purposeful yet understated.

- **Purposeful Meaning**: Motion reinforces the artisanal brand - fabric-like smooth transitions, gentle zoom effects that mimic examining fine details, fade-ins that reveal craftsmanship gradually
- **Hierarchy of Movement**: 
  - Hero elements (primary focus): 600ms ease-out fades with subtle scale
  - Product cards: 250ms hover scale (1.02x) with shadow lift
  - Gallery lightbox: 300ms smooth expansion
  - Form interactions: 200ms instant feedback
  - Page transitions: 400ms cross-fades
  - Scroll-triggered reveals: Staggered 150ms delays for sequential elegance

## Component Selection

- **Components**:
  - Navigation: Sticky header with smooth shadow appearance on scroll (custom component)
  - Product Grid: Card components with hover overlays showing quick actions
  - Lightbox Gallery: Dialog component with Carousel for project images
  - Forms: Shadcn Form + Input + Textarea with real-time validation feedback
  - Admin Panel: Sidebar for navigation, Table for content lists, Dialog for edit modals
  - CTAs: Button component with variants (default/primary/outline)
  - Testimonials: Card with Avatar components in horizontal scroll
  - Image Upload: Custom drag-drop zone with Progress indicators
  - Filters: Toggle Group for gallery filtering
  - Toast: Sonner for success/error notifications
  - Authentication: Custom login form with password Input

- **Customizations**:
  - Custom ImageUpload component with drag-drop, preview thumbnails, and progress bars
  - FilterableGallery component combining Toggle filters with animated grid transitions
  - QuoteRequestForm component that accepts pre-filled product/project context
  - ProductCard with hover-activated zoom on image and quick-action overlay
  - AdminLayout wrapper with protected routing and session management
  - ParallaxHero component with subtle background movement

- **States**:
  - Buttons: Default leather brown, hover lifts with warmer tone and shadow, active slightly darker, disabled muted gray
  - Inputs: Default subtle border, focus shows accent orange ring, error shows red border with icon, success shows green checkmark
  - Cards: Default flat, hover elevates with shadow and border highlight, selected shows accent border
  - Images: Lazy load with skeleton, error shows branded placeholder, loading shows subtle pulse

- **Icon Selection**:
  - Phosphor icons throughout for consistency
  - Armchair/Couch for products/services
  - Image/Images for gallery sections
  - User/Users for team/testimonials
  - Envelope for contact
  - Plus/Pencil/Trash for admin CRUD
  - Check/X for form validation
  - Upload for image management
  - House for home navigation
  - Phone/MapPin for contact info

- **Spacing**:
  - Container max-width: 1280px with 6 (24px) horizontal padding
  - Section vertical spacing: 20 (80px) desktop, 12 (48px) mobile
  - Card internal padding: 6 (24px)
  - Grid gaps: 6 (24px) desktop, 4 (16px) mobile
  - Form field spacing: 4 (16px) between fields
  - Button padding: py-3 px-6 for primary, py-2 px-4 for secondary

- **Mobile**:
  - Navigation collapses to hamburger menu with slide-in drawer
  - Product grid: 1 column mobile, 2 tablet, 3-4 desktop
  - Hero text scales down (H1 from 56px to 36px)
  - Admin sidebar becomes bottom navigation on mobile
  - Forms stack labels above inputs on narrow screens
  - Gallery uses swipe gestures instead of hover on touch devices
  - Reduce section spacing by ~40% on mobile
  - Touch targets minimum 44x44px
