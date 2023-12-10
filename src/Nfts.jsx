import { Flex, Box,Image, Modal, IconButton } from "@chakra-ui/react";

function Nfts ({nftResults}) {

	return (
		<Flex w={'100%'} flexDir={'row'} wrap={'wrap'} justifyContent={'center'} gap={'10px'} p={'10px'} m={'10px'}>
			{nftResults.ownedNfts.map((e, i) => {
				return (
					<Nft e={e}  key={e.contract.address + e.tokenId}/>
				);
			})}
		</Flex>
	);

}

function Nft ({e}) {
  return (
    <Flex
      flexDir={'column'}
      m={'5px'}
      p={'5px'}
      borderRadius={'5px'}
      bg={'gray.300'}
      textColor={'black'}
      w={'28%'}
      gap={'5px'}
      justifyContent={'center'}
    >
      <Image
        src={
          e.media[0]?.thumbnail ??
          'https://via.placeholder.com/200'
        }
        alt={'Image'}
        boxSize={'100%'}
        aspectRatio={'1/1'}
        
      />
      <Box>
        { e.contract.name?.length === 0 ? 
            'No Name'
            : <>
            <Box overflow={'hidden'} whiteSpace={'nowrap'} textOverflow={'ellipsis'} > {e.contract.name} </Box> {`#${e.tokenId}`}
            </>}
      </Box>
    </Flex>
  )
}
export default Nfts;