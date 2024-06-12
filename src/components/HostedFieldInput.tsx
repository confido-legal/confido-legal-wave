import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import { FC } from 'react';
import { FieldState } from '../confido-legal-hook/ConfidoLegal';

export interface HostedFieldInputProps {
  id: string;
  label: string;
  rightElement?: React.ReactNode;
  fieldState?: FieldState;
}

const HostedFieldInput: FC<HostedFieldInputProps> = ({
  id,
  label,
  rightElement,
  fieldState,
}) => {
  const loading = fieldState?.loading ?? true;
  const { error } = fieldState ?? {};

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <InputGroup>
        <Input
          id={id}
          as='div'
          className='border border-red-100 focus-within:border-red-400'
        />
        {loading && (
          <InputRightElement>
            <Spinner
              size='sm'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
            />
          </InputRightElement>
        )}
        {!loading && !!rightElement && rightElement}
      </InputGroup>
      <FormErrorMessage>{error?.message}</FormErrorMessage>
    </FormControl>
  );
};

export default HostedFieldInput;
