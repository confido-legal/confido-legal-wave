import HostedFieldInput from '@/components/HostedFieldInput';
import { CreditCardBrandIcon } from '@/components/credit-cards/CreditCardBrandIcon';
import { useConfidoLegal } from '@/confido-legal-hook/useConfidoLegal';
import {
  Alert,
  AlertDescription,
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
  Tabs,
  Text,
} from '@chakra-ui/react';
import currency from 'currency.js';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ControlledCheckbox from '../ui/ControlledCheckbox';
import { ExternalIdLookup } from './ExternalIdLookup';

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

  const { hf, state: hostedFieldsState } = useConfidoLegal({
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
        } else {
          const body = await response.json().catch(() => null);
          setError(body?.error || `Payment failed (${response.status})`);
        }
      } catch (e) {
        console.error('Payment error:', e);
        setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    },
    (data) => {
      console.log('invlaid', data);
    }
  );

  const sendReceipt = watch('sendReceipt');
  const amount = watch('amount');

  const submitFieldsOnlyHandler = async () => {
    setLoading(true);
    try {
      const { error } = await window.gravityLegal.submitFields();
      if (error) {
        console.log('submitFields error:', error);
      } else {
        console.log('submitFields succeeded (no complete-payment call)');
      }
    } catch (e) {
      console.log('submitFields error: ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cents = currency(amount || '0', { errorOnInvalid: false }).intValue;

    if (cents >= 0) {
      hf.recalculateSurcharging({
        principalAmount: cents,
      });
    }
  }, [amount, hf]);

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

            <ExternalIdLookup />

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
                  <FormLabel htmlFor='name'>Name</FormLabel>
                  <Input id='name' {...register('name')} />
                </FormControl>

                <FormControl>
                  <FormLabel htmlFor='email'>Email for receipt</FormLabel>
                  <Input id='email' type='email' {...register('email')} />
                </FormControl>
              </Stack>

              <Divider />

              {/* Partners tend to hide inputs rather than remove them from the dom */}
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
              </Tabs>
              <Stack mt={2} spacing='5'>
                <Box hidden={formType !== 'card'}>
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
                </Box>
                {hostedFieldsState?.surcharging.willBeApplied && (
                  <Box hidden={formType !== 'card'}>
                    <Alert status='info'>
                      <AlertIcon />
                      <AlertDescription>
                        A fee of{' $'}
                        {(
                          hostedFieldsState.surcharging.amount!.fee / 100
                        ).toFixed(2)}{' '}
                        will be added to your total.
                      </AlertDescription>
                    </Alert>
                  </Box>
                )}
                <Box hidden={formType !== 'card'}>
                  <HostedFieldInput
                    id='card-exp'
                    label='Exp'
                    fieldState={
                      hostedFieldsState?.fields.cardExpirationDate
                    }
                  />
                </Box>
                <Box hidden={formType !== 'card'}>
                  <HostedFieldInput
                    id='card-cvv'
                    label='CVV'
                    fieldState={hostedFieldsState?.fields.cardSecurityCode}
                  />
                </Box>
                <Box hidden={formType !== 'ach'}>
                  <HostedFieldInput
                    id='account-holder-name'
                    label='Account Name'
                    fieldState={hostedFieldsState?.fields.accountHolderName}
                  />
                </Box>
                <Box hidden={formType !== 'ach'}>
                  <HostedFieldInput
                    id='account-number'
                    label='Account Number'
                    fieldState={hostedFieldsState?.fields.accountNumber}
                  />
                </Box>
                <Box hidden={formType !== 'ach'}>
                  <HostedFieldInput
                    id='routing-number'
                    label='Routing Number'
                    fieldState={hostedFieldsState?.fields.routingNumber}
                  />
                </Box>
              </Stack>

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
                <Stack direction='row' spacing={2}>
                  <Button colorScheme='blue' type='submit' variant='solid'>
                    Run payment
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    colorScheme='gray'
                    onClick={submitFieldsOnlyHandler}
                  >
                    Submit fields only (test)
                  </Button>
                </Stack>
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
