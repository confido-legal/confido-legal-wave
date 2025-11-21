import { useEffect, useMemo, useState } from 'react';
import { ChangeEvent, HostedFieldsState } from './ConfidoLegal';

export interface Params {
  formType: 'card' | 'ach';
  paymentToken?: string;
  savePaymentMethodToken?: string;
  surchargingOptions?: {
    principalAmount?: number;
    surchargeRegion?: string;
  };
}

type UseConfidoLegalReturn = {
  state: HostedFieldsState | undefined;
  hf: typeof window.gravityLegal;
};

export const useConfidoLegal = (params: Params): UseConfidoLegalReturn => {
  const memoizedParams = useMemo(
    () => ({
      formType: params.formType,
      paymentToken: params.paymentToken,
      savePaymentMethodToken: params.savePaymentMethodToken,
      surchargingOptions: {
        principalAmount: params.surchargingOptions?.principalAmount,
        surchargeRegion: params.surchargingOptions?.surchargeRegion,
      },
    }),
    [
      params.formType,
      params.paymentToken,
      params.savePaymentMethodToken,
      params.surchargingOptions?.principalAmount,
      params.surchargingOptions?.surchargeRegion,
    ]
  );

  const [hostedFieldsState, setHostedFieldsState] =
    useState<HostedFieldsState>();

  useEffect(() => {
    const hf = window.gravityLegal;

    const listener = (e: ChangeEvent) => {
      const { state } = e;
      console.log('change', e);
      setHostedFieldsState(state);
    };

    hf.addChangeListener(listener);

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

    hf.init({
      paymentToken: memoizedParams.paymentToken,
      savePaymentMethodToken: memoizedParams.savePaymentMethodToken,
      activeForm: memoizedParams.formType,
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
      surchargingOptions: memoizedParams.surchargingOptions,
    });

    return () => hf.removeChangeListener(listener);
  }, [memoizedParams]);

  return {
    hf: window.gravityLegal,
    state: hostedFieldsState,
  };
};
