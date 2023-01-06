import '../styles/globals.css'
import Link from 'next/link';
import {Head} from "next/document";
import {useRouter} from "next/router";

function MyApp({ Component, pageProps }) {

  const router = useRouter();
  console.log(router.pathname)
  return (
    <div>
    <nav className='border-b p-6'>
      <p className='text-4xl font-bold text-center'>NFT Marketplace</p>
      <div className='flex mt-4 justify-center'>
        <Link href='/' >
          <a className={router.pathname === "/" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>Home</a>
        </Link>
        <Link href='/create-nft' >
          <a className={router.pathname === "/create-nft" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>Sell NFT</a>
        </Link>
        <Link href='/my-nfts' className={router.pathname === "/my-nfts" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>
          <a className={router.pathname === "/my-nfts" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>My NFT</a>
        </Link>
        <Link href='/creator-dashboard' className={router.pathname === "/creator-dashboard" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>
          <a className={router.pathname === "/creator-dashboard" ? "mr-4 text-blue-700" : "mr-4 text-black-500"}>Dashboard</a>
        </Link>
      </div>

    </nav>
   <Component {...pageProps} />
    </div>
  );
}

export default MyApp
