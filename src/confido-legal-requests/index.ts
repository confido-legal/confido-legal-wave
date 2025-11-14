import { completeSavePaymentMethod } from './completeSavePaymentMethod';
import { createFirm } from './createFirm';
import { createFirmSignUpLink } from './createFirmSignUpLink';
import { createSavePaymentMethodToken } from './createSavePaymentMethodToken';
import { disconnect } from './disconnect';
import { exchangeCodeForFirmToken } from './exchangeCodeForFirmToken';
import { getFirm } from './getFirm';
import { getMyPartner } from './getMyPartner';
import { payRequestList } from './payRequestList';
import { paymentSessionComplete } from './paymentSessionComplete';

export * from './completeSavePaymentMethod';
export * from './createFirm';
export * from './createFirmSignUpLink';
export * from './createSavePaymentMethodToken';
export * from './disconnect';
export * from './exchangeCodeForFirmToken';
export * from './getFirm';
export * from './getMyPartner';
export * from './payRequestList';

export const gqlEndpoint =
  process.env.CONFIDO_API_ENDPOINT ??
  'https://api.sandbox.gravity-legal.com/v2';

const methods = {
  completeSavePaymentMethod,
  createFirm,
  createFirmSignUpLink,
  createSavePaymentMethodToken,
  disconnect,
  exchangeCodeForFirmToken,
  getFirm,
  getMyPartner,
  payRequestList,
  paymentSessionComplete,
};

export default methods;
