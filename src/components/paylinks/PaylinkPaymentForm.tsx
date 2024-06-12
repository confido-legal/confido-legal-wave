import HostedFieldInput from '@/components/HostedFieldInput';
import { CreditCardBrandIcon } from '@/components/credit-cards/CreditCardBrandIcon';
import { useConfidoLegal } from '@/confido-legal-hook/useConfidoLegal';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
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
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface PaylinkPaymentFormProps {
  paymentToken: string;
}

interface FormData {
  email: string;
  savePaymentMethod: boolean;
}

export interface PaymentResult {}

const PaylinkPaymentForm: FC<PaylinkPaymentFormProps> = ({ paymentToken }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormData>();
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
        const response = await fetch('/api/complete-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: hostedFieldsState?.paymentLink.totalAmount,
            email: data.email,
            paymentToken,
            paymentMethod: hostedFieldsState?.paymentMethod,
            savePaymentMethod: data.savePaymentMethod,
          }),
        });

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

  console.log(hostedFieldsState);

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
              <Text>{hostedFieldsState?.paymentLink?.totalAmount}</Text>

              <FormControl>
                <FormLabel htmlFor='amount'>Amount</FormLabel>
                {hostedFieldsState?.surcharging.willBeApplied && (
                  <div>
                    a {hostedFieldsState.surcharging.rate! * 100}% surcharging
                    fee will be added
                  </div>
                )}
              </FormControl>

              <Stack spacing='5'>
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

              <HStack justify='space-between'>
                <Checkbox {...register('savePaymentMethod')}>
                  Store payment method
                </Checkbox>
              </HStack>
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

export default PaylinkPaymentForm;
