import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' }}>
      <h2>Page Not Found</h2>
      <p style={{ marginTop: '10px' }}>Could not find requested resource</p>
      <Link href="/" style={{ color: '#0c44be', marginTop: '20px', display: 'inline-block' }}>
        Return Home
      </Link>
    </div>
  );
}
