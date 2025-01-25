import { useState } from "react";
import { useSelector } from "react-redux";
import request from "@/services/request";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/userSlice";

const AuthEmail = () => {
  const selector = useSelector((state) => state.auth.user);
  const initialData = {
    email: selector.email,
    username: selector.username,
  };
  const [emailInput, setEmailInput] = useState(initialData.email);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(initialData.username);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

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
      const response = await request.put(`/api/auth/update_admin`, {
        adminId: selector?.adminId,
        email: emailInput,
        username: userName,
      });
      if (response.status === 200) {
        setSuccess(true);
        // Update the user in the redux store
        dispatch(
          updateUser({
            ...selector,
            email: emailInput, // Update specific fields
            username: userName,
          })
        );
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
    <div className="card pb-2.5 shadow-lg rounded-lg">
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Email</h3>
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
              />
            </div>
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

export { AuthEmail };
