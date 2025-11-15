import React, { FC, useState } from 'react';
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Text,
  Link,
} from '@chakra-ui/react';
import { AddedClient, createClient } from '@/confido-legal-requests/addClient';
import { referenceGraphDocsInput } from '@/lib/graphDocs';

export interface AddClientProps {
  isOpen: boolean;
  firmId: string;
  firmApiToken: string;
  onClose: () => void;
  onCreate: (client: AddedClient) => void;
}

const AddClient: FC<AddClientProps> = ({
  isOpen,
  firmId,
  firmApiToken,
  onClose,
  onCreate,
}) => {
  const [error, setError] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddClient = async () => {
    if (!firmId) {
      setError(
        'Firm ID is missing. Please ensure you are logged in with a valid firm.',
      );
      return;
    }

    if (!clientName.trim()) {
      setError('Client name cannot be empty.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const client = await createClient(firmApiToken, clientName, firmId);
      onCreate(client);
      setClientName('');
      setError('');
      onClose();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.response?.data?.message ||
        'An error occurred while creating the client.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setClientName('');
        setError('');
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {error && (
            <Alert status='error' mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          <FormControl>
            <FormLabel>Client Name</FormLabel>
            <Input
              placeholder='John Doe'
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </FormControl>
          <Text mt={4}>
            There are many more fields you can add to the client. See the full
            schema{' '}
            <Link
              color='blue.500'
              href={referenceGraphDocsInput('AddClientInput')}
              isExternal
            >
              here
            </Link>
            .
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            onClick={handleAddClient}
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
          >
            Add Client
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClient;
