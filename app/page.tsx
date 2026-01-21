"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

// Wrapper for custom element to bypass TypeScript issues
function Iconify(props: React.HTMLAttributes<HTMLElement> & { icon: string; width?: string | number; "stroke-width"?: string | number; }) {
  // @ts-expect-error: Custom element not in JSX.IntrinsicElements
  return <iconify-icon {...props} />;
}

export default function Home() {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // Form State
  const [heroForm, setHeroForm] = useState({ name: "", email: "", propertyAddress: "" });
  const [contactForm, setContactForm] = useState({ name: "", email: "", propertyAddress: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent, type: 'hero' | 'contact') => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = type === 'hero' ? heroForm : contactForm;

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      toast.success('Message sent successfully!');
      if (type === 'hero') setHeroForm({ name: "", email: "", propertyAddress: "" });
      else setContactForm({ name: "", email: "", propertyAddress: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle JS Active class
  useEffect(() => {
    document.documentElement.classList.add("js-active");
  }, []);

  // Handle Scroll Observer for Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activePage]);

  // Handle Navbar Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (activePage === "home") {
        if (window.scrollY > window.innerHeight - 80) {
          setNavbarScrolled(true);
        } else {
          setNavbarScrolled(false);
        }
      } else {
        setNavbarScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activePage]);

  const handleNavigation = (pageId: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActivePage(pageId);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  const navClasses =
    activePage === "home" && !navbarScrolled
      ? "text-white border-transparent"
      : "bg-white/90 backdrop-blur-md border-brand-border text-brand-black";

  // Logic for inner menu text color
  const innerMenuTextColor = navbarScrolled || activePage !== "home" ? "text-brand-black/90" : "text-white/90";
  const innerMenuBtnClass = "hover-underline hover:opacity-75 transition-colors";
  const innerMenuCtaClass = navbarScrolled || activePage !== "home"
    ? "bg-brand-black text-white hover:bg-brand-gray border-brand-black"
    : "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white hover:text-brand-black";

  // Logic for mobile toggle color
  const mobileToggleColor = navbarScrolled || activePage !== "home" ? "text-brand-black" : "text-white";

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav
        id="navbar"
        className={`fixed top-0 w-full z-[60] transition-all duration-500 border-b ${navClasses}`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("home")}
            className="hover:opacity-70 transition-opacity z-[70] focus:outline-none"
          >
            <img
              src="/pioneerLogo.png"
              alt="Vishal Parekh"
              className="h-9 w-auto object-contain transition-all duration-300"
            />
          </button>

          <div className={`hidden md:flex items-center gap-8 text-xs font-medium tracking-wide uppercase ${innerMenuTextColor}`}>
            <button onClick={() => handleNavigation("about")} className={innerMenuBtnClass}>
              About
            </button>
            <button
              onClick={() => handleNavigation("contact")}
              className={`border px-5 py-2 rounded-full transition-all duration-300 ${innerMenuCtaClass}`}
            >
              Get in Touch
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button
            className={`md:hidden z-[70] ${mobileToggleColor}`}
            onClick={toggleMobileMenu}
            id="menu-btn"
          >
            <Iconify
              icon="solar:hamburger-menu-linear"
              width="24"
              stroke-width="1.5"
            ></Iconify>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          id="mobile-menu"
          className={`fixed inset-0 bg-[#0a0a0a] z-[65] flex flex-col justify-center items-center transition-all duration-500 md:hidden ${mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
        >
          <nav className="flex flex-col gap-8 text-center">
            <button
              onClick={() => { handleNavigation("home"); closeMobileMenu(); }}
              className="text-3xl font-light tracking-tight text-white hover:text-white/60"
            >
              Home
            </button>
            <button
              onClick={() => { handleNavigation("about"); closeMobileMenu(); }}
              className="text-3xl font-light tracking-tight text-white hover:text-white/60"
            >
              About
            </button>
            <button
              onClick={() => { handleNavigation("contact"); closeMobileMenu(); }}
              className="text-3xl font-light tracking-tight text-white hover:text-white/60"
            >
              Contact
            </button>
          </nav>
        </div>
      </nav>

      {/* PAGE 1: HOME */}
      <section id="home" className={`page-section ${activePage === "home" ? "active" : ""}`}>
        {/* Hero */}
        <div className="relative min-h-screen w-full overflow-hidden bg-brand-black flex items-center">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10 pointer-events-none"></div>
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2600&auto=format&fit=crop"
              className="w-full h-full object-cover animate-subtle-zoom opacity-80"
              alt="DFW Commercial Real Estate"
            />
          </div>

          <div className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-24 md:pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* LEFT: TEXT CONTENT */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:translate-x-12">
                <div className="overflow-hidden">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter leading-[0.95] text-white">
                    <span className="block opacity-0" style={{ animation: "fadeIn 1s ease-out forwards 0.2s" }}>
                      Vishal
                    </span>
                    <span className="block opacity-0 text-white/60" style={{ animation: "fadeIn 1s ease-out forwards 0.4s" }}>
                      Parekh.
                    </span>
                  </h1>
                </div>
                <div className="mt-8 max-w-lg overflow-hidden">
                  <p className="text-base md:text-lg font-light tracking-wide text-white/80 opacity-0" style={{ animation: "fadeIn 1s ease-out forwards 0.6s" }}>
                    Strategic Commercial & Residential Real Estate services across the Dallas-Fort Worth metroplex.
                  </p>
                </div>
                <div className="mt-8 opacity-0" style={{ animation: "fadeIn 1s ease-out forwards 0.8s" }}>
                  <button
                    onClick={() => handleNavigation("contact")}
                    className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/90 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors">
                      <Iconify icon="solar:arrow-right-linear" width="16" stroke-width="1.5"></Iconify>
                    </div>
                    Start Your Search
                  </button>
                </div>
              </div>

              {/* === NEW FORM OVERLAY === */}
              <div
                className="lg:col-span-6 relative mt-8 lg:mt-0 opacity-0"
                style={{
                  animation: "fadeIn 1s ease-out forwards 0.8s, float 6s ease-in-out infinite 1.8s"
                }}
              >
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl relative group w-full max-w-md mx-auto lg:ml-0 lg:translate-x-4">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none rounded-2xl"></div>

                  <div className="relative z-10 flex flex-col items-center -mt-20 mb-8">
                    <div className="w-[160px] h-[160px] rounded-full p-1 bg-gradient-to-b from-white/20 to-transparent backdrop-blur-md">
                      <div className="w-full h-full rounded-full bg-brand-dark overflow-hidden border border-white/10 relative">
                        <img
                          src="/profilePic.png"
                          alt="Vishal Parekh"
                          className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-white text-2xl font-medium tracking-tight">Let's Connect</h3>
                      <p className="text-white/50 text-sm">Schedule a consultation today.</p>
                    </div>

                    <div className="space-y-4">
                      <form onSubmit={(e) => handleFormSubmit(e, 'hero')} className="space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
                            <Iconify icon="solar:user-linear" width="20"></Iconify>
                          </div>
                          <input
                            type="text"
                            required
                            value={heroForm.name}
                            onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all"
                            placeholder="Your Name"
                          />
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
                            <Iconify icon="solar:letter-linear" width="20"></Iconify>
                          </div>
                          <input
                            type="email"
                            required
                            value={heroForm.email}
                            onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all"
                            placeholder="Email Address"
                          />
                        </div>

                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-white/80 transition-colors">
                            <Iconify icon="solar:map-point-linear" width="20"></Iconify>
                          </div>
                          <input
                            type="text"
                            required
                            value={heroForm.propertyAddress}
                            onChange={(e) => setHeroForm({ ...heroForm, propertyAddress: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-base text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all"
                            placeholder="Property Address"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-white text-brand-black font-bold text-base py-4 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <span>{isSubmitting ? 'Sending...' : 'Start Conversation'}</span>
                          {!isSubmitting && <Iconify icon="solar:arrow-right-linear" width="20"></Iconify>}
                        </button>
                      </form>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-center gap-8 text-white/40">
                      <a href="#" className="hover:text-white transition-colors"><Iconify icon="solar:phone-linear" width="20"></Iconify></a>
                      <a href="#" className="hover:text-white transition-colors"><Iconify icon="solar:brand-linkedin-linear" width="20"></Iconify></a>
                      <a href="#" className="hover:text-white transition-colors"><Iconify icon="solar:map-point-linear" width="20"></Iconify></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intro / Value Prop */}
        <div className="bg-brand-white py-24 md:py-32">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 reveal-on-scroll">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.05] text-brand-black mb-8">
                  Bridging the gap between <br />
                  <span className="text-brand-gray">commercial ambition</span> and <br />
                  residential comfort.
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pt-2">
                <p className="text-base md:text-lg text-brand-gray font-light leading-relaxed mb-8">
                  Whether you are scaling your business infrastructure or seeking the perfect home in DFW, I provide a dual-specialized approach. My practice is built on market analytics, negotiation precision, and an understanding of both asset classes.
                </p>
                <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-brand-black">
                  <span className="flex items-center gap-2">
                    <Iconify icon="solar:city-linear" width="16" stroke-width="1.5"></Iconify>
                    Commercial
                  </span>
                  <span className="flex items-center gap-2">
                    <Iconify icon="solar:home-smile-linear" width="16" stroke-width="1.5"></Iconify>
                    Residential
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Areas */}
        <div className="bg-brand-black text-white py-32 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/80 pointer-events-none"></div>

          <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
            <div className="mb-20 text-center max-w-3xl mx-auto reveal-on-scroll">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6">Beyond The Transaction</h2>
              <p className="text-white/60 text-lg font-light leading-relaxed">
                Elevating the real estate experience through a unified approach to Commercial, Residential, and Leasing services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
              {/* Service 1: Commercial */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 reveal-on-scroll">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-8 text-3xl">
                  <Iconify icon="solar:city-linear" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Commercial</h3>
                <p className="text-white/50 leading-relaxed mb-8 min-h-[48px]">
                  Strategic acquisition, disposition, and leasing for Office, Retail, and Industrial assets. Data-driven insights for maximum ROI.
                </p>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-blue-400" /> Investment Sales</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-blue-400" /> Tenant Representation</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-blue-400" /> Land Development</li>
                </ul>
              </div>

              {/* Service 2: Residential */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 reveal-on-scroll delay-100">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-8 text-3xl">
                  <Iconify icon="solar:home-smile-linear" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Residential</h3>
                <p className="text-white/50 leading-relaxed mb-8 min-h-[48px]">
                  Guiding families and individuals through buying and selling luxury homes. A personalized approach to finding your sanctuary.
                </p>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-emerald-400" /> Luxury Listings</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-emerald-400" /> First-Time Buyers</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-emerald-400" /> Investment Properties</li>
                </ul>
              </div>

              {/* Service 3: Apartment Locating */}
              <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 reveal-on-scroll delay-200">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-8 text-3xl">
                  <Iconify icon="solar:key-linear" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Apartment Locating</h3>
                <p className="text-white/50 leading-relaxed mb-8 min-h-[48px]">
                  Concierge-level leasing services for luxury apartments and high-rises. We navigate the market so you don't have to.
                </p>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-purple-400" /> Luxury High-Rises</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-purple-400" /> Relocation Services</li>
                  <li className="flex items-center gap-3"><Iconify icon="solar:check-circle-linear" className="text-purple-400" /> Lease Negotiations</li>
                </ul>
              </div>
            </div>

            {/* Areas Served */}
            <div className="border-t border-white/10 pt-20 reveal-on-scroll">
              <div className="flex flex-col md:flex-row items-baseline gap-12 mb-12">
                <h3 className="text-3xl font-light text-white shrink-0">Areas of Service</h3>
                <div className="h-px bg-white/10 w-full hidden md:block"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Dallas', 'Richardson', 'Plano', 'The Colony', 'Frisco', 'Little Elm', 'Prosper', 'Celina'].map((city, i) => (
                  <div key={city} className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-default group">
                    <span className="text-xs font-mono text-white/20 group-hover:text-white/40">0{i + 1}</span>
                    <span className="text-xl font-light tracking-wide">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE 2: ABOUT */}
      <section id="about" className={`page-section ${activePage === "about" ? "active" : ""}`}>
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            <div className="lg:col-span-5 reveal-on-scroll">
              <div className="aspect-[4/5] bg-brand-border rounded-sm overflow-hidden relative">
                <img src="/profilePic.png" className="w-full h-full object-cover" alt="Vishal Parekh Portrait" />
              </div>
            </div>
            <div className="lg:col-span-7 reveal-on-scroll delay-100">
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 text-brand-black">Vishal Parekh</h1>
              <h2 className="text-xl md:text-2xl text-brand-gray font-light mb-12">Serving the DFW Metroplex</h2>
              <div className="space-y-6 text-base md:text-lg font-light text-brand-black/80 leading-relaxed">
                <p>
                  My interest in real estate is rooted in family history, stemming from years in the real estate and building supply industries. This background gave me a natural appreciation for quality construction and the tangible value of property ownership.
                </p>
                <p>
                  Today, my priority is Commercial Real Estate, driven by a passion for investing and wealth strategies. I focus on finding my clients the perfect deal to build strong passive income and secure their financial future through smart, calculated real estate investing.
                </p>
              </div>
              <div className="mt-12 flex gap-8 border-t border-brand-border pt-8">
                <div>
                  <span className="block text-3xl font-semibold tracking-tight">10+</span>
                  <span className="text-xs uppercase tracking-wider text-brand-gray">Years Experience</span>
                </div>
                <div>
                  <span className="block text-3xl font-semibold tracking-tight">DFW</span>
                  <span className="text-xs uppercase tracking-wider text-brand-gray">Primary Focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* PAGE 5: CONTACT */}
      <section id="contact" className={`page-section ${activePage === "contact" ? "active" : ""}`}>
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-4">Start the Conversation</h1>
            <p className="text-brand-gray text-lg font-light">Commercial inquiry or finding your next home? Let's talk.</p>
          </div>

          <div className="bg-brand-white border border-brand-border rounded-xl p-8 md:p-12 shadow-[0_2px_20px_rgba(0,0,0,0.04)] reveal-on-scroll delay-100">
            <form onSubmit={(e) => handleFormSubmit(e, 'contact')} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-brand-gray">Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-brand-light border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-widest text-brand-gray">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-brand-light border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                    placeholder="email@address.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-brand-gray">Property Address</label>
                <input
                  type="text"
                  required
                  value={contactForm.propertyAddress}
                  onChange={(e) => setContactForm({ ...contactForm, propertyAddress: e.target.value })}
                  className="w-full bg-brand-light border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-black transition-colors"
                  placeholder="Street address or location of interest"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-black text-white font-medium py-4 rounded-lg hover:bg-brand-dark transition-colors tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="mt-16 text-center space-y-2 reveal-on-scroll">
            <p className="text-brand-black font-medium">Vishal Parekh</p>
            <a href="mailto:contact@vishalparekh.com" className="block text-brand-gray hover:text-brand-black transition-colors">contact@vishalparekh.com</a>
            <p className="text-brand-gray text-sm">Dallas-Fort Worth, Texas</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-white py-12 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-sm font-semibold tracking-tight">Vishal Parekh</span>
          <div className="flex gap-6 text-brand-gray">
            <a href="#" className="hover:text-brand-black transition-colors"><Iconify icon="solar:link-circle-linear" width="20"></Iconify></a>
            <a href="#" className="hover:text-brand-black transition-colors"><Iconify icon="solar:letter-linear" width="20"></Iconify></a>
          </div>
          <span className="text-xs text-brand-gray">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
