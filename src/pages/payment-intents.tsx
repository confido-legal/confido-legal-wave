import { Layout } from '@/components/layout/Layout';
import { createPaymentToken } from '@/confido-legal-requests/createPaymentToken';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { InferGetServerSidePropsType, NextPage } from 'next';

import { PaymentForm } from '@/components/payment-intents/PaymentForm';
import { requireAuth } from '@/lib/session';
import {
  Alert,
  AlertDescription,
  AlertIcon,
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
  const firmToken = session.user!.firm.glApiToken;

  if (!firmToken) {
    return {
      props: {
        paymentToken: null,
        error: 'Your firm is not connected to Confido Legal. Please complete the connection setup on the home page first.',
      },
    };
  }

  try {
    const paymentToken = await createPaymentToken({ firmToken });

    return {
      props: {
        paymentToken,
        error: null,
      },
    };
  } catch (e) {
    console.error('Failed to create payment token:', e);

    return {
      props: {
        paymentToken: null,
        error: getErrorMessage(e),
      },
    };
  }
});

export const PaymentIntentPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ paymentToken, error }) => {
  return (
    <Layout>
      <Container py={{ base: '16', md: '24' }}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={12}>
          <Stack spacing={{ base: '4', md: '6' }}>
            <Stack spacing='4'>
              <Heading as='h1' size={{ base: 'md', md: 'lg' }}>
                Payment Intents
              </Heading>
            </Stack>
            <Text textStyle={{ base: 'lg', md: 'xl' }} color='fg.muted'>
              Payment Intents are the simplest way to collect money. Make a
              payment using the form.
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
          {error ? (
            <Alert status='error' borderRadius='xl' alignSelf='start'>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <PaymentForm paymentToken={paymentToken!} />
          )}
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default PaymentIntentPage;
