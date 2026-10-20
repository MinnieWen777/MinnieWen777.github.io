(() => {
  const root = document.documentElement;
  const motionToggle = document.querySelector('.motion-toggle');
  const motionText = document.querySelector('.motion-text');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const sections = [...document.querySelectorAll('[data-chapter]')];
  const progressLinks = [...document.querySelectorAll('.progress-link')];
  const progressFill = document.querySelector('.progress-fill');
  const progressKoala = document.querySelector('.progress-koala');

  let animationsReady = false;
  let userMotionOff = localStorage.getItem('not-yet-gone-motion') === 'off';

  function updateMotionUI() {
    const off = prefersReducedMotion || userMotionOff;
    root.classList.toggle('motion-off', off);
    if (motionToggle) {
      motionToggle.setAttribute('aria-pressed', String(off));
      motionToggle.setAttribute('aria-label', off ? 'Enable motion' : 'Reduce motion');
    }
    if (motionText) motionText.textContent = off ? 'Motion off' : 'Motion on';
    return off;
  }

  function setActiveChapter(id) {
    progressLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveChapter(visible.target.id);
  }, { threshold: [0.28, 0.5, 0.72] });
  sections.forEach((section) => observer.observe(section));

  function killAnimations() {
    if (!hasGSAP) return;
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.globalTimeline.clear();
    gsap.set(['.removable-tree','.fact-note','.ground-koala','.car','.smoke','.fire-koala','.sapling','.leaf','.final-koala','.ember'], { clearProps: 'all' });
    animationsReady = false;
  }

  function buildAnimations() {
    if (!hasGSAP || updateMotionUI()) return;
    gsap.registerPlugin(ScrollTrigger);
    if (animationsReady) return;
    animationsReady = true;

    gsap.from('.hero-card', { y: 30, opacity: 0, duration: 1.05, ease: 'power3.out' });
    gsap.from('.reveal-item', { y: 22, opacity: 0, stagger: .10, duration: .74, delay: .18, ease: 'power2.out' });
    gsap.to('.hero-image-wrap', {
      y: -12,
      rotation: -.5,
      ease: 'none',
      scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    gsap.utils.toArray('.story-copy').forEach((copy) => {
      const items = copy.querySelectorAll('.eyebrow,h2,.narration,.body-copy,.chapter-chip');
      gsap.from(items, {
        y: 28,
        opacity: 0,
        stagger: .07,
        duration: .72,
        ease: 'power2.out',
        scrollTrigger: { trigger: copy, start: 'top 78%', once: true }
      });
    });

    // Keep every chapter's key animation inside the visible reading window.
    // The shorter trigger ranges make the visual change complete before the
    // section title or evidence card scrolls behind the fixed navigation.
    const gapsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#gaps',
        start: 'top 72%',
        end: 'top 16%',
        scrub: 1.35
      }
    });
    gapsTl
      .to('.tree-b', { opacity: 0, y: 20, scale: .74, rotation: 2, duration: 1, ease: 'none' }, .05)
      .to('.tree-d', { opacity: 0, y: 21, scale: .72, rotation: -2, duration: 1, ease: 'none' }, .30)
      .to('.tree-e', { opacity: 0, y: 21, scale: .69, rotation: 2, duration: 1, ease: 'none' }, .55)
      .to('.fragment-lines span:nth-child(1)', { opacity: .65, x: 8, duration: .55, ease: 'none' }, .18)
      .to('.fragment-lines span:nth-child(2)', { opacity: .7, x: -4, duration: .55, ease: 'none' }, .39)
      .to('.fragment-lines span:nth-child(3)', { opacity: .7, x: 6, duration: .55, ease: 'none' }, .58)
      .to('.habitat-koala', { x: 58, y: 18, scale: .88, duration: 1, ease: 'none' }, .30)
      // Evidence is intentionally introduced before the habitat loss finishes,
      // so the user can read it while the scene is still fully on screen.
      .fromTo(
        '.fact-note-gaps',
        { autoAlpha: 0, y: 18, rotation: -2.2 },
        { autoAlpha: 1, y: 0, rotation: -1.3, duration: .65, ease: 'power2.out' },
        .34
      );

    const groundTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#ground',
        start: 'top 72%',
        end: 'top 15%',
        scrub: 1.35
      }
    });
    groundTl
      .to('.ground-koala', { x: 118, y: 250, scale: .76, duration: 1.35, ease: 'none' }, 0)
      // Cars now pass through the frame but remain visible at the end of the
      // chapter. This keeps the road danger legible while the evidence card is read.
      .fromTo('.car-one', { x: -145 }, { x: 320, duration: 1.35, ease: 'none' }, .18)
      .fromTo('.car-two', { x: 145 }, { x: -300, duration: 1.45, ease: 'none' }, .26)
      .fromTo(
        '.fact-note-ground',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: .48, ease: 'power2.out' },
        .12
      )
      .fromTo('.road-warning', { autoAlpha: 0, scale: .72 }, { autoAlpha: 1, scale: 1, duration: .35, ease: 'power2.out' }, .42);

    const fireTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#fire',
        start: 'top 72%',
        end: 'top 12%',
        scrub: 1.45
      }
    });
    fireTl
      .to('.smoke-one', { opacity: .80, scale: 1.18, x: 22, duration: 1, ease: 'none' }, 0)
      .to('.smoke-two', { opacity: .76, scale: 1.23, x: -24, duration: 1, ease: 'none' }, .20)
      .to('.smoke-three', { opacity: .90, scale: 1.27, y: -18, duration: 1, ease: 'none' }, .42)
      .to('.fire-koala', { opacity: .48, scale: .92, filter: 'grayscale(.58) contrast(.90) brightness(.67)', duration: 1.1, ease: 'none' }, .24)
      .to('.heat-ring-a', { scale: 1.08, opacity: .5, duration: .8, ease: 'none' }, .25)
      .to('.heat-ring-b', { scale: 1.13, opacity: .35, duration: .9, ease: 'none' }, .34)
      .to('.ember-a', { opacity: .9, y: -90, x: 18, duration: .9, ease: 'none' }, .30)
      .to('.ember-b', { opacity: .8, y: -120, x: -12, duration: 1.0, ease: 'none' }, .38)
      .to('.ember-c', { opacity: .85, y: -105, x: 14, duration: .95, ease: 'none' }, .46)
      // Keep the evidence card visible during the main fire transformation,
      // instead of revealing it after the section has nearly left the viewport.
      .fromTo(
        '.fact-note-fire',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: .62, ease: 'power2.out' },
        .28
      );

    // Recovery uses a time-based reveal rather than scrubbed leaf transforms.
    // This prevents the leaves from freezing in awkward in-between positions and
    // gives the final plant a clean, readable silhouette.
    gsap.set('.sapling .stem', { transformOrigin: '50% 100%' });
    gsap.set('.sapling .leaf-left', { transformOrigin: '100% 50%' });
    gsap.set('.sapling .leaf-right, .sapling .leaf-top', { transformOrigin: '0% 50%' });

    const plantTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#action',
        start: 'top 70%',
        once: true
      }
    });
    plantTl
      .fromTo(
        '.sapling .stem',
        { scaleY: .02 },
        { scaleY: 1, duration: 1.15, ease: 'power2.out' },
        0
      )
      .fromTo(
        '.sapling .leaf-left',
        { autoAlpha: 0, scaleX: .04, y: 7 },
        { autoAlpha: 1, scaleX: 1, y: 0, duration: .55, ease: 'back.out(1.15)' },
        .55
      )
      .fromTo(
        '.sapling .leaf-right',
        { autoAlpha: 0, scaleX: .04, y: 7 },
        { autoAlpha: 1, scaleX: 1, y: 0, duration: .55, ease: 'back.out(1.15)' },
        .78
      )
      .fromTo(
        '.sapling .leaf-top',
        { autoAlpha: 0, scaleX: .04, y: 7 },
        { autoAlpha: 1, scaleX: 1, y: 0, duration: .52, ease: 'back.out(1.1)' },
        1.00
      )
      .fromTo(
        '.final-koala',
        { autoAlpha: 0, x: -16 },
        { autoAlpha: 1, x: 0, duration: .68, ease: 'power2.out' },
        .92
      );

    gsap.from('.cta-card', {
      y: 18,
      opacity: 0,
      stagger: .12,
      duration: .78,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.cta-grid', start: 'top 84%', once: true }
    });

    gsap.from('.source-cards a', {
      y: 22,
      opacity: 0,
      stagger: .10,
      duration: .7,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.source-cards', start: 'top 86%', once: true }
    });

    ScrollTrigger.create({
      trigger: '#main',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = Math.min(1, Math.max(0, self.progress));
        if (progressFill) progressFill.style.height = `${p * 100}%`;
        if (progressKoala) progressKoala.style.top = `${p * 100}%`;
      }
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  updateMotionUI();
  buildAnimations();

  if (motionToggle) {
    motionToggle.addEventListener('click', () => {
      userMotionOff = !userMotionOff;
      localStorage.setItem('not-yet-gone-motion', userMotionOff ? 'off' : 'on');
      const off = updateMotionUI();
      if (off) killAnimations();
      else buildAnimations();
    });
  }
})();
