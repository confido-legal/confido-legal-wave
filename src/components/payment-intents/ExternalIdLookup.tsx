import { getErrorMessage } from '@/lib/getErrorMessage';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Code,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';

interface ExternalIdLookupProps {}

export const ExternalIdLookup: React.FC<ExternalIdLookupProps> = () => {
  const [externalId, setExternalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payRequestData, setPayRequestData] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLookup = async () => {
    if (!externalId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pay-request-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          externalId: externalId.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch pay request data');
      }

      setPayRequestData(result);
      onOpen();
    } catch (e) {
      setError(getErrorMessage(e) || 'Failed to fetch pay request data');
      console.error('Error fetching pay request:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        py={{ base: '4', sm: '6' }}
        px={{ base: '4', sm: '6' }}
        bg='gray.50'
        borderRadius='lg'
        border='1px'
        borderColor='gray.200'
      >
        <Stack spacing='4'>
          <Text fontWeight='semibold' fontSize='sm' color='gray.700'>
            Lookup Pay Request by External ID
          </Text>

          <Stack direction='row' spacing='2'>
            <Input
              placeholder='Enter external ID...'
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
            />
            <Button
              onClick={handleLookup}
              isLoading={loading}
              loadingText='Looking up...'
              colorScheme='blue'
              minW='120px'
            >
              Lookup
            </Button>
          </Stack>

          {error && (
            <Alert status='error' size='sm'>
              <AlertIcon />
              {error}
            </Alert>
          )}
        </Stack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pay Request Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {payRequestData && (
              <Code display='block' whiteSpace='pre' p={4} fontSize='xs'>
                {JSON.stringify(payRequestData, null, 2)}
              </Code>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
