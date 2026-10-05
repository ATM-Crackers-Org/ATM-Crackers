import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DeliveryMethod, CheckoutPreviewData } from "@/types/order";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  deliveryOption: DeliveryMethod;
  paymentMethod: "MANUAL";
  promoCode: string;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
}

export interface CheckoutState {
  formData: CheckoutFormData;
  appliedCoupon: AppliedCoupon | null;
  previewTotals: CheckoutPreviewData | null;
  isApplyingCoupon: boolean;
  couponError: string;
}

const initialFormData: CheckoutFormData = {
  fullName: "",
  phone: "",
  email: "",
  streetAddress: "",
  city: "",
  state: "Tamil Nadu",
  pincode: "",
  landmark: "",
  deliveryOption: "STANDARD",
  paymentMethod: "MANUAL",
  promoCode: "",
};

const initialState: CheckoutState = {
  formData: initialFormData,
  appliedCoupon: null,
  previewTotals: null,
  isApplyingCoupon: false,
  couponError: "",
};

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{
        field: keyof CheckoutFormData;
        value: CheckoutFormData[keyof CheckoutFormData];
      }>
    ) => {
      (state.formData as Record<keyof CheckoutFormData, any>)[
        action.payload.field
      ] = action.payload.value;
    },
    updateForm: (
      state,
      action: PayloadAction<Partial<CheckoutFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setAppliedCoupon: (state, action: PayloadAction<AppliedCoupon | null>) => {
      state.appliedCoupon = action.payload;
    },
    removeAppliedCoupon: (state) => {
      state.appliedCoupon = null;
      state.previewTotals = null;
      state.couponError = "";
      state.formData.promoCode = "";
    },
    setPreviewTotals: (
      state,
      action: PayloadAction<CheckoutPreviewData | null>
    ) => {
      state.previewTotals = action.payload;
    },
    setIsApplyingCoupon: (state, action: PayloadAction<boolean>) => {
      state.isApplyingCoupon = action.payload;
    },
    setCouponError: (state, action: PayloadAction<string>) => {
      state.couponError = action.payload;
    },
    resetCheckout: (state) => {
      state.formData = initialFormData;
      state.appliedCoupon = null;
      state.previewTotals = null;
      state.isApplyingCoupon = false;
      state.couponError = "";
    },
  },
});

export const {
  updateFormField,
  updateForm,
  setAppliedCoupon,
  removeAppliedCoupon,
  setPreviewTotals,
  setIsApplyingCoupon,
  setCouponError,
  resetCheckout,
} = checkoutSlice.actions;

export const selectCheckoutForm = (state: { checkout: CheckoutState }) =>
  state.checkout.formData;
export const selectAppliedCoupon = (state: { checkout: CheckoutState }) =>
  state.checkout.appliedCoupon;
export const selectPreviewTotals = (state: { checkout: CheckoutState }) =>
  state.checkout.previewTotals;
export const selectIsApplyingCoupon = (state: { checkout: CheckoutState }) =>
  state.checkout.isApplyingCoupon;
export const selectCouponError = (state: { checkout: CheckoutState }) =>
  state.checkout.couponError;

export default checkoutSlice.reducer;
