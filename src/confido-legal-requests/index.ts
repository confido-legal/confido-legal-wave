import { completeSavePaymentMethod } from "./completeSavePaymentMethod";
import { createFirm } from "./createFirm";
import { createFirmSignUpLink } from "./createFirmSignUpLink";
import { createSavePaymentMethodToken } from "./createSavePaymentMethodToken";
import { deactivateStoredPaymentMethod } from "./deactivateStoredPaymentMethod";
import { disconnect } from "./disconnect";
import { exchangeCodeForFirmToken } from "./exchangeCodeForFirmToken";
import { getFirm } from "./getFirm";
import { getMyPartner } from "./getMyPartner";
import { getStoredPaymentMethods } from "./getStoredPaymentMethods";
import { payRequestList } from "./payRequestList";
import { paymentSessionComplete } from "./paymentSessionComplete";
import { reactivateStoredPaymentMethod } from "./reactivateStoredPaymentMethod";

export * from "./completeSavePaymentMethod";
export * from "./createFirm";
export * from "./createFirmSignUpLink";
export * from "./createSavePaymentMethodToken";
export * from "./deactivateStoredPaymentMethod";
export * from "./disconnect";
export * from "./exchangeCodeForFirmToken";
export * from "./getFirm";
export * from "./getMyPartner";
export * from "./getStoredPaymentMethods";
export * from "./payRequestList";
export * from "./paymentSessionComplete";
export * from "./reactivateStoredPaymentMethod";

export const gqlEndpoint =
  process.env.GL_API_ENDPOINT ?? "https://api.sandbox.gravity-legal.com/v2";

export default {
  completeSavePaymentMethod,
  createFirm,
  createFirmSignUpLink,
  createSavePaymentMethodToken,
  deactivateStoredPaymentMethod,
  disconnect,
  exchangeCodeForFirmToken,
  getFirm,
  getMyPartner,
  getStoredPaymentMethods,
  payRequestList,
  paymentSessionComplete,
  reactivateStoredPaymentMethod,
};
