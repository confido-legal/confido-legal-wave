import { useEffect, useState } from 'react';
import { ChangeEvent, HostedFieldsState } from './ConfidoLegal';

export interface Params {
  paymentToken?: string;
  savePaymentMethodToken?: string;
  formType: 'card' | 'ach';
}

export const useConfidoLegal = (
  params: Params
): { state: HostedFieldsState | undefined } => {
  const [hostedFieldsState, setHostedFieldsState] =
    useState<HostedFieldsState>();

  useEffect(() => {
    const gl = window.gravityLegal;

    const listener = (e: ChangeEvent) => {
      const { state } = e;
      console.log('change', e);
      setHostedFieldsState(state);
    };

    gl.addChangeListener(listener);

    const fieldStyle = {
      border: 'none',
      color: 'rgb(26, 32, 44)',
      'font-family':
        '-apple-system, "system-ui", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      'font-weight': 400,
      height: '38px',
      width: '100%',
      'font-size': '16px',
    };

    gl.init({
      paymentToken: params.paymentToken,
      savePaymentMethodToken: params.savePaymentMethodToken,
      activeForm: params.formType,
      fields: {
        accountNumber: {
          containerId: 'account-number',
          style: fieldStyle,
        },
        accountHolderName: {
          containerId: 'account-holder-name',
          style: fieldStyle,
        },
        routingNumber: {
          containerId: 'routing-number',
          style: fieldStyle,
        },
        cardNumber: {
          containerId: 'card-number',
          style: fieldStyle,
        },
        cardExpirationDate: {
          containerId: 'card-exp',
          style: fieldStyle,
        },
        cardSecurityCode: {
          containerId: 'card-cvv',
          style: fieldStyle,
        },
      },
    });

    return () => gl.removeChangeListener(listener);
  }, [params.formType, params.paymentToken, params.savePaymentMethodToken]);

  return {
    state: hostedFieldsState,
  };
};
