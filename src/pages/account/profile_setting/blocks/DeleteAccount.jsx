import React, { useState } from "react";
import { useSelector } from "react-redux";
import request from "@/services/request";

const DeleteAccount = () => {
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId;
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleDeleteAccount = async () => {
    if (!isChecked) {
      setError("Please confirm account deletion.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await request.post(
        `/api/auth/delete_admin`,
        { adminId: adminId }
      );
      if (response.status === 200) {
        setSuccess("Account successfully deleted.");
        window.location.href = "/auth/login";
      }
    } catch (error) {
      setError("Error deleting account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg rounded-lg">
      <div className="card-header" id="delete_account">
        <h3 className="card-title">Delete Account</h3>
      </div>
      <div className="card-body flex flex-col lg:py-7.5 lg:gap-7.5 gap-3">
        <div className="flex flex-col gap-5">
          <div className="text-2sm text-gray-800">
            Deleting your account will permanently remove all your data. This
            action cannot be undone. Please confirm if you still wish to
            continue.
          </div>

          <label className="checkbox-group">
            <input
              className="checkbox checkbox-sm"
              name="delete"
              type="checkbox"
              value="1"
              onChange={handleCheckboxChange}
            />
            <span className="checkbox-label">Confirm deleting account</span>
          </label>
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <div className="flex justify-end gap-2.5">
          <button
            className="btn btn-danger"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DeleteAccount };
