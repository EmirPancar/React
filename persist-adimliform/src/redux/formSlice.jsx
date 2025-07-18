import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 1,
  isFormValid: false, 
  formData: {
    ad: "",
    soyad: "",
    email: "",
    tel: "",
    

    urunTipi: "",
    cihazModeli: "",
    seriNo: "",
    kullanimSuresi: "",

    
    sorunOzet: "",
    sorunDetay: "",
    dahaOnceSorun: "",
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateForm: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setFormValid: (state, action) => {
      state.isFormValid = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    prevStep: (state) => {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    resetForm: () => initialState,
  },
});

export const { updateForm, setFormValid, nextStep, prevStep, resetForm } = formSlice.actions;
export default formSlice.reducer;
