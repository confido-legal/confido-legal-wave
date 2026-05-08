import AddClient from '@/components/clients/AddClient';
import { Layout } from '@/components/layout/Layout';
import { useSession } from '@/components/layout/SessionProvider';
import { AddedClient } from '@/confido-legal-requests/addClient';
import { Client } from '@/confido-legal-requests/getClient';
import { graphDocsUrl, referenceGraphDocsObject } from '@/lib/graphDocs';
import { requireAuth } from '@/lib/session';
import {
  Button,
  Container,
  Heading,
  Stack,
  Text,
  Link,
  Card,
  CardHeader,
  CardBody,
  Code,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useState } from 'react';

export const getServerSideProps = requireAuth();

const ClientsPage: NextPage = () => {
  const session = useSession();
  const { glFirm } = session;
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [addedClient, setAddedClient] = useState<AddedClient | null>(null);
  const [fetchedClient, setFetchedClient] = useState<Client | null>(null);
  const [error, setError] = useState('');

  const openCreateModal = () => {
    setAddedClient(null);
    setFetchedClient(null);
    setError('');
    setCreateModalOpen(true);
  };

  const handleGetClient = async () => {
    setFetchedClient(null);
    if (!addedClient) {
      setError('No client ID to fetch.');
      return;
    }

    try {
      const response = await fetch('/api/clients/get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: addedClient.id }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error || `Failed to fetch client (${response.status})`);
        return;
      }

      const client = await response.json();
      setFetchedClient(client);
      setError('');
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('An unexpected error occurred while fetching the client.');
    }
  };

  return (
    <Layout>
      <Container py='8'>
        <Heading as='h1' size={{ base: 'md', md: 'lg' }}>
          Clients
        </Heading>
        <Stack spacing='4' mt='4'>
          {error && (
            <Alert status='error'>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {!glFirm && (
            <Alert status='warning'>
              <AlertIcon />
              Your firm is not connected to Confido Legal. Please complete the
              connection setup on the home page first.
            </Alert>
          )}
          <Text textStyle={{ base: 'lg', md: 'xl' }} color='fg.muted'>
            Add and request clients using our{' '}
            <Link href={graphDocsUrl} isExternal color='blue.500'>
              GraphQL API
            </Link>
            .
          </Text>
          <Text color='fg.muted'>
            You can see clients you have created when emulating an admin for the
            firm in your sandbox account.
          </Text>
          <Button
            colorScheme='blue'
            width='90px'
            onClick={openCreateModal}
            isDisabled={!glFirm}
          >
            Add client
          </Button>
          <AddClient
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onCreate={setAddedClient}
          />
          {addedClient && (
            <Card>
              <CardHeader>
                <Heading as='h2' size='md'>
                  Added client
                </Heading>
                <CardBody p={0} mt={4}>
                  <Stack spacing='6'>
                    <Code p={4} display='block' whiteSpace='pre' fontSize='xs'>
                      {JSON.stringify(addedClient, null, 2)}
                    </Code>
                    <Text>
                      Now that you have created a client, you can{' '}
                      <Link
                        color='blue.500'
                        href={referenceGraphDocsObject('Query')}
                        isExternal
                      >
                        request the client
                      </Link>{' '}
                      using the id.
                    </Text>
                    <Text>
                      Try it out now by requesting the client you just created.
                    </Text>
                    <Button
                      width='150px'
                      variant='solid'
                      onClick={handleGetClient}
                    >
                      Request client by id
                    </Button>
                    {fetchedClient && (
                      <Stack spacing='6'>
                        <Heading as='h3' size='md'>
                          Requested client
                        </Heading>
                        <Code
                          p={4}
                          display='block'
                          whiteSpace='pre'
                          fontSize='xs'
                        >
                          {JSON.stringify(fetchedClient, null, 2)}
                        </Code>
                        <Text>
                          There are many more fields you can request with the
                          client. See the full schema{' '}
                          <Link
                            color='blue.500'
                            href={referenceGraphDocsObject('Client')}
                            isExternal
                          >
                            here
                          </Link>
                          .
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </CardBody>
              </CardHeader>
            </Card>
          )}
        </Stack>
      </Container>
    </Layout>
  );
};

export default ClientsPage;
