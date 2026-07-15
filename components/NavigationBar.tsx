
import Link from 'next/link';

export default function NavigationBar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 5%',
      backgroundColor: 'var(--color-background)', /* Cream */
      borderBottom: '1px solid var(--color-secondary)' /* Navy Blue accent border */
    }}>
      {/* Primary Optical Area: Brand Identity */}
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link href="/" style={{ color: 'var(--color-text)' }}>
          Achint Tiwari
        </Link>
      </div>

      {/* Navigation Links and Terminal Area CTA */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href="#projects" style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Projects
        </Link>
        <Link href="#experience" style={{ color: 'var(--color-text)', fontWeight: 500 }}>
          Experience
        </Link>
        
        {/* Dark Maroon Call-To-Action Button leveraging our globals.css class */}
        <Link href="#contact" className="cta-button">
          Hire Me
        </Link>
      </div>
    </nav>
  );
}