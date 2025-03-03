import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useSelector } from "react-redux";
import request from "@/services/request";
import { useNavigate } from "react-router";

const Group_update = () => {
  const selector = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [positions, setPositions] = useState({});
  const navigate = useNavigate();
  const adminId = selector.user.adminId;
  // take groupId from the URL
  const groupId = new URLSearchParams(window.location.search).get("groupId");
  useEffect(() => {
    const fetchUsers = async () => {
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

    const fetchGroupDetails = async () => {
      try {
        const response = await request.get(
          `/api/usergrp/get_group?groupId=${groupId}&adminId=${adminId}`
        );
        const group = response.data.group;

        formik.setValues({
          grp_name: group.grpname,
          user: group.clients.map((client) => ({
            value: client.userId,
            label: client.username,
          })),
        });
        const initialPositions = group.clients.reduce((acc, client) => {
          acc[client.userId] = client.position || "";
          return acc;
        }, {});
        setPositions(initialPositions);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching group details"
        );
      }
    };

    fetchUsers();
    fetchGroupDetails();
  }, [groupId]);

  const formik = useFormik({
    initialValues: {
      grp_name: "",
      user: [],
    },
    validationSchema: Yup.object({
      grp_name: Yup.string().required("Group Name is required"),
      user: Yup.array().min(1, "Select at least one user"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess(false);
      try {
        const payload = {
          adminId,
          groupId,
          grpname: values.grp_name,
          clients: values.user.map((user) => ({
            userId: user.value,
            username: user.label,
            position: positions[user.value] || "",
          })),
        };
        const response = await request.post(
          `api/usergrp/update_group`,
          payload
        );

        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
          setTimeout(() => navigate("/user/user_group"), 1000);
        } else {
          setError("An error occurred while updating group");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while updating group"
        );
      }
      setLoading(false);
    },
  });

  const handlePositionChange = (userId, value) => {
    setPositions((prev) => ({ ...prev, [userId]: value }));
  };

  return (
    <div className="card pb-2.5">
      <div className="card-header" id="auth_email">
        <h3 className="card-title">Update User Group</h3>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="card-body grid gap-5 pt-7.5"
      >
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && (
          <div className="text-green-500 text-sm">
            Group updated successfully!
          </div>
        )}

        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <label className="form-label max-w-56">Group Name</label>
            <div className="flex flex-col items-start grow ">
              <input
                className="input"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("grp_name")}
                placeholder="Group Name"
              />
              {formik.touched.grp_name && formik.errors.grp_name ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.grp_name}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <label className="form-label max-w-56">Users</label>
          <div className="grow">
            <Select
              options={users}
              isMulti
              value={formik.values.user}
              onChange={(value) => {
                formik.setFieldValue("user", value);
                const selectedIds = value.map((v) => v.value);
                setPositions((prev) =>
                  Object.fromEntries(
                    Object.entries(prev).filter(([key]) =>
                      selectedIds.includes(key)
                    )
                  )
                );
              }}
              placeholder="Select users"
              className="react-select"
              classNamePrefix="dropdown"
            />
            {formik.touched.user && formik.errors.user ? (
              <div className="text-red-500 text-sm">{formik.errors.user}</div>
            ) : null}
          </div>
        </div>

        {formik.values.user.map((user) => (
          <div key={user.value} className="flex items-center gap-2.5">
            <label className="form-label max-w-56">{user.label} Position</label>
            <input
              className="input"
              type="text"
              placeholder={`Enter position for ${user.label}`}
              value={positions[user.value] || ""}
              onChange={(e) => handlePositionChange(user.value, e.target.value)}
            />
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Update Group"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { Group_update };
