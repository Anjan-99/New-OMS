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
  const [strategyOptions, setStrategyOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const adminId = selector.user.adminId;

  const orderSideOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Sell", label: "Sell" },
  ];

  const orderTypeOptions = [
    { value: "Market", label: "Market" },
    { value: "Limit", label: "Limit" },
  ];

  const segmentsOptions = [
    { value: "Equity", label: "Equity" },
    { value: "Options", label: "Options" },
    { value: "Futures", label: "Futures" },
  ];

  const symbolOptions = [
    { value: "AAPL", label: "AAPL" },
    { value: "GOOG", label: "GOOG" },
  ];

  const expiryOptions = [
    { value: "2025-12-31", label: "2025-12-31" },
    { value: "2026-01-31", label: "2026-01-31" },
  ];

  const strikeOptions = [
    { value: "150", label: "150" },
    { value: "200", label: "200" },
  ];

  const optionsTypeOptions = [
    { value: "Call", label: "Call" },
    { value: "Put", label: "Put" },
  ];

  const formik = useFormik({
    initialValues: {
      orderside: null,
      ordertype: null,
      segments: null,
      symbol: null,
      expiry: null,
      strike: null,
      strategyOptions: null,
      optionstype: null,
      price: "0",
      clients: [{ clientName: "", quantity: "" }],
      userGroups: [{ user: null, group: null }],
    },
    validationSchema: Yup.object({
      orderside: Yup.string().required("Order Side is required"),
      ordertype: Yup.string().required("Order Type is required"),
      segments: Yup.string().required("Segments is required"),
      symbol: Yup.string().required("Symbol is required"),
      expiry: Yup.string().required("Expiry is required"),
      strike: Yup.string().required("Strike is required"),
      strategyOptions: Yup.string().required("Strategy Options is required"),
      optionstype: Yup.string().required("Options Type is required"),
      price: Yup.string().required("Price is required"),
      clients: Yup.array().of(
        Yup.object().shape({
          clientName: Yup.string().required("Client Name is required"),
          quantity: Yup.string().required("Quantity is required"),
        })
      ),
      userGroups: Yup.array().of(
        Yup.object().shape({
          user: Yup.object().required("User is required"),
          group: Yup.object().required("Group is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Add API call here when ready
      console.log("Form Data:", values);

      setLoading(false);
      setSuccess(true);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [strategyData, userData, groupData] = await Promise.all([
        request.get(`/api/strategy/get_strategies`),
        request.get(`/api/user/get_users?adminId=${adminId}`),
        request.get(`/api/usergrp/get_groups?adminId=${adminId}`),
      ]);

      const strategyOptions = strategyData.data.strategies.map((strategy) => ({
        value: strategy.strategyId,
        label: strategy.name,
      }));
      setStrategyOptions(strategyOptions);

      const userOptions = userData.data.users.map((user) => ({
        value: user.userId,
        label: user.name,
      }));
      setUserOptions(userOptions);

      const groupOptions = groupData.data.groups.map((group) => ({
        value: group.groupId,
        label: group.name,
      }));
      setGroupOptions(groupOptions);

      // Add API call here when ready to fetch data
      // For now, setting demo data
      // const demoData = {
      //   orderside: { value: "Buy", label: "Buy" },
      //   ordertype: { value: "Market", label: "Market" },
      //   segments: { value: "Equity", label: "Equity" },
      //   symbol: { value: "AAPL", label: "AAPL" },
      //   expiry: { value: "2025-12-31", label: "2025-12-31" },
      //   strike: { value: "150", label: "150" },
      //   optionstype: { value: "Call", label: "Call" },
      //   price: "100",
      //   clients: [{ clientName: "Client 1", quantity: "10" }],
      //   userGroups: [{ user: userOptions[0], group: groupOptions[0] }],
      // };
      // formik.setValues(demoData);
    };
    fetchData();
  }, [adminId]);

  // shortcut key commands shift + B to select the buy option and shift + S to select the sell option
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key === "B") {
        formik.setFieldValue("orderside", orderSideOptions[0]);
      } else if (event.shiftKey && event.key === "S") {
        formik.setFieldValue("orderside", orderSideOptions[1]);
      } else if (event.shiftKey && event.key === "M") {
        formik.setFieldValue("ordertype", orderTypeOptions[0]);
      } else if (event.shiftKey && event.key === "L") {
        formik.setFieldValue("ordertype", orderTypeOptions[1]);
      } else if (event.shiftKey && event.key === "E") {
        formik.setFieldValue("segments", segmentsOptions[0]);
      } else if (event.shiftKey && event.key === "O") {
        formik.setFieldValue("segments", segmentsOptions[1]);
      } else if (event.shiftKey && event.key === "F") {
        formik.setFieldValue("segments", segmentsOptions[2]);
      } 
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formik, orderSideOptions]);

  return (
    <div className="card pb-2.5">
      <div className="card-header">
        <h3 className="card-title">Order Management System</h3>
        { formik.values.orderside?.value === "Buy" ? (
          <span className="badge badge-success px-9 font-extrabold text-xs">BUY</span>
        ) : formik.values.orderside?.value === "Sell" ? (
          <span className="badge badge-danger px-9 font-extrabold text-xs">SELL</span>
        ) : null }
      </div>
      <form onSubmit={formik.handleSubmit} className="card-body">
        {error && (
          <div className="text-red-500 text-sm col-span-3">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm col-span-3">
            Order submitted successfully!
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="form-label block mb-1">Order Side</label>
            <Select
              className="react-select"
              classNamePrefix="dropdown"
              options={orderSideOptions}
              {...formik.getFieldProps("orderside")}
              placeholder="Select Order Side"
              onChange={(option) => formik.setFieldValue("orderside", option)}
              value={formik.values.orderside}
            />
            {formik.touched.orderside && formik.errors.orderside ? (
              <div className="text-red-500 text-sm">
                {formik.errors.orderside}
              </div>
            ) : null}
          </div>

          <div>
            <label className="form-label block mb-1">Order Type</label>
            <Select
              className="react-select"
              classNamePrefix="dropdown"
              options={orderTypeOptions}
              {...formik.getFieldProps("ordertype")}
              placeholder="Select Order Type"
              onChange={(option) => formik.setFieldValue("ordertype", option)}
              value={formik.values.ordertype}
            />
            {formik.touched.ordertype && formik.errors.ordertype ? (
              <div className="text-red-500 text-sm">
                {formik.errors.ordertype}
              </div>
            ) : null}
          </div>

          <div>
            <label className="form-label block mb-1">Segments</label>
            <Select
              className="react-select"
              classNamePrefix="dropdown"
              options={segmentsOptions}
              {...formik.getFieldProps("segments")}
              placeholder="Select Segments"
              onChange={(option) => formik.setFieldValue("segments", option)}
              value={formik.values.segments}
            />
            {formik.touched.segments && formik.errors.segments ? (
              <div className="text-red-500 text-sm">
                {formik.errors.segments}
              </div>
            ) : null}
          </div>

          <div>
            <label className="form-label block mb-1">Symbol</label>
            <Select
              className="react-select"
              id="symbol"
              classNamePrefix="dropdown"
              options={symbolOptions}
              {...formik.getFieldProps("symbol")}
              placeholder="Select Symbol"
              onChange={(option) => formik.setFieldValue("symbol", option)}
              value={formik.values.symbol}
            />
            {formik.touched.symbol && formik.errors.symbol ? (
              <div className="text-red-500 text-sm">{formik.errors.symbol}</div>
            ) : null}
          </div>

          {formik.values.segments?.value !== "Equity" ? (
            <div>
              <label className="form-label block mb-1">Expiry</label>
              <Select
                className="react-select"
                classNamePrefix="dropdown"
                options={expiryOptions}
                {...formik.getFieldProps("expiry")}
                placeholder="Select Expiry"
                onChange={(option) => formik.setFieldValue("expiry", option)}
                value={formik.values.expiry}
              />
              {formik.touched.expiry && formik.errors.expiry ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.expiry}
                </div>
              ) : null}
            </div>
          ) : null}

          {formik.values.segments?.value === "Options" ? (
            <>
              <div>
                <label className="form-label block mb-1">Strike</label>
                <Select
                  className="react-select"
                  classNamePrefix="dropdown"
                  options={strikeOptions}
                  {...formik.getFieldProps("strike")}
                  placeholder="Select Strike"
                  onChange={(option) => formik.setFieldValue("strike", option)}
                  value={formik.values.strike}
                />
                {formik.touched.strike && formik.errors.strike ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.strike}
                  </div>
                ) : null}
              </div>

              <div>
                <label className="form-label block mb-1">Options Type</label>
                <Select
                  className="react-select"
                  classNamePrefix="dropdown"
                  options={optionsTypeOptions}
                  {...formik.getFieldProps("optionstype")}
                  placeholder="Select Options Type"
                  onChange={(option) =>
                    formik.setFieldValue("optionstype", option)
                  }
                  value={formik.values.optionstype}
                />
                {formik.touched.optionstype && formik.errors.optionstype ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.optionstype}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          <div>
            <label className="form-label block mb-1">Strategy Options</label>
            <Select
              className="react-select"
              classNamePrefix="dropdown"
              options={strategyOptions}
              {...formik.getFieldProps("strategyOptions")}
              placeholder="Select Strategy Options"
              onChange={(option) =>
                formik.setFieldValue("strategyOptions", option)
              }
              value={formik.values.strategyOptions}
            />
            {formik.touched.strategyOptions && formik.errors.strategyOptions ? (
              <div className="text-red-500 text-sm">
                {formik.errors.strategyOptions}
              </div>
            ) : null}
          </div>

          {formik.values.ordertype?.value === "Limit" ? (
            <div>
              <label className="form-label block mb-1">Price</label>
              <input
                className="input w-full"
                type="text"
                autoComplete="off"
                {...formik.getFieldProps("price")}
                placeholder="Price"
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {/* <div className="grid grid-cols-1 gap-6">
          <div className="col-span-3">
            <hr className="my-4" />
            <div className="flex flex-col gap-4">
              {formik.values.userGroups.map((userGroup, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <Select
                    className="react-select"
                    classNamePrefix="dropdown"
                    options={userOptions}
                    placeholder="Select User"
                    onChange={(option) =>
                      formik.setFieldValue(`userGroups[${index}].user`, option)
                    }
                    value={userGroup.user}
                  />
                  <Select
                    className="react-select"
                    classNamePrefix="dropdown"
                    options={groupOptions}
                    placeholder="Select Group"
                    onChange={(option) =>
                      formik.setFieldValue(`userGroups[${index}].group`, option)
                    }
                    value={userGroup.group}
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeUserGroup(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={addUserGroup}
            >
              Add Row
            </button>
          </div>
        </div> */}

        <div className="col-span-3 flex justify-end pt-7">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { User_View };
