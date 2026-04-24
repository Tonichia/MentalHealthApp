---
<!DOCTYPE html>

<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-error": "#ffffff",
                        "surface-bright": "#fcf9f3",
                        "surface-dim": "#dcdad4",
                        "on-primary-fixed-variant": "#524343",
                        "surface-container": "#f0eee8",
                        "surface-tint": "#6a5b5b",
                        "outline-variant": "#d2c3c3",
                        "tertiary": "#191f11",
                        "on-surface-variant": "#4e4444",
                        "surface-container-low": "#f6f3ed",
                        "on-tertiary": "#ffffff",
                        "on-secondary-fixed-variant": "#6f3728",
                        "on-error-container": "#93000a",
                        "surface-container-high": "#ebe8e2",
                        "outline": "#807474",
                        "error": "#ba1a1a",
                        "on-background": "#1c1c18",
                        "surface": "#fcf9f3",
                        "inverse-primary": "#d6c2c1",
                        "secondary-fixed-dim": "#ffb5a1",
                        "background": "#fcf9f3",
                        "surface-container-lowest": "#ffffff",
                        "secondary-fixed": "#ffdbd1",
                        "tertiary-container": "#2e3425",
                        "primary-fixed": "#f3dedd",
                        "tertiary-fixed-dim": "#c2c9b4",
                        "on-secondary": "#ffffff",
                        "on-tertiary-fixed-variant": "#424939",
                        "on-surface": "#1c1c18",
                        "on-primary": "#ffffff",
                        "tertiary-fixed": "#dee5cf",
                        "secondary": "#8b4e3d",
                        "inverse-surface": "#31312d",
                        "secondary-container": "#fdad98",
                        "primary": "#261a1a",
                        "on-secondary-container": "#783f2f",
                        "primary-container": "#3c2f2f",
                        "on-tertiary-fixed": "#171d10",
                        "on-primary-fixed": "#241919",
                        "primary-fixed-dim": "#d6c2c1",
                        "on-primary-container": "#a99696",
                        "inverse-on-surface": "#f3f0ea",
                        "on-tertiary-container": "#969d89",
                        "on-secondary-fixed": "#380d03",
                        "error-container": "#ffdad6",
                        "surface-variant": "#e5e2dc",
                        "surface-container-highest": "#e5e2dc"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "lg": "48px",
                        "margin": "32px",
                        "gutter": "24px",
                        "xs": "4px",
                        "sm": "12px",
                        "xl": "80px",
                        "md": "24px",
                        "base": "8px"
                    },
                    "fontFamily": {
                        "headline-xl": ["Newsreader"],
                        "body-md": ["Plus Jakarta Sans"],
                        "label-md": ["Plus Jakarta Sans"],
                        "body-lg": ["Plus Jakarta Sans"],
                        "headline-md": ["Newsreader"],
                        "headline-lg": ["Newsreader"]
                    },
                    "fontSize": {
                        "headline-xl": ["48px", {"lineHeight": "1.2", "fontWeight": "500"}],
                        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "label-md": ["14px", {"lineHeight": "1.2", "letterSpacing": "0.02em", "fontWeight": "600"}],
                        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
                        "headline-md": ["24px", {"lineHeight": "1.4", "fontWeight": "600"}],
                        "headline-lg": ["32px", {"lineHeight": "1.3", "fontWeight": "500"}]
                    }
                }
            }
        }
    </script>
<style>.paper-grain {
    background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuBsBUKa1Nx7WDX7jchi86lBTz5nJuVEsTIiU2KHwK0OMJA9QvHr4GzSuKSaYNt9yjEwmEEWl1-rsD9b6_WREZFkS2lPbPwnbA0ux10NJfhIj7b4GMyOaCYDgzUR4kRz98QuUuvp9vpbb8AWG-OmXGDbd6Woq9xwRFkXL2xxPpP-GOwapHvnE0y_X7rxgDxSzBh9O1Xh_KmKbm41Omqwk-VdI0AfhbFIuHBQRr3WYMqXOILJvQ1Kgi6axPpiek1Xtr_T-IYYUCfR_C4);
    background-blend-mode: overlay
    }
