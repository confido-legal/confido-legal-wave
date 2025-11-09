import { Layout } from '@/components/layout/Layout';
import CreateStoredPaymentMethodModal from '@/components/stored-payment-methods/CreateStoredPaymentMethodModal';
import { StoredPaymentMethodForList } from '@/confido-legal-requests/getStoredPaymentMethods';
import {
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const StoredPaymentMethodsPage: NextPage = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<
    StoredPaymentMethodForList[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const openCreateModal = () => setCreateModalOpen(true);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stored-payment-methods/list');
      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to load payment methods');
        return;
      }

      setPaymentMethods(data);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const isActive = currentStatus === 'active';
    const endpoint = isActive
      ? '/api/stored-payment-methods/delete'
      : '/api/stored-payment-methods/reactivate';
    const action = isActive ? 'deactivated' : 'reactivated';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast({
          title: 'Error',
          description: data.error || `Failed to ${action.slice(0, -1)} payment method`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // display a success message
      toast({
        title: 'Success',
        description: `Payment method ${action}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // refresh payments upon update
      fetchPaymentMethods();
      // display error if any occur
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'An error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleModalClose = () => {
    setCreateModalOpen(false);
    // refresh payment methods on modal close
    fetchPaymentMethods();
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <Layout>
      <Container maxW='container.xl' py={8}>
        <Stack spacing={6}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Heading size='lg'>Stored Payment Methods</Heading>
            <Button colorScheme='blue' onClick={openCreateModal}>
              Save New Payment Method
            </Button>
          </Box>

          {loading && (
            <Box display='flex' justifyContent='center' py={8}>
              <Spinner size='xl' />
            </Box>
          )}

          {error && (
            <Text color='red.500' textAlign='center'>
              {error}
            </Text>
          )}

          {!loading && !error && paymentMethods.length === 0 && (
            <Text textAlign='center' color='gray.500' py={8}>
              No stored payment methods found
            </Text>
          )}

          {!loading && !error && paymentMethods.length > 0 && (
            <Box
              borderWidth='1px'
              borderRadius='lg'
              overflow='hidden'
              bg='white'
            >
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Payer Name</Th>
                    <Th>Type</Th>
                    <Th>Last 4</Th>
                    <Th>Status</Th>
                    <Th width='100px'>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentMethods.map((method) => (
                    <Tr key={method.id}>
                      <Td>{method.payerName || '-'}</Td>
                      <Td>
                        {method.cardBrand || method.paymentMethod || 'Card'}
                      </Td>
                      <Td>{method.lastFour}</Td>
                      <Td>
                        <Text
                          color={method.status === 'active' ? 'green.500' : 'red.500'}
                          fontWeight='medium'
                        >
                          {method.status}
                        </Text>
                      </Td>
                      <Td>
                        <Button
                          size='sm'
                          // TODO - fix the color scheme
                          colorScheme={method.status === 'active' ? 'red' : 'green'}
                          variant='ghost'
                          onClick={() => handleToggleStatus(method.id, method.status)}
                        >
                          {method.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Stack>

        <CreateStoredPaymentMethodModal
          isOpen={createModalOpen}
          onClose={handleModalClose}
        />
      </Container>
    </Layout>
  );
};

export default StoredPaymentMethodsPage;
