import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useSelector } from "react-redux";
import request from "@/services/request";

const User_View = () => {
  const selector = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const adminId = selector.user.adminId;

  const brokerOptions = [
    { value: "Kotak", label: "Kotak" },
    { value: "Jainam", label: "Jainam" },
  ];

  const formik = useFormik({
    initialValues: {
      userId: "",
      broker: null,
      name: "",
      email: "",
      phone: "",
      kotakDetails: {
        api_key: "",
        mpin: "",
        api_password: "",
        password: "",
        app_id: "",
        ip_address: "",
        api_secret: "",
        client_id: "",
        google_client_id: "",
      },
      jainamDetails: {
        client_id: "",
        api_key: "",
        secret_key: "",
      },
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone is required").length(10),
      broker: Yup.object().required("Broker is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess(false);

      try {
        const payload = { ...values, broker: values.broker.value };
        const url = values.userId
          ? `api/user/update_user`
          : `api/user/create_user`;
        const method = values.userId ? "put" : "post";
        payload.phone = "+91" + payload.phone;
        const response = await request[method](url, payload);
        if (response.status === 200) {
          setSuccess(true);
          setIsEditable(false);
          setTimeout(() => setSuccess(false), 5000);
          if (!values.userId) formik.resetForm();
        } else {
          setError("An error occurred while saving the user");
        }
      } catch (err) {
        console.log(err);
        setError(
          err.response?.data?.message ||
            "An error occurred while saving the user"
        );
      }

      setLoading(false);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = new URLSearchParams(window.location.search).get("userId");
      if (!userId) return;

      try {
        const response = await request.get(
          `/api/user/find_user?userId=${userId}`
        );
        if (response.status === 200) {
          const data = response.data.user;
          formik.setValues({
            userId: data.userId,
            broker: brokerOptions.find((opt) => opt.value === data.broker),
            name: data.name,
            email: data.email,
            phone: data.phone,
            kotakDetails: data.kotakDetails || {},
          });
        }
      } catch (err) {
        setError("Failed to fetch user data");
      }
    };
    fetchData();
  }, [adminId]);

  const selectedBroker = formik.values.broker?.value;

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">
          {formik.values.userId ? "Update User" : "Add User"}
        </h3>
        {formik.values.userId && (
          <button
            className="btn btn-secondary"
            onClick={() => setIsEditable(!isEditable)}
          >
            {isEditable ? "Cancel Update" : "Update"}
          </button>
        )}
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="card-body grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {error && (
          <div className="text-red-500 text-sm col-span-3">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm col-span-3">
            {formik.values.userId
              ? "User updated successfully!"
              : "User created successfully!"}
          </div>
        )}

        <div>
          <label className="form-label block mb-1">Name</label>
          <input
            className="input w-full"
            type="text"
            autoComplete="off"
            {...formik.getFieldProps("name")}
            placeholder="Full Name"
            disabled={formik.values.userId && !isEditable}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>

        <div>
          <label className="form-label block mb-1">Email</label>
          <input
            className="input w-full"
            type="email"
            autoComplete="off"
            {...formik.getFieldProps("email")}
            placeholder="Email Address"
            disabled={formik.values.userId && !isEditable}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label className="form-label block mb-1">Phone</label>
          <input
            className="input w-full"
            type="number"
            autoComplete="off"
            {...formik.getFieldProps("phone")}
            placeholder="Phone Number"
            disabled={formik.values.userId && !isEditable}
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-500 text-sm">{formik.errors.phone}</div>
          ) : null}
        </div>

        <div>
          <label className="form-label block mb-1">Broker</label>
          <Select
            options={brokerOptions}
            value={formik.values.broker}
            onChange={(value) => formik.setFieldValue("broker", value)}
            placeholder="Select Broker"
            className="react-select"
            classNamePrefix="dropdown"
            isDisabled={formik.values.userId && !isEditable}
          />
          {formik.touched.broker && formik.errors.broker ? (
            <div className="text-red-500 text-sm">{formik.errors.broker}</div>
          ) : null}
        </div>

        {selectedBroker === "Kotak" ? (
          <>
            {Object.keys(formik.values.kotakDetails).map((key) => (
              <div key={key}>
                <label className="form-label block mb-1">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  className="input w-full"
                  type="text"
                  autoComplete="off"
                  value={formik.values.kotakDetails[key]}
                  onChange={(e) =>
                    formik.setFieldValue(`kotakDetails.${key}`, e.target.value)
                  }
                  placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  disabled={formik.values.userId && !isEditable}
                />
              </div>
            ))}
          </>
        ) : selectedBroker === "Jainam" ? (
          <>
            {Object.keys(formik.values.jainamDetails).map((key) => (
              <div key={key}>
                <label className="form-label block mb-1">
                  {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </label>
                <input
                  className="input w-full"
                  type="text"
                  autoComplete="off"
                  value={formik.values.jainamDetails[key]}
                  onChange={(e) =>
                    formik.setFieldValue(`jainamDetails.${key}`, e.target.value)
                  }
                  placeholder={`Enter ${key.replace(/_/g, " ")}`}
                  disabled={formik.values.userId && !isEditable}
                />
              </div>
            ))}
          </>
        ) : null}

        <div className="col-span-3 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || (formik.values.userId && !isEditable)}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { User_View };
