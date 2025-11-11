import { Layout } from '@/components/layout/Layout';
import { createPaymentToken } from '@/confido-legal-requests/createPaymentToken';
import { InferGetServerSidePropsType, NextPage } from 'next';

import { PaymentForm } from '@/components/payment-intents/PaymentForm';
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
  // grab the Gravity Legal Firm Token
  // from the current authenticated user
  const firmToken = session.user!.firm.glApiToken as string;

  try {
    // start a payment session
    const paymentToken = await createPaymentToken({
      firmToken,
    });

    return {
      props: {
        paymentToken,
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        paymentToken: null,
        error: 'No operating accounts exist. Please configure an operating account first.',
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
            <Text color='red.500'>{error}</Text>
          ) : (
            <PaymentForm paymentToken={paymentToken} />
          )}
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default PaymentIntentPage;
