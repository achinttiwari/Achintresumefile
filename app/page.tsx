import Image from 'next/image';
import Link from 'next/link';
import ScrollSequence from '@/components/ScrollSequence';

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION: Gutenberg Diagram & Cognitive Headshot */}
      <section style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10vh 5%',
        minHeight: '90vh'
      }}>
        
        {/* Left Side: Value Proposition (Reading Gravity) */}
        <div style={{ maxWidth: '50%' }}>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--color-secondary)', marginBottom: '20px' }}>
            Hi, I'm Achint Tiwari.
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '40px', color: 'var(--color-text)' }}>
            A Full-Stack Developer specializing in Next.js, React, and creating highly cognitive, visually engaging user experiences.
          </p>

          {/* Terminal Area: Primary Call-to-Action */}
          <Link href="#contact" className="cta-button">
            View My Resume
          </Link>
        </div>

        {/* Right Side: Strategic Headshot */}
        <div style={{ width: '40%', display: 'flex', justifyContent: 'center' }}>
          {/* IMPORTANT: Ensure 'tilt.jpg' or 'side.jpg' features you looking left toward the text */}
          <Image
            src="/images/tilt.jpg" 
            alt="Achint Tiwari"
            width={400}
            height={400}
            style={{ 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '5px solid var(--color-secondary)' 
            }}
            priority /* Instructs Vercel to preload this LCP image for performance */
          />
        </div>
      </section>

      {/* 2. ADVANCED ANIMATION SECTION */}
      <section id="projects" style={{ width: '100%', paddingBottom: '10vh' }}>
        <div style={{ padding: '0 5%', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-secondary)' }}>Selected Works</h2>
          <p style={{ maxWidth: '600px', color: 'var(--color-text)' }}>
            Scroll down to experience smooth, canvas-based GSAP animations simulating a high-performance video sequence.
          </p>
        </div>
        
        {/* Your custom GSAP component integrating the 300 JPG frames */}
        <ScrollSequence />
      </section>

    </div>
  );
}