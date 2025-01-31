import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { KeenIcon } from "@/components";
import { useLayout } from "@/providers";
import { Alert } from "@/components";
/* REDUX IMPORT */
import { setUserDetails } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../../services/api/auth.api";
import { toast } from "sonner";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  remember: Yup.boolean(),
});
const initialValues = {
  email: "",
  password: "",
  remember: false,
};
const Login = () => {
  const router = useNavigate();

  /* GLOBAL VARIABLES */
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  const [colors, setColors] = useState({
    buy: "#00A261",
    sell: "#E42855",
    future: "#272A34",
    option: "#E42855",
    equity: "#883FFF",
    market: "#006AE6",
    limit: "#C59A00",
  });
  const storedColors = localStorage.getItem("tradingColors");
  useEffect(() => {
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    }
  }, []);
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const obj = {
        email: values.email,
        password: values.password,
      };
      // loginAPI({ bypass: true })
      loginAPI(obj)
        .then(async (res) => {
          if (res?.status) {
            localStorage.setItem("tradingColors", JSON.stringify(colors));
            if (res?.user?.twofaEnabled) {
              router("/2fa", {
                state: { email: values.email, token: res.token },
              });
            } else {
              dispatch(setUserDetails(res));
              toast.success("Login successful!");

              router("/dashboard");
            }
          } else {
            toast.error(res.message || "Login failed");
          }
        })
        .catch((e) => {
          if (e?.response?.status === 402) {
            // setOtpDialog(true);
            toast.error(e?.response?.data?.message);
          } else if (e?.response?.status === 409) {
            toast.error("Password is incorrect");
          } else if (e?.message === "Network Error") {
            toast.error(e?.message);
          } else {
            console.log(e);
            toast.error(e?.response?.data?.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  return (
    <div className="card max-w-[390px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Sign in
          </h3>
          {/* <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">
              Need an account?
            </span>
            <Link
              to={
                currentLayout?.name === "auth-branded"
                  ? "/auth/signup"
                  : "/auth/classic/signup"
              }
              className="text-2sm link"
            >
              Sign up
            </Link>
          </div> */}
        </div>

        {/* <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div> */}

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              name="email"
              id="email"
              placeholder="Enter username"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.email && formik.errors.email,
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">Password</label>
            <Link
              to={
                currentLayout?.name === "auth-branded"
                  ? "/auth/reset-password"
                  : "/auth/classic/reset-password"
              }
              className="text-2sm link shrink-0"
            >
              Forgot Password?
            </Link>
          </div>
          <label className="input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.password && formik.errors.password,
              })}
              name="password"
              id="password"
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye"
                className={clsx("text-gray-500", {
                  hidden: showPassword,
                })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx("text-gray-500", {
                  hidden: !showPassword,
                })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        {/* <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps("remember")}
          />
          <span className="checkbox-label">Remember me</span>
        </label> */}

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};
export { Login };
