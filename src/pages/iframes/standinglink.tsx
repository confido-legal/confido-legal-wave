import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function StandingLinkPage() {
  const router = useRouter();
  const url = router.query.url as string;

  return (
    <>
      <Head>
        <title>Confido Legal Standing Link</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <Box width='100vw' height='100vh' overflow='hidden' position='relative'>
        {url && (
          <Box
            as='iframe'
            src={url}
            width='100%'
            height='100%'
            border='none'
            title='Confido Legal Standing Link'
            allowFullScreen
            // Security attributes for iframe
            sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation'
          />
        )}

        {!url && (
          <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            height='100%'
            fontSize='lg'
            color='gray.500'
          >
            No standing link URL provided
          </Box>
        )}
      </Box>
    </>
  );
}
