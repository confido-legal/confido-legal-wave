import HostedFieldInput from '@/components/HostedFieldInput';
import { CreditCardBrandIcon } from '@/components/credit-cards/CreditCardBrandIcon';
import { useConfidoLegal } from '@/confido-legal-hook/useConfidoLegal';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Code,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import currency from 'currency.js';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import ControlledCheckbox from '../ui/ControlledCheckbox';

interface FormData {
  amount: string;
  email?: string;
  name?: string;
  savePaymentMethod: boolean;
  sendReceipt?: boolean;
}

interface PaymentResult {
  amountProcessed: number;
  status: 'success' | 'partial_success' | 'failure';
}

export interface PaymentFormProps {
  paymentToken: string;
}

export const PaymentForm: FC<PaymentFormProps> = ({ paymentToken }) => {
  const router = useRouter();
  const { control, register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      sendReceipt: undefined,
    },
  });
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState<'card' | 'ach'>('card');
  const [result, setResult] = useState<PaymentResult>();
  const [error, setError] = useState<any>(null);

  const { state: hostedFieldsState } = useConfidoLegal({
    paymentToken,
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
        setLoading(false);
        return;
      }

      try {
        const amountInCents = currency(data.amount, {
          errorOnInvalid: true,
        }).intValue;

        const response = await fetch('/api/complete-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInCents,
            email: data.email,
            name: data.name,
            paymentToken,
            paymentMethod: hostedFieldsState?.paymentMethod,
            savePaymentMethod: data.savePaymentMethod,
            sendReceipt: data.sendReceipt,
          }),
        });

        // const json = await handleJsonResponse(response);

        if (response.ok) {
          setResult(await response.json());
        }

        console.log(response);
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

  const sendReceipt = watch('sendReceipt');

  return (
    <Stack spacing={{ base: '8', lg: '6' }} height='full'>
      {hostedFieldsState?.loadError && (
        <Alert status='error' variant='solid'>
          <AlertIcon />
          <span>{hostedFieldsState.loadError.message}</span>
        </Alert>
      )}

      {error && (
        <Alert status='error' variant='solid'>
          <AlertIcon />
          <span>{error}</span>
        </Alert>
      )}

      {result && (
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'white' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          position='relative'
          width='lg'
        >
          <Stack spacing='6'>
            <Heading textAlign='center'>Success!</Heading>
            <Text>Result:</Text>
            <Code display='block' whiteSpace='pre' p={4} fontSize='xs'>
              {JSON.stringify(result, null, 2)}
            </Code>
            <Button variant='solid' onClick={() => router.reload()}>
              Collect more
            </Button>
          </Stack>
        </Box>
      )}

      {!result && (
        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'white' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          position='relative'
          width='lg'
        >
          <form onSubmit={submitHandler}>
            <Stack spacing='6'>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount</FormLabel>
                <InputGroup>
                  <InputLeftAddon>USD</InputLeftAddon>
                  <Input
                    id='amount'
                    type='text'
                    placeholder='$10.00'
                    {...register('amount', { required: true })}
                  />
                </InputGroup>
                {hostedFieldsState?.surcharging.willBeApplied && (
                  <div>
                    a {hostedFieldsState.surcharging.rate! * 100}% surcharging
                    fee will be added
                  </div>
                )}
              </FormControl>

              <Stack spacing='5'>
                <FormControl>
                  <FormLabel htmlFor='email'>Name</FormLabel>
                  <Input id='name' {...register('name')} />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor='email'>Email for receipt</FormLabel>
                  <Input id='email' type='email' {...register('email')} />
                </FormControl>
              </Stack>

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
                        fieldState={
                          hostedFieldsState?.fields.cardExpirationDate
                        }
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

              <Stack spacing={2}>
                <Checkbox {...register('savePaymentMethod')}>
                  Store payment method
                </Checkbox>
                <ControlledCheckbox
                  control={control}
                  name='sendReceipt'
                  checkboxProps={{
                    isIndeterminate: sendReceipt === undefined,
                  }}
                >
                  Send receipt (
                  <Code>
                    {sendReceipt === undefined
                      ? 'null'
                      : sendReceipt.toString()}
                  </Code>
                  )
                </ControlledCheckbox>
              </Stack>
              <Stack spacing='6'>
                <Button colorScheme='blue' type='submit' variant='solid'>
                  Run payment
                </Button>
              </Stack>
            </Stack>
          </form>
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center bg-opacity-30 bg-slate-500'>
              <Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='xl'
              />
            </div>
          )}
        </Box>
      )}
    </Stack>
  );
};