.material-symbols-outlined {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
    }</style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
<!-- Top Navigation -->
<header class="sticky top-0 z-50 bg-[#FDFBF7] dark:bg-[#1A1616] border-b border-[#E6E0D5] dark:border-[#2D2828] transition-all duration-300">
<nav class="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
<div class="flex items-center gap-3 cursor-pointer active:opacity-70 transition-opacity">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="spa">spa</span>
<span class="text-2xl font-serif italic text-[#3C2F2F] dark:text-[#FDFBF7]">Mind Matter</span>
</div>
<div class="hidden md:flex items-center gap-8 font-serif font-medium tracking-tight">
<a class="text-[#3C2F2F] dark:text-[#FDFBF7] border-b-2 border-[#D4A373] transition-colors duration-300" href="#">Foundation</a>
<a class="text-[#70665F] dark:text-[#A8A099] hover:text-[#3C2F2F] dark:hover:text-[#FDFBF7] transition-colors duration-300" href="#">Components</a>
<a class="text-[#70665F] dark:text-[#A8A099] hover:text-[#3C2F2F] dark:hover:text-[#FDFBF7] transition-colors duration-300" href="#">Guidelines</a>
</div>
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant">
<img class="w-full h-full object-cover" data-alt="portrait of a serene woman with a soft smile in natural window light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4EjtpbrKIYjMN7prlWPQGENyMWKpfn4TVyUOcDRbT4cVEI18sqmXfltYJS996PQ15Kftg8ZMM9GxaHAAeXIJPQMVEurxzbQkW6_YmpYz5b6vMU4mP2FZCXyW1iHOS4FOVU7Y_NWysW5UX5b8pGpSFecRJonG-r84lxFeeuPoTYchnNopjPfwW5jpPPFXqmooqpzB8UtVnwm3xMuBMyQoiZcXNFunLCpABecN2ydJvZngqbWPPijCBJezyiAtR3GDSEaTgMuxe-wg"/>
</div>
</div>
</nav>
</header>
<div class="flex max-w-7xl mx-auto min-h-screen relative">
<!-- Sidebar Navigation -->
<aside class="hidden lg:block w-80 border-r border-[#E6E0D5] dark:border-[#2D2828] sticky top-20 h-[calc(100vh-80px)] overflow-y-auto bg-[#FDFBF7] dark:bg-[#1A1616] py-10 px-4">
<div class="mb-10 px-4">
<h2 class="font-serif font-bold text-[#3C2F2F] text-xl">Design System</h2>
</div>
<nav class="space-y-1">
<a class="flex items-center gap-4 py-3 px-4 bg-[#F5F1EA] dark:bg-[#2D2828] text-[#3C2F2F] dark:text-[#FDFBF7] font-semibold rounded-r-full transition-all duration-300 ease-in-out" href="#foundation">
<span class="material-symbols-outlined" data-icon="foundation">foundation</span>
<span class="font-serif">Foundation</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 text-[#70665F] dark:text-[#A8A099] hover:bg-[#F5F1EA]/50 dark:hover:bg-[#2D2828]/50 hover:pl-6 transition-all duration-300 ease-in-out" href="#typography">
<span class="material-symbols-outlined" data-icon="match_case">match_case</span>
<span class="font-serif">Typography</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 text-[#70665F] dark:text-[#A8A099] hover:bg-[#F5F1EA]/50 dark:hover:bg-[#2D2828]/50 hover:pl-6 transition-all duration-300 ease-in-out" href="#colors">
<span class="material-symbols-outlined" data-icon="palette">palette</span>
<span class="font-serif">Color Palette</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 text-[#70665F] dark:text-[#A8A099] hover:bg-[#F5F1EA]/50 dark:hover:bg-[#2D2828]/50 hover:pl-6 transition-all duration-300 ease-in-out" href="#elevation">
<span class="material-symbols-outlined" data-icon="layers">layers</span>
<span class="font-serif">Elevation</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 text-[#70665F] dark:text-[#A8A099] hover:bg-[#F5F1EA]/50 dark:hover:bg-[#2D2828]/50 hover:pl-6 transition-all duration-300 ease-in-out" href="#components">
<span class="material-symbols-outlined" data-icon="widgets">widgets</span>
<span class="font-serif">Components</span>
</a>
</nav>
</aside>
<!-- Main Content Area -->
<main class="flex-1 px-8 md:px-12 py-16">
<!-- Hero Section -->
<section class="mb-20" id="foundation">
<div class="relative h-96 rounded-3xl overflow-hidden mb-12 shadow-sm group">
<img class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A person practicing yoga in a bright, sun-drenched studio with natural light streaming through large windows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOav4pemnWDBJZik4_QLBuyyBS2d4x60QW_Bbn6Z-XwBc5SiTRZ9O9HKCkaLmT06ub52YdM0744V_61mRMHFBFmyB3YzQoyUgM19bMrrzeOSD-p96xv8qyBLIMnY5MzGqxFLCp-803r1LOonbnIOPaPi1zAbDdyNGMHWVqCw0HCgQVT05n9dbbegZw5dXGPCtEOHAAQi2kGu6FzOw3oDTNrb2sKqAOdi3MLuejN95Jg99gA7ykVKrwshZuqr0IEk71slXvVQFb6LQ"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-12">
<h1 class="text-white font-headline-xl mb-4">Tactile Minimalism</h1>
<p class="text-white/90 text-body-lg max-w-xl">A design language rooted in human connection, gentle reflection, and the quiet comfort of home.</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
<div>
<h2 class="font-headline-lg text-primary mb-6">Our Philosophy</h2>
<p class="text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                            Mind Matter moves away from sterile precision toward a space that feels like a quiet, sun-drenched room. We prioritize empathy over data, and warmth over clinical efficiency. Every interaction should feel like a deep, grounding breath.
                        </p>
<div class="flex gap-4">
<span class="px-6 py-2 rounded-full bg-secondary-container text-on-secondary-container font-label-md">Nurturing</span>
<span class="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md">Tactile</span>
<span class="px-6 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md">Empathetic</span>
</div>
</div>
<div class="bg-surface-container-low p-8 rounded-3xl border border-outline-variant paper-grain">
<div class="flex items-center gap-4 mb-6">
<div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
<span class="material-symbols-outlined text-surface text-2xl" data-icon="auto_awesome">auto_awesome</span>
</div>
<h3 class="font-headline-md">The Human Touch</h3>
</div>
<p class="text-body-md text-on-surface-variant italic">
                            "Visuals focus on the human experience. Authenticity isn't found in perfection, but in the soft grain of a photo or the gentle curve of a button."
                        </p>
</div>
</div>
</section>
<!-- Typography Section -->
<section class="mb-20 pt-16 border-t border-outline-variant" id="typography">
<div class="flex justify-between items-end mb-12">
<div>
<span class="text-secondary font-label-md tracking-widest uppercase block mb-4">System Fonts</span>
<h2 class="font-headline-lg text-primary">Typography</h2>
</div>
<p class="max-w-md text-body-md text-on-surface-variant">We pair the editorial elegance of Newsreader with the modern clarity of Plus Jakarta Sans.</p>
</div>
<div class="space-y-12 bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant">
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
<div class="col-span-1">
<span class="font-label-md text-outline">Headline XL</span>
</div>
<div class="col-span-3">
<h1 class="font-headline-xl text-primary">Nurturing digital well-being through design.</h1>
<p class="text-outline mt-2">Newsreader Medium • 48px / 1.2</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start border-t border-outline-variant pt-12">
<div class="col-span-1">
<span class="font-label-md text-outline">Headline LG</span>
</div>
<div class="col-span-3">
<h2 class="font-headline-lg text-primary">Gentle reflection and inner peace.</h2>
<p class="text-outline mt-2">Newsreader Medium • 32px / 1.3</p>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-start border-t border-outline-variant pt-12">
<div class="col-span-1">
<span class="font-label-md text-outline">Body Large</span>
</div>
<div class="col-span-3">
<p class="font-body-lg text-on-surface-variant">The layout philosophy follows a Fixed Grid model to ensure content feels contained and protected. Spacing is intentionally generous to guide the user’s eye slowly.</p>
<p class="text-outline mt-2">Plus Jakarta Sans Regular • 18px / 1.6</p>
</div>
</div>
</div>
</section>
<!-- Color Palette -->
<section class="mb-20 pt-16 border-t border-outline-variant" id="colors">
<h2 class="font-headline-lg text-primary mb-12">Color Palette</h2>
<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
<div class="space-y-4">
<div class="h-48 w-full rounded-2xl bg-primary shadow-sm flex items-end p-4">
<span class="text-white font-label-md">Dark Chocolate</span>
</div>
<p class="text-xs font-mono text-outline uppercase">#261A1A</p>
</div>
<div class="space-y-4">
<div class="h-48 w-full rounded-2xl bg-secondary shadow-sm flex items-end p-4">
<span class="text-white font-label-md">Soft Terracotta</span>
</div>
<p class="text-xs font-mono text-outline uppercase">#8B4E3D</p>
</div>
<div class="space-y-4">
<div class="h-48 w-full rounded-2xl bg-surface-bright border border-outline-variant flex items-end p-4">
<span class="text-primary font-label-md">Morning Cream</span>
</div>
<p class="text-xs font-mono text-outline uppercase">#FCF9F3</p>
</div>
<div class="space-y-4">
<div class="h-48 w-full rounded-2xl bg-tertiary-fixed flex items-end p-4">
<span class="text-on-tertiary-fixed font-label-md">Dusky Sage</span>
</div>
<p class="text-xs font-mono text-outline uppercase">#DEE5CF</p>
</div>
</div>
</section>
<!-- Component Showcase (Bento Layout) -->
<section class="mb-20 pt-16 border-t border-outline-variant" id="components">
<h2 class="font-headline-lg text-primary mb-12">Component Showcase</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
<!-- Cards & Shadows -->
<div class="md:col-span-2 bg-surface-container p-10 rounded-[40px] flex flex-col justify-between">
<div>
<span class="font-label-md text-secondary block mb-6 uppercase tracking-wider">Elevation &amp; Depth</span>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
<div class="bg-surface p-8 rounded-3xl shadow-[0_10px_30px_-15px_rgba(38,26,26,0.1)] border border-outline-variant/30">
<h4 class="font-headline-md mb-2">Ambient Layer</h4>
<p class="text-body-md text-on-surface-variant">Subtle glow effect for resting elements.</p>
</div>
<div class="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/50">
<h4 class="font-headline-md mb-2">Tonal Layer</h4>
<p class="text-body-md text-on-surface-variant">Depth through warm/cool surface shifts.</p>
</div>
</div>
</div>
<div class="mt-12 flex items-center gap-4">
<img class="w-16 h-16 rounded-full object-cover" data-alt="close up of hands holding a warm ceramic mug of tea, soft morning light, cozy atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnl2Eq-m0zPZ0pRwV1_OzOJUI6g0MlZIZbSFwC5K-t-qiORjRzDF5QQK-IhC9yVg6ufH6nUB4z389Pwa0ABkEj8ZHOpmvhZEr3Fr5dTxSwqI2XTSdKFcRDUDTWIxJ0ywFzQHGBpsOm8CXhRFtUcc23dGyV0O9R3NX2998IcPw6h2lLk2jZD-VFoTUseyU9sTDYZhDDRUyL35qp_cUilmYtJm00CGMGbT9J9MUlEhg1CkpPr8zPRPLX42RXKu7PivsbIycFebZ1jlU"/>
<p class="text-body-md italic text-primary">"The interface should feel like picking up a physical book."</p>
</div>
</div>
<!-- Buttons -->
<div class="bg-primary-container p-10 rounded-[40px] flex flex-col justify-between text-on-primary-container">
<div>
<span class="font-label-md opacity-70 block mb-6 uppercase tracking-wider">Interactions</span>
<div class="space-y-6">
<button class="w-full bg-primary text-surface py-5 rounded-full font-label-md flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg">
                                    Primary Action <span class="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
</button>
<button class="w-full border-2 border-secondary text-secondary py-5 rounded-full font-label-md hover:bg-secondary/5 transition-colors">
                                    Secondary Action
                                </button>
<div class="flex flex-wrap gap-2 pt-4">
<span class="bg-surface/10 px-4 py-1.5 rounded-full text-xs font-medium">Calm</span>
<span class="bg-surface/10 px-4 py-1.5 rounded-full text-xs font-medium">Focused</span>
<span class="bg-surface/10 px-4 py-1.5 rounded-full text-xs font-medium">Balanced</span>
</div>
</div>
</div>
<p class="mt-8 text-sm opacity-60">Highly rounded forms invite soft, confident interaction.</p>
</div>
<!-- Input Fields -->
<div class="bg-surface-container-high p-10 rounded-[40px]">
<span class="font-label-md text-primary block mb-6 uppercase tracking-wider">Forms</span>
<div class="space-y-4">
<label class="block">
<span class="text-sm font-label-md text-on-surface-variant ml-2 mb-2 block">Journal Entry Title</span>
<input class="w-full bg-[#FDFBF7] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-secondary/30 placeholder:text-outline/50 shadow-inner" placeholder="Morning Reflections..." type="text"/>
</label>
<label class="block">
<span class="text-sm font-label-md text-on-surface-variant ml-2 mb-2 block">How are you feeling?</span>
<select class="w-full bg-[#FDFBF7] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-secondary/30">
<option>Peaceful</option>
<option>Energetic</option>
<option>Reflective</option>
</select>
</label>
</div>
</div>
<!-- Imagery Sample -->
<div class="md:col-span-2 relative rounded-[40px] overflow-hidden min-h-[300px]">
<img class="w-full h-full object-cover" data-alt="A group of diverse people laughing and walking together in a bright, sunlit meadow during golden hour." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeIEdKCDHlQUZIMq8jnpll3-mFSbAnXTy-T-QMYdpDXcHAIQvnmYWzqFx2ysfgxmYX5Zf84IdJQXhmmMOsZdEWyKs9rSabqUTR9MgOvJWcsdnVi38iERrDdojmQT1etmPrjWYkDR97qS6HoQieD8dNSONBYl6xZLXrrQaSeJmrJ9ynRj52KYmf0JE0QX8fA1feRzieELAGiiyNfV2WiKw3LbmmXhvZZ3teqmbC_zFXXbJTPIn5ZBIjvHmHT1aaLpZBWkQ8ChCXBJM"/>
<div class="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-12">
<div class="text-center max-w-lg">
<h3 class="text-white font-headline-lg mb-4">Nurturing Imagery</h3>
<p class="text-white/80 text-body-md">Photography should capture real moments of stillness, using natural light and earthy textures to ground the user experience.</p>
</div>
</div>
</div>
</div>
</section>
</main>
</div>
<!-- Footer -->
<footer class="bg-[#FDFBF7] dark:bg-[#1A1616] border-t border-[#E6E0D5] dark:border-[#2D2828] mt-20">
<div class="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
<div class="flex flex-col items-center md:items-start gap-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary" data-icon="spa">spa</span>
<span class="text-[#3C2F2F] font-bold font-serif">Mind Matter</span>
</div>
<p class="text-[#70665F] dark:text-[#A8A099] font-serif text-sm italic">© 2024 Mind Matter. Nurturing digital well-being through design.</p>
</div>
<div class="flex gap-8 font-serif text-sm italic">
<a class="text-[#70665F] dark:text-[#A8A099] hover:text-[#D4A373] transition-colors duration-300" href="#">Accessibility</a>
<a class="text-[#70665F] dark:text-[#A8A099] hover:text-[#D4A373] transition-colors duration-300" href="#">Privacy Policy</a>
<a class="text-[#70665F] dark:text-[#A8A099] hover:text-[#D4A373] transition-colors duration-300 underline" href="#">Guidelines</a>
</div>
</div>
</footer>
<!-- FAB (Suppressed as per rules for Doc/Settings pages, but keeping as placeholder logic reference) -->
<!-- Suppressed: Relevance Check says No FAB for Documentation/Guidelines screens -->
</body></html>
