import { useConfidoLegal } from '@/confido-legal-hook/useConfidoLegal';
import { StoredPaymentMethodForRunPayment } from '@/confido-legal-requests';
import { handleJsonResponse } from '@/lib/handleJsonResponse';
import {
  Button,
  Code,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import HostedFieldInput from '../HostedFieldInput';
import { CreditCardBrandIcon } from '../credit-cards/CreditCardBrandIcon';
import { useSavePaymentMethodToken } from './useSavePaymentMethodToken';

export interface CreateStoredPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoredPaymentMethodModal: FC<
  CreateStoredPaymentMethodModalProps
> = ({ isOpen, onClose }) => {
  const initialFocusRef = React.useRef(null);
  const { loading, error, token } = useSavePaymentMethodToken();

  return (
    <Modal initialFocusRef={initialFocusRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save a Payment Method</ModalHeader>
        <ModalCloseButton />
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {token && (
          <StorePaymentMethodForm
            initialFocusRef={initialFocusRef}
            onClose={onClose}
            token={token}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export interface StorePaymentMethodFormProps {
  initialFocusRef: React.RefObject<any>;
  onClose: () => void;
  token: string;
}

interface FormData {
  clientName: string;
  email: string;
}

const StorePaymentMethodForm: FC<StorePaymentMethodFormProps> = ({
  initialFocusRef,
  onClose,
  token,
}) => {
  const { register, handleSubmit } = useForm<FormData>();
  const [formType, setFormType] = useState<'card' | 'ach'>('card');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StoredPaymentMethodForRunPayment | null>(
    null
  );
  const [error, setError] = useState<any>(null);

  const { state: hostedFieldsState } = useConfidoLegal({
    savePaymentMethodToken: token,
    formType,
  });

  const handleTabsChange = (index: number) => {
    setFormType(index === 0 ? 'card' : 'ach');
  };

  const submitHandler = handleSubmit(
    async (data) => {
      setLoading(true);

      const { error } = await window.gravityLegal.submitFields();

      if (error) {
        console.log(error);
        setError(error);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/stored-payment-methods/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientName: data.clientName,
            email: data.email,
            token,
            paymentMethod: hostedFieldsState?.paymentMethod,
          }),
        });

        const result =
          await handleJsonResponse<StoredPaymentMethodForRunPayment>(response);
        console.log(result);
        setResult(result);
      } catch (e) {
        console.log('error: ', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    },
    (data) => {
      console.log('invlaid', data);
    }
  );

  if (result) {
    return (
      <ModalBody pb={6}>
        <Stack spacing='6'>
          <Heading textAlign='center'>Success!</Heading>
          <Text>Result:</Text>
          <Code display='block' whiteSpace='pre' p={4} fontSize='xs'>
            {JSON.stringify(result, null, 2)}
          </Code>
          <Button variant='solid' onClick={onClose}>
            Close
          </Button>
        </Stack>
      </ModalBody>
    );
  }

  return (
    <form onSubmit={submitHandler}>
      <ModalBody pb={6}>
        <Stack spacing='6'>
          {error && <div>{error.message}</div>}

          <FormControl>
            <FormLabel>Client name</FormLabel>
            <Input placeholder='John Doe' {...register('clientName')} />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder='example@gmail.com' {...register('email')} />
          </FormControl>

          <Divider />

          <Tabs
            colorScheme='blue'
            index={formType === 'card' ? 0 : 1}
            variant='soft-rounded'
            onChange={handleTabsChange}
          >
            <TabList>
              <Tab>Card</Tab>
              <Tab>Bank Account</Tab>
            </TabList>
            <TabPanels mt={2}>
              <TabPanel px={0}>
                <Stack spacing='5'>
                  <HostedFieldInput
                    id='card-number'
                    label='Card Number'
                    fieldState={hostedFieldsState?.fields.cardNumber}
                    rightElement={
                      <InputRightElement pointerEvents='none' p={2} w={14}>
                        <CreditCardBrandIcon
                          className='w-full'
                          brand={hostedFieldsState?.cardData?.brand}
                        />
                      </InputRightElement>
                    }
                  />
                  <HostedFieldInput
                    id='card-exp'
                    label='Exp'
                    fieldState={hostedFieldsState?.fields.cardExpirationDate}
                  />
                  <HostedFieldInput
                    id='card-cvv'
                    label='CVV'
                    fieldState={hostedFieldsState?.fields.cardSecurityCode}
                  />
                </Stack>
              </TabPanel>
              <TabPanel px={0}>
                <Stack spacing='5'>
                  <HostedFieldInput
                    id='account-holder-name'
                    label='Account Name'
                    fieldState={hostedFieldsState?.fields.accountHolderName}
                  />
                  <HostedFieldInput
                    id='account-number'
                    label='Account Number'
                    fieldState={hostedFieldsState?.fields.accountNumber}
                  />
                  <HostedFieldInput
                    id='routing-number'
                    label='Routing Number'
                    fieldState={hostedFieldsState?.fields.routingNumber}
                  />
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} type='submit' isLoading={loading}>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </form>
  );
};

export default CreateStoredPaymentMethodModal;
