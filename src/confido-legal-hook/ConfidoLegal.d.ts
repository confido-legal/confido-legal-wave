declare global {
  interface Window {
    gravityLegal: {
      addChangeListener: (cb: OnChangeCb) => void;
      getState: () => HostedFieldsState;
      init: (options: Options) => void;
      removeChangeListener: (cb: OnChangeCb) => void;
      setActiveForm: (form: FormType) => void;
      submitFields: () => Promise<SubmitFieldsResult>;
    };
    confidoOnboarding: {
      refresh: () => void;
      renderForm: (opts: RenderOptions) => void;
      renderOwnerForm: (opts: RenderOwnerOptions) => void;
    };
  }
}

export type RenderOptions = {
  containerId: string;
  disableOwnerInvite?: boolean;
  onChange?: OnChangeCb;
  readOnly?: boolean;
  ownerInviteUrl?: string;
  style?: ConfidoStyleOptions;
  token: string;
};

export type RenderOwnerOptions = {
  code: string;
  containerId: string;
  onChange?: (e: OnboardingChangeEvent) => void;
  style?: ConfidoStyleOptions;
};

export interface ChangeEvent {
  type: ChangeType;
  state: HostedFieldsState;
}

export type OnChangeCb = (e: ChangeEvent) => void;

type FormType = 'card' | 'ach';

type PaymentMethod = 'CREDIT' | 'DEBIT' | 'ACH';

interface CardData {
  bin: string;
  cardType: string;
  brand: string;
}

interface FieldState {
  containerId: string;
  loading: boolean;
  error: FieldError | null;
}

interface FieldError {
  message: string;
}

interface FieldConfig {
  containerId: string;
  style?: any;
}

interface Options {
  paymentToken?: string;
  savePaymentMethodToken?: string;
  activeForm: FormType;
  fields: {
    cardNumber?: FieldConfig;
    cardExpirationDate?: FieldConfig;
    cardSecurityCode?: FieldConfig;
    accountNumber?: FieldConfig;
    routingNumber?: FieldConfig;
    accountHolderName?: FieldConfig;
  };
}

export interface HostedFieldsState {
  activeForm: FormType;
  cardData?: CardData;
  fields: {
    cardNumber?: FieldState;
    cardExpirationDate?: FieldState;
    cardSecurityCode?: FieldState;
    accountNumber?: FieldState;
    routingNumber?: FieldState;
    accountHolderName?: FieldState;
  };
  loading: boolean;
  loadError?: Error;
  paymentLink?: any;
  paymentProcessing: boolean;
  paymentMethod?: PaymentMethod;
  surcharging: {
    active: boolean;
    willBeApplied: boolean;
    rate?: number;
  };
}

export interface GravityLegalHook {
  state: HostedFieldsState;
}

export interface SubmitFieldsResult {
  error?: Error;
  success: boolean;
}
