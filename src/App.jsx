import {Button, Center, Flex, Heading, Input, Text, Box, Image,
  CircularProgress, Alert, AlertIcon, AlertTitle, CloseButton,
Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator} from '@chakra-ui/react';
import { Alchemy, Network, NftFilters, Utils } from 'alchemy-sdk';
import Tokens from './Tokens';
import Nfts from './Nfts';
import { useEffect, useState } from 'react';

function App() {
const [userAddress, setUserAddress] = useState('');
const [balance, setBalance] = useState();
const [nftResults, setNftResults] = useState();
const [tokenResults, setTokenResults] = useState();
const [tokenDataObjects, setTokenDataObjects] = useState([]);
const [queryState, setQueryState] = useState('no-query');
const [showError, setShowError] = useState(false);

useEffect(() => { (
 async () => {
 try{
   if(userAddress){
     console.log('in effect');
     const config = {
       apiKey: 'XITKHvItMhhVRr55ED8Uvh2vjtahxHwe',
       network: Network.ETH_MAINNET,
     };
     
     const alchemy = new Alchemy(config);
     setBalance( await alchemy.core.getBalance(userAddress));
     const tokenData = await alchemy.core.getTokenBalances(userAddress);
     const nftData = await alchemy.nft.getNftsForOwner(userAddress,{excludeFilters: [NftFilters.SPAM]});
     
     setTokenResults(tokenData);
     setNftResults(nftData);
     
     const tokenDataPromises = [];
     
     for (let i = 0; i < tokenData.tokenBalances.length; i++) {
       const tokenMetaData = alchemy.core.getTokenMetadata(
         tokenData.tokenBalances[i].contractAddress
         );
         tokenDataPromises.push(tokenMetaData);
       }
       
       setTokenDataObjects(await Promise.all(tokenDataPromises));
       setQueryState('done');
       setShowError(false);
   }
 } catch (error) {
   setQueryState('no-query');
   setUserAddress(''); 
   setShowError(true);
   console.log(error);
 }
 }
 )();
 
}, [userAddress]);

const etherLogo = "https://etherscan.io/images/svg/brands/ethereum-original.svg";


const getAccount = async ()=> {
 const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
 document.getElementById('connect-button').innerText = `${account[0].slice(0,5)}...${account[0].slice(-5)}`;
 changeState(account[0]);
 
}

const searchAddress = () => {
 const address = document.getElementById('input').value;
 changeState(address);
 document.getElementById('input').value = '';
}

function changeState(address) {
 setQueryState('pending');
 setUserAddress(address);
}

// *Nested Component for handling Query states as Switch Statement cannot be used directly in JSX
function Content () {
  switch(queryState){
    case 'no-query':
      return 'Please make a query! This may take a few seconds...'
    case 'pending':
      return <CircularProgress isIndeterminate color='green.600' size={'100px'} thickness={'4px'} />
    case 'done':
      return (
      <>
      <Flex flexDir={'column'} boxShadow={'md'} borderRadius={'5px'} w={'fit-content'} alignItems={'center'}>
        <Heading fontSize={20} p={'10px'} mx={'10px'} alignSelf={'center'} overflow={'hidden'} w={'100%'} maxW={'600px'} whiteSpace={'nowrap'} textOverflow={'ellipsis'}>
          Address: {userAddress}
        </Heading>
        <Flex mx={'15px'} alignItems={'center'} alignSelf={'center'} mb={'10px'} p={'10px'}>
          <Image src={etherLogo} w={'4opx'} h={'40px'} />
          <Box fontSize={18} mx={'5px'}>
            {`${Utils.formatEther(balance._hex)} ETH` }
          </Box>
        </Flex>
      </Flex>
      <Tabs isFitted align='center' variant={'unstyled'} w={'90vw'}>
        <TabList h={'fit-content'}>
            <Tab>Tokens</Tab>
            <Tab>NFTs</Tab>
        </TabList>
      <TabIndicator  mt="-1.5px"
      height="1px" 
      bg="green.500"
      borderRadius="5px"/>
        <TabPanels>
            <TabPanel w={'80%'}>
                <Tokens tokenResults={ tokenResults} tokenDataObjects={tokenDataObjects}/>
            </TabPanel>
            <TabPanel w={'100%'}>
              <Nfts nftResults={nftResults}/>
            </TabPanel>
        </TabPanels>
      </Tabs>
      </>)
  }
}


return (
<Flex flexDir={'column'} w="100vw" bgGradient={"linear(to-b, green.200, #81baba )"} minH={window.innerHeight} shrink={1}>
 <Center>
   <Flex alignItems={'center'} justifyContent="center" flexDirection={'column'} >
     <Heading mb={0} mt='30px' fontSize={40}>
       Token/NFT Indexer
     </Heading>
     <Text>
       Plug in an address and this website will return all of its ERC-20 tokens/Nfts!
     </Text>
   </Flex>
 </Center>
 <Button pos={'absolute'} right={'10px'} top={'20px'}  bgColor="green.500" boxShadow={'md'} maxW={'140px'} 
         _hover={{ boxShadow: 'dark-lg' }} id='connect-button' display={'flex'}
         onClick={(e)=>{ e.preventDefault; 
                          getAccount();}} 
  >
   connect wallet
 </Button>
 <Flex w="100%" flexDirection="column" alignItems="center" justifyContent={'center'} >
   <Heading mt={42}  fontSize={25}>
     Get all the ERC-20 tokens/NFTs of this address:
   </Heading>
   <Input id='input'
     color="black" w="50%" maxW='600px' m={4} boxShadow={'md'} textAlign="center" p={4} bgColor="white" fontSize={20}
   />
   <Button fontSize={20} onClick={searchAddress} m={8} bgColor="green.500" boxShadow={'md'} 
           textColor={'whatsapp.200'} _hover={{ boxShadow: 'dark-lg' }}
    >
     Check ERC-20 tokens/NFTs
   </Button>

   {
   showError &&
   <Alert status='error' justifyContent={'center'} variant={'left-accent'} w='50%'>
     <AlertIcon />
     <AlertTitle>ERROR! </AlertTitle>
     INVALID ADDRESS
     <CloseButton onClick={()=> setShowError(false)} pos={'absolute'} top={'2px'} right={'2px'}/>
   </Alert>
   }

   <Heading my={4}>ERC-20 tokens/NFTs:</Heading>
   <Content/>
 </Flex>
</Flex>
);
}

export default App;
