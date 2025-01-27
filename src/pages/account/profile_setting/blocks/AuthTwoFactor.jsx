import React, { useState } from "react";
import QRCode from "react-qr-code"; // Import QR Code library
import { KeenIcon } from "@/components";
import { CommonHexagonBadge } from "@/partials/common";
import { useSelector } from "react-redux";
import request from "@/services/request";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/userSlice";

const AuthTwoFactor = () => {
  const selector = useSelector((state) => state.auth);
  const adminId = selector.user.adminId;
  
  const [password, setPassword] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTotpEnabled, setIsTotpEnabled] = useState(selector.user.twofaEnabled);
  const dispatch = useDispatch();

  const items = [
    {
      icon: "shield-tick",
      title: "Authenticator App (TOTP)",
      description:
        "Elevate protection with an authenticator app for two-factor authentication.",
      checkbox: isTotpEnabled,
    },
  ];

  const renderItem = (item, index) => (
    <div
      key={index}
      className="flex items-center justify-between flex-wrap border border-gray-200 rounded-xl gap-2 px-3.5 py-2.5"
    >
      <div className="flex items-center flex-wrap gap-3.5">
        <div className="flex items-center">
          <CommonHexagonBadge
            stroke="stroke-gray-300"
            fill="fill-gray-100"
            size="size-[50px]"
            badge={
              <KeenIcon icon={item.icon} className="text-xl text-gray-500" />
            }
          />
        </div>
        <div className="flex flex-col gap-px">
          <a
            href="#"
            className="text-sm font-medium text-gray-900 hover:text-primary-active"
          >
            {item.title}
          </a>
          <span className="text-2sm font-medium text-gray-700">
            {item.description}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-6">
        <label className="switch switch-sm">
          <input
            type="checkbox"
            checked={item.checkbox}
            onChange={(e) => setIsTotpEnabled(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );

  const handleSetup2FA = async () => {
    setQrCodeUrl("");
    if (!password) {
      setError("Please enter your password.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    setLoading(true);
    try {
      const response = await request.post(`/api/auth/update2fa`, {
        adminId: adminId,
        password,
        twofa: isTotpEnabled,
      });
      if (response.data && response.data.twofa) {
        setQrCodeUrl(response.data.twofa); // Save the URL for QR code generation
        setSuccess("Two-Factor Authentication is Enabled.");
      } else if (response.data.disabled === true) {
        setSuccess("Two-Factor Authentication is Disabled.");
      }
      setTimeout(() => {
        setSuccess("");
      }, 2000);
      dispatch(
        updateUser({
          ...selector,
          twofaEnabled: isTotpEnabled,
        })
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while setting up 2FA."
      );
      setTimeout(() => {
        setError("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg rounded-lg">
      <div className="card-header" id="auth_two_factor">
        <h3 className="card-title">Two-Factor Authentication (2FA)</h3>
      </div>

      <div className="card-body">
        <div className="grid gap-5 mb-7">
          {items.map((item, index) => renderItem(item, index))}
        </div>

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5 mb-7">
            <label className="form-label max-w-56">Password</label>

            <div className="flex flex-col items-start grow gap-3 w-full">
              <input
                className="input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="form-info gray-800 font-normal">
                Enter your password to set up Two-Factor Authentication
              </span>
            </div>
          </div>
        </div>
        {success && <div className="text-green-500 text-sm">{success}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {qrCodeUrl && (
          <div className="flex justify-center mb-4">
            <div style={{ padding: "5px", backgroundColor: "white" }}>
              <QRCode value={qrCodeUrl} />
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2.5">
          <button
            className="btn btn-primary"
            onClick={handleSetup2FA}
            disabled={loading}
          >
            {loading ? "Setting Up..." : "Setup"}
          </button>
        </div>
      </div>
    </div>
  );
};

export { AuthTwoFactor };
