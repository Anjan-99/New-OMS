import request from "../request";

// LOGIN API
export const loginAPI = async (data) => {
  try {
    const res = await request.post(`/api/auth/login`, data);
    // console.log(res.data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// REGISTRATION API
export const registrationAPI = async (data) => {
  try {
    const res = await request.post(`/auth/register`, data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// SEND OTP TO EMAIL API
export const sendOtpToEmailAPI = async (data) => {
  try {
    const res = await request.patch(`/auth/email/resend`, data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// VERIFY OTP API
export const verifyOtpAPI = async (data) => {
  try {
    const res = await request.patch(`/auth/email/verify`, data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// CHANGE PASSWORD API
export const changePasswordAPI = async (data) => {
  try {
    const res = await request.put(`/auth/forgot/password`, data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// UPDATE PASSWORD API
export const updatePasswordAPI = async (data) => {
  try {
    const res = await request.put(`/auth/update/password`, data);
    return await res.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

