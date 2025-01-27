import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toAbsoluteUrl } from "@/utils";
import { KeenIcon } from "@/components";
import { setUserDetails } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { verifyOtpAPI } from "../../../services/api/auth.api";
import { toast } from "sonner";

const TwoFactorAuth = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email; // Access email passed from the login page
  const token = location?.state?.token; // Access token passed from the login page
  const [otp, setOtp] = useState();
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    onSubmit: async (values) => {
      if (values.otp.length !== 6) {
        setError("Please enter a valid OTP");
        return;
      }
      try {
        setLoading(true);
        // Join the otp array into a single string
        const otpString = values.otp.join(""); // Convert OTP array to a single string
        const response = await verifyOtpAPI({ email: email, otp: otpString });
        if (response.verified) {
          console.log(response);
          const data = {
            user: response.admin,
            token: token,
          };
          dispatch(setUserDetails(data));
          toast.success("OTP verified successfully!");
          navigate("/dashboard");
        } else {
          setTimeout(() => {
            setError("Invalid OTP. Please try again.");
          }, 500);
        }
      } catch (error) {
        setTimeout(() => {
          setError(
            error.response.data.message ||
              "An error occurred while verifying OTP"
          );
        }, 500);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Handle backspace
    if (e.key === "Backspace" && formik.values.otp[index] === "") {
      // Focus the previous input field
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }
    } else if (/^\d$/.test(value) || value === "") {
      // Update the OTP field as an array of digits
      const updatedOtp = [...formik.values.otp];
      updatedOtp[index] = value; // Make sure the value is a string

      // Set the updated OTP array
      formik.setFieldValue("otp", updatedOtp);

      // If the value is not empty and we're not at the last input, move to the next field
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div className="card max-w-[380px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
      >
        <img
          src={toAbsoluteUrl("/media/illustrations/34.svg")}
          className="dark:hidden h-20 mb-2"
          alt=""
        />
        <img
          src={toAbsoluteUrl("/media/illustrations/34-dark.svg")}
          className="light:hidden h-20 mb-2"
          alt=""
        />
        <div className="text-center mb-2">
          <h3 className="text-lg font-medium text-gray-900 mb-5">
            Verify your phone
          </h3>
          <div className="flex flex-col">
            <span className="text-2sm text-gray-700 mb-1.5">
              Enter the verification code from Authenticator app
            </span>
            <a href="#" className="text-sm font-medium text-gray-900">
              {email}
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-2.5">
          {/* Render 6 input fields for the OTP */}
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength={1}
              className={`input focus:border-primary-clarity focus:ring focus:ring-primary-clarity size-10 shrink-0 px-0 text-center ${
                formik.touched.otp && formik.errors.otp ? "border-red-500" : ""
              }`}
              value={formik.values.otp[index] || ""}
              onChange={(e) => handleInputChange(e, index)}
              onFocus={(e) => e.target.select()} // Select the value when focused
              onKeyDown={(e) => handleInputChange(e, index)} // Handle backspace and other key events
            />
          ))}
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          className={`btn btn-primary flex justify-center grow ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

        <Link
          to="/"
          className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
        >
          <KeenIcon icon="black-left" />
          Back to Login
        </Link>
      </form>
    </div>
  );
};

export { TwoFactorAuth };
