import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import {  Utils } from 'alchemy-sdk';

function Tokens({tokenResults, tokenDataObjects}) {
  const defaultLogo = "https://etherscan.io/images/main/empty-token.png";

  return (
    <Flex w={'80%'} flexDir={'column'} p={'5px'}  borderRadius={10} boxShadow={'2xl'}>
      {tokenResults.tokenBalances.map((e, i) => {
        return (
          <Flex flexDir={'row'} my={'5px'} mx={'10px'} py={'5px'} alignItems={'center'}
                borderColor={'darkgray'} w={'95%'}  boxShadow={'md'} key={e.contractAddress}>
            <Image src={tokenDataObjects[i].logo ||	defaultLogo} w={'4opx'} h={'40px'} ml={'2px'}/> 
            <Flex flexDir={'column'} mx={'2px'} alignItems={'flex-start'} w={'100%'}
            >
              <div className='token-info'>
                <b>Token: &nbsp; </b> 
                <div>{` ${tokenDataObjects[i].name} ($${tokenDataObjects[i].symbol})`}</div>
              </div>
              <div className='token-info'>
                <b>Balance: &nbsp; </b>
                 <div> {`${Utils.formatUnits(e.tokenBalance, tokenDataObjects[i].decimals)} ${tokenDataObjects[i].symbol}`}</div>
              </div>
            </Flex>
          </Flex> 
        );
      })}
    </Flex>
  )
  
}

export default Tokens;