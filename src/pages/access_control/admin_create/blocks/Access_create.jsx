import { useState } from "react";
import axios from "axios";
import { link } from "@/config";
import Select from "react-select";
const initialData = {
  email: "",
  username: "",
};

const Access_create = () => {
  const [emailInput, setEmailInput] = useState(initialData.email);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(initialData.username);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const options = [
    { value: "ProfitFolio", label: "ProfitFolio" },
    { value: "DataEdge", label: "DataEdge" },
    { value: "Employee", label: "Employee" },
    { value: "Viewer", label: "Viewer" },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    if (initialData.email === emailInput && initialData.username === userName) {
      setLoading(false);
      setError("No changes detected");
      return;
    }
    try {
      const response = await axios.put(
        `${link.backendLink}/api/auth/update_admin`,
        {
          adminId: "76b40fc2-0adb-48c1-acee-db63880e3c83",
          email: emailInput,
          username: userName,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while updating your profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Add Admin</h3>
      </div>
      <form onSubmit={handleSubmit} className="card-body grid gap-5 pt-7.5">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm">
            Profile updated successfully!
          </div>
        )}

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Email</label>
            <div className="flex flex-col items-start grow gap-7.5 w-full">
              <input
                className="input"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                placeholder="Email address"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Username</label>
            <div className="flex flex-col items-start grow gap-7.5 w-full">
              <input
                className="input"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                placeholder="Username"
              />
            </div>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Role</label>
          <div className="grow block dark:hidden">
            <Select
              options={options}
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              placeholder="Select role"
              className="react-select"
              classNamePrefix="dropdown"
            />
          </div>
          <div className="grow hidden dark:block">
            <Select
              options={options}
              isMulti
              value={selectedOptions}
              onChange={handleChange}
              placeholder="Select role"
              className="react-select dark"
              classNamePrefix="dropdown"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { Access_create };
