import { Link } from 'react-router-dom'
import notFound from '../assets/images/not_found.png'

const NotFoundPage = () => {
  return (
    <main className='bg-primary h-screen flex-center flex-col'>
      <img className='sm:w-100 w-70' src={notFound} alt="not_found" />
      <Link to="/" className='bg-third text-primary font-semibold rounded-xl sm:text-xl text-sm px-7 py-3' >Back To Homepage</Link>
    </main>   
  )
}

export default NotFoundPage
