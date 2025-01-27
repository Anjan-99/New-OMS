import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { KeenIcon } from "@/components";
import { useSelector } from "react-redux";
import request from "@/services/request";

const Admin_Update = () => {
  const selector = useSelector((state) => state.auth);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [adminDetails, setAdminDetails] = useState(null);

  const adminId = selector.user.adminId; // Assuming this comes from the Redux state

  // Fetch users when adminId is selected or changed
  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminId) return; // Don't fetch users if adminId is not set
      try {
        const response = await request.get(
          `/api/user/get_users?adminId=${adminId}`
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
  }, [adminId]);

  // Fetch admins and select the one from the URL or selector
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await request.get(`api/auth/get_admins`);
        const adminOptions = response.data.admins.map((admin) => ({
          value: admin.adminId,
          label: admin.username,
        }));
        setAdmins(adminOptions);

        // If adminId is in the URL or from selector, select it
        const selectedAdminFromURL = new URLSearchParams(
          window.location.search
        ).get("adminId");
        const initialAdmin = selectedAdminFromURL || adminId;
        setSelectedAdmin(initialAdmin);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching admins"
        );
      }
    };
    fetchAdmins();
  }, [adminId]);

  // Fetch admin details when selectedAdmin changes
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!selectedAdmin) return; // Don't fetch if selectedAdmin is not set
      try {
        const response = await request.get(
          `/api/auth/get_admin?adminId=${selectedAdmin}`
        );
        const adminData = response.data.admin;

        // Set admin details in state
        setAdminDetails(adminData);

        // Set formik values
        formik.setValues({
          email: adminData.email,
          username: adminData.username,
          role: { value: adminData.role, label: adminData.role },
          user: adminData.users.map((user) => ({
            value: user.userId,
            label:
              users.find((u) => u.value === user.userId)?.label || user.userId,
          })),
        });
      } catch (err) {
        setError("Failed to fetch admin details");
      }
    };
    fetchAdminDetails();
  }, [selectedAdmin, users]); // Dependencies: re-fetch when selectedAdmin or users change

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      role: null,
      user: [],
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string().required("Username is Required"),
      role: Yup.object().required("Role is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess(false);
      try {
        if (
          values.role.value !== "ProfitFolio" &&
          values.role.value !== "DataEdge"
        ) {
          console.log(values.user.length);
          if (values.user.length === 0) {
            setError("Select at least one user");
            setLoading(false);
            return;
          }
        }
        const payload = {
          adminId: selectedAdmin,
          username: values.username,
          email: values.email,
          role: values.role.value,
          users:
            values.role.value === "ProfitFolio" ||
            values.role.value === "DataEdge"
              ? []
              : values.user.map((user) => ({ userId: user.value })),
        };

        const response = await request.put(
          `/api/auth/update_other_admin`,
          payload
        );
        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        } else {
          setError("An error occurred while updating admin");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while updating admin"
        );
      }
      setLoading(false);
    },
  });

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Update Admin</h3>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="card-body grid gap-5 pt-7.5"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm">
            Admin updated successfully!
          </div>
        )}

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Select Admin</label>
            <div className="flex flex-col items-start grow">
              <Select
                options={admins}
                value={
                  selectedAdmin
                    ? { value: selectedAdmin, label: selectedAdmin }
                    : null
                }
                onChange={(value) => {
                  setSelectedAdmin(value?.value);
                  formik.setFieldValue("role", null); // Reset the role when admin is selected
                }}
                placeholder="Select Admin"
                className="react-select"
                classNamePrefix="dropdown"
              />
            </div>
          </div>
        </div>

        {selectedAdmin && adminDetails && (
          <>
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

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Role</label>
              <div className="grow">
                <div className="block ">
                  <Select
                    options={[
                      { value: "ProfitFolio", label: "ProfitFolio" },
                      { value: "DataEdge", label: "DataEdge" },
                      { value: "Employee", label: "Employee" },
                      { value: "Viewer", label: "Viewer" },
                    ]}
                    value={formik.values.role}
                    onChange={(value) => formik.setFieldValue("role", value)}
                    placeholder="Select role"
                    className="react-select"
                    classNamePrefix="dropdown"
                  />
                </div>
                {formik.touched.role && formik.errors.role ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.role}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <label className="form-label max-w-56">Users</label>
              <div className="grow">
                <Select
                  options={users}
                  isMulti
                  value={formik.values.user}
                  onChange={(value) => formik.setFieldValue("user", value)}
                  placeholder="Select users"
                  className="react-select"
                  classNamePrefix="dropdown"
                />
                {formik.touched.user && formik.errors.user ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.user}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Update Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { Admin_Update };
