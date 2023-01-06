import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from 'web3modal';
import {CHAIN_ID, contractAddress, INFURA_URL} from '../config';
import NFTMarketplace from '../abi/NFTMarketplace.json';
import Image from 'next/image';
import NoNFTGif from "../assets/lottie/no-nft.gif";
import ETHImage from "../assets/eth.png";

export default function Home(){

  const [nfts,setNfts] = useState([]);
  const [loadingState,setLoadingState] = useState('not-loaded');

  useEffect(()=>{
    loadNFTs();
  },[]);

  async function loadNFTs(){
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    console.log(provider)
    const marketContract = new ethers.Contract(contractAddress,NFTMarketplace.abi,provider);
    console.log(marketContract)
    const data = await marketContract.fetchMarketItems(); // All unsold nfts
    console.log(data)

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await marketContract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(),'ether');

      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        image:meta.data.image,
        description: meta.data.description
      };

      return item;
    }));

    setNfts(items);
    setLoadingState('loaded');
  }

  async function buyNFT(nft){
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const getnetwork = await provider.getNetwork();
    console.log(getnetwork)
    const goerliChainId = CHAIN_ID;
    if(getnetwork.chainId != goerliChainId){
      alert("You are not connected to Goerli network");
      return;
    }

    // sign the transaction
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress,NFTMarketplace.abi,signer);
    const price = ethers.utils.parseUnits(nft.price.toString(),'ether');
    const transaction = await contract.createMarketSale(nft.tokenId,{value:price});
    await transaction.wait();
    loadNFTs();
  }

  if(loadingState == 'not-loaded') return (
      <h1 className='px-20 py-10 text-xl text-center'>Working on it</h1>
  )

  if(loadingState == 'loaded' && !nfts.length) return (
      <div className='flex justify-center flex-col'>
        <h1 className='px-20 py-10 text-xl text-center'>Marketplace is empty!</h1>
        <Image src={NoNFTGif} width='50px' height='300px'  objectFit='contain'/>
      </div>
  )

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{maxWidth:'1600px'}}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-4'>
            {
              nfts.map((nft,i)=>(
                  <div key={i} className='shadow overflow-hidden mx-5 my-5'>
                    <Image src={nft.image} alt={nft.name} width={400} height={300} placeholder="blur" blurDataURL='/placeholder.png' layout='responsive'/>
                    <div className='p-3 flex justify-between'>
                      <p  className="text-md text-ellipsis font-semibold">{nft.name}</p>
                      <Image src={ETHImage} width='20px' height='20px' objectFit={'contain'}/>
                    </div>
                    <div className='p-4 bg-black'>
                      <p className='text-xl text-center mb-4 font-bold text-white'>{nft.price} ETH
                      </p>
                      <button className='w-full bg-red-500 text-white font-bold py-2 px-12 rounded' onClick={()=>buyNFT(nft,nft.price)}>Buy NFT</button>
                    </div>
                  </div>

              ))
            }
        </div>
      </div>
    </div>
  )
}
