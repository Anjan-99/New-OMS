import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { link } from "@/config";
import { KeenIcon } from "@/components";
import { useSelector } from "react-redux";
import request from "@/services/request";

const Access_create = () => {
  const selector = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const roleOptions = [
    { value: "ProfitFolio", label: "ProfitFolio" },
    { value: "DataEdge", label: "DataEdge" },
    { value: "Employee", label: "Employee" },
    { value: "Viewer", label: "Viewer" },
  ];
  const adminId = selector.user.adminId;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await request.get(
          `/api/user/getall_users?adminId=${adminId}`
        );
        const userOptions = response.data.users.map((user) => ({
          value: user.userId,
          label: user.name,
        }));
        setUsers(userOptions);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching users"
        );
      }
    };
    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      role: null,
      user: [],
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string().required("Username is Required"),
      password: Yup.string().required("Password is required"),
      role: Yup.object().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess(false);
      try {
        const payload = {
          username: values.username,
          email: values.email,
          password: values.password,
          role: values.role.value,
          users:
            values.role.value === "ProfitFolio" ||
            values.role.value === "DataEdge"
              ? []
              : values.user.map((user) => ({ userId: user.value })),
        };

        const response = await request.post(
          `/api/auth/register`,
          payload
        );

        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
          formik.resetForm();
        } else {
          setError("An error occurred while creating admin");
        }
      } catch (err) {
        console.log(err);
        setError(
          err.response?.data?.message ||
            "An error occurred while creating admin"
        );
      }
      setLoading(false);
    },
  });

  const selectedRole = formik.values.role?.value;

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Add Admin</h3>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="card-body grid gap-5 pt-7.5"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm">
            Profile updated successfully!
          </div>
        )}

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Email</label>
            <div className="flex flex-col items-start grow">
              <input
                className="input"
                type="email"
                autoComplete="off"
                {...formik.getFieldProps("email")}
                placeholder="Email address"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Username</label>
            <div className="flex flex-col items-start grow ">
              <input
                className="input"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("username")}
                placeholder="Username"
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.username}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-2.5">
            <label className="form-label max-w-56">Password</label>
            <div className="relative w-full">
              <div>
                <input
                  className="input w-full pr-10"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="off"
                  {...formik.getFieldProps("password")}
                  placeholder="Enter password"
                />
                <KeenIcon
                  icon={showCurrent ? "eye-slash" : "eye"}
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-4.5 transform -translate-y-1/2 cursor-pointer"
                />
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Role</label>
          <div className="grow">
            <div className="block ">
              <Select
                options={roleOptions}
                value={formik.values.role}
                onChange={(value) => formik.setFieldValue("role", value)}
                placeholder="Select role"
                className="react-select"
                classNamePrefix="dropdown"
              />
            </div>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            ) : null}
          </div>
        </div>

        {selectedRole !== "ProfitFolio" && selectedRole !== "DataEdge" && (
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">User</label>
            <div className="grow">
              <Select
                options={users}
                isMulti
                value={formik.values.user}
                onChange={(value) => formik.setFieldValue("user", value)}
                placeholder="Select user"
                className="react-select"
                classNamePrefix="dropdown"
              />
              {formik.touched.user && formik.errors.user ? (
                <div className="text-red-500 text-sm">{formik.errors.user}</div>
              ) : null}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Add Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { Access_create };
