import { Layout } from '@/components/layout/Layout';
import { InferGetServerSidePropsType, NextPage } from 'next';

import PaylinkPaymentForm from '@/components/paylinks/PaylinkPaymentForm';
import { createPaymentToken } from '@/confido-legal-requests/createPaymentToken';
import { requireAuth } from '@/lib/session';
import {
  Container,
  Heading,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

export const getServerSideProps = requireAuth(async ({ session }) => {
  // grab the Confido Legal Firm Token
  // from the current authenticated user
  const firmToken = session.user!.firm.glApiToken as string;

  const paymentLinkId = 'a1e7a82e-b59e-4645-b559-22e12bfb265c';

  const paymentToken = await createPaymentToken({ firmToken, paymentLinkId });

  return {
    props: {
      paymentToken,
    },
  };
});

export const PaymentIntentPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ paymentToken }) => {
  return (
    <Layout>
      <Container py={{ base: '16', md: '24' }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
          <Stack spacing={{ base: '4', md: '6' }}>
            <Stack spacing='4'>
              <Heading as='h1' size={{ base: 'md', md: 'lg' }}>
                Payment Links
              </Heading>
            </Stack>
            <Text textStyle={{ base: 'lg', md: 'xl' }} color='fg.muted'>
              Payment Links are awesome.
            </Text>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Create a payment session from your server
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Initialize the Hosted Fields SDK
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                Pass the returned payment token to your server and finish the
                payment.
              </ListItem>
            </List>
          </Stack>
          <PaylinkPaymentForm paymentToken={paymentToken} />
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default PaymentIntentPage;
