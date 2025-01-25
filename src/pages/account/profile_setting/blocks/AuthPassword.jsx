import React, { useState } from "react";
import { KeenIcon } from "@/components";
import { useSelector } from "react-redux";
import request from "@/services/request";

const AuthPassword = () => {
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setLoading(true);
    try {
      const response = await request.put(
        `/api/auth/update_password`,
        {
          adminId: adminId,
          password: currentPassword,
          newPassword: newPassword,
        }
      );
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while updating your profile"
      );
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg rounded-lg">
      <div className="card-header" id="auth_password">
        <h3 className="card-title">Password</h3>
      </div>

      <div className="card-body grid gap-5">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm">
            Password updated successfully!
          </div>
        )}
        <form onSubmit={handleResetPassword} className="grid gap-5 pt-7.5">
          <div className="w-full">
            <div className="flex items-center gap-2.5">
              <label className="form-label max-w-56">Current Password</label>
              <div className="relative w-full">
                <input
                  className="input w-full pr-10"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <KeenIcon
                  icon={showCurrent ? "eye-slash" : "eye"}
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2.5">
              <label className="form-label max-w-56">New Password</label>
              <div className="relative w-full">
                <input
                  className="input w-full pr-10"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <KeenIcon
                  icon={showNew ? "eye-slash" : "eye"}
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2.5">
              <label className="form-label max-w-56">Confirm New Password</label>
              <div className="relative w-full">
                <input
                  className="input w-full pr-10"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <KeenIcon
                  icon={showConfirm ? "eye-slash" : "eye"}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2.5">
            <button type="submit" className="btn btn-primary">
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AuthPassword };
