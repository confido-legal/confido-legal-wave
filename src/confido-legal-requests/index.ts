import { completeSavePaymentMethod } from './completeSavePaymentMethod';
import { createFirm } from './createFirm';
import { createFirmSignUpLink } from './createFirmSignUpLink';
import { createSavePaymentMethodToken } from './createSavePaymentMethodToken';
import { disconnect } from './disconnect';
import { exchangeCodeForFirmToken } from './exchangeCodeForFirmToken';
import { getFirm } from './getFirm';
import { getMyPartner } from './getMyPartner';
import { runPayment } from './runPayment';

export * from './completeSavePaymentMethod';
export * from './createFirm';
export * from './createFirmSignUpLink';
export * from './createSavePaymentMethodToken';
export * from './disconnect';
export * from './exchangeCodeForFirmToken';
export * from './getFirm';
export * from './getMyPartner';
export * from './runPayment';

export const gqlEndpoint =
  process.env.GL_API_ENDPOINT ?? 'https://api.sandbox.gravity-legal.com/v2';

export default {
  completeSavePaymentMethod,
  createFirm,
  createFirmSignUpLink,
  createSavePaymentMethodToken,
  disconnect,
  exchangeCodeForFirmToken,
  getFirm,
  getMyPartner,
  runPayment,
};
