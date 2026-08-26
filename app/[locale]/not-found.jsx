import notFound from '@/public/asstes/404.png'
import Image from 'next/image'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '1.5rem',
    }}>
      <div style={{ position: 'relative', width: '400px', height: '300px' }}>
        <Image src={notFound} fill alt="404 - page not found" style={{ objectFit: 'contain' }} />
      </div>
   
    </div>
  )
}

export default NotFound