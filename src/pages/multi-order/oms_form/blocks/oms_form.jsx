/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useSelector } from "react-redux";
import request from "@/services/request";

const TICKERS_PER_LOAD = 25;

/* OPTIONS VALIDATION SCHEMA */
const optionsValidationSchema = Yup.object().shape({
  orderside: Yup.object().required("Order Side is required"),
  ordertype: Yup.object().required("Order Type is required"),
  segments: Yup.object().required("Segments is required"),
  symbol: Yup.object().required("Symbol is required"),
  expiry: Yup.object().required("Expiry is required"),
  strike: Yup.object().required("Strike is required"),
  strategyOptions: Yup.object().required("Strategy is required"),
  optionstype: Yup.object().required("Options Type is required"),
});

/* EQUITY VALIDATION SCHEMA */
const equityValidationSchema = Yup.object().shape({
  orderside: Yup.object().required("Order Side is required"),
  ordertype: Yup.object().required("Order Type is required"),
  segments: Yup.object().required("Segments is required"),
  symbol: Yup.object().required("Symbol is required"),
  strategyOptions: Yup.object().required("Strategy is required"),
});

/* FUTURE VALIDATION SCHEMA */
const futuresValidationSchema = Yup.object().shape({
  orderside: Yup.object().required("Order Side is required"),
  ordertype: Yup.object().required("Order Type is required"),
  segments: Yup.object().required("Segments is required"),
  symbol: Yup.object().required("Symbol is required"),
  expiry: Yup.object().required("Expiry is required"),
  strategyOptions: Yup.object().required("Strategy is required"),
});

const User_View = () => {
  const selector = useSelector((state) => state.auth);

  const [activeIndex, setActiveIndex] = useState(0);

  /* LOADING STATE */
  const [loading, setLoading] = useState(false);

  /* SUCCESS AND ERROR STATE */
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [segmentSelected, setSegmentSelected] = useState();
  const [symbolSelected, setSymbolSelected] = useState();
  const [expirySelected, setExpirySelected] = useState();

  /* EQUITY - TICKER DATA */
  const [tickerData, setTickerData] = useState({});
  const [displayedTickers, setDisplayedTickers] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  /* EQUITY - OPTIONS DATA */
  const [optionsData, setOptionsData] = useState({});
  const [displayedOptions, setDisplayedOptions] = useState([]);
  const [hasMoreOptions, setHasMoreOptions] = useState(true);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  /* EXPIRY DATA */
  const [expiryOptions, setExpiryOptions] = useState({});

  /* STRIKE PRICE */
  const [strikeOptions, setStrikeOptions] = useState();

  /* DROPDOWN STATES */
  const [strategyOptions, setStrategyOptions] = useState([]);

  /* USERS AND GROUPS */
  const [allClientsData, setAllClientsData] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [showClientError, setShowClientError] = useState(false);

  /* CLIENTS OBJECT */
  const clientsData = { clientName: "", positions: "" };

  /* ALL ORDERS STATE */
  const [allOrdersList, setAllOrdersList] = useState([
    {
      orderside: null,
      ordertype: null,
      segments: null,
      symbol: null,
      expiry: null,
      strike: null,
      strategyOptions: null,
      optionstype: null,
      price: "0",
      clients: [],
    },
  ]);

  /* COLORS */
  const [colors, setColors] = useState([]);

  /* ADMIN ID */
  const adminId = selector.user.adminId;

  /* ORDER SIDE */
  const orderSideOptions = [
    { value: "Buy", label: "Buy" },
    { value: "Sell", label: "Sell" },
  ];

  /* ORDER TYPE OPTIONS */
  const orderTypeOptions = [
    { value: "Market", label: "Market" },
    { value: "Limit", label: "Limit" },
  ];

  /* SEGMENT OPTIONS */
  const segmentsOptions = [
    { value: "equity", label: "Equity" },
    { value: "option", label: "Options" },
    { value: "future", label: "Futures" },
  ];

  /* OPTIONS TYPE */
  const optionsTypeOptions = [
    { value: "Call", label: "Call" },
    { value: "Put", label: "Put" },
  ];

  /* USE EFFECT */
  useEffect(() => {
    const fetchInitialData = async () => {
      const [tickerResponse, cmResponse] = await Promise.all([
        request.get(`api/jainam/gettickerlist`),
        request.get(`api/jainam/getcmdata`),
      ]);

      setTickerData(tickerResponse.data);
      setOptionsData(cmResponse.data);

      /* LOAD DROPDOWN OPTIONS FOR FUTURES AND OPTIONS */
      const futureTickers = Object.keys(tickerResponse.data)
        .slice(0, TICKERS_PER_LOAD)
        .map((ticker) => ({
          value: ticker,
          label: ticker,
        }));

      /* LOAD DROPDOWN OPTIONS FOR FUTURES AND OPTIONS */
      const equityTickers = Object.keys(cmResponse.data)
        .slice(0, TICKERS_PER_LOAD)
        .map((ticker) => ({
          value: ticker,
          label: ticker,
        }));

      setDisplayedTickers(futureTickers);
      setDisplayedOptions(equityTickers);
      setHasMore(Object.keys(tickerResponse.data).length > TICKERS_PER_LOAD);
      setHasMoreOptions(Object.keys(cmResponse.data).length > TICKERS_PER_LOAD);

      const [strategyData, userData, groupData] = await Promise.all([
        request.get(`/api/strategy/get_strategies`),
        request.get(`/api/user/get_users?adminId=${adminId}`),
        request.get(`/api/usergrp/get_groups?adminId=${adminId}`),
      ]);

      /* CLIENTS LIST */
      const clientsList = userData.data.users.map((user) => ({
        value: user.userId,
        label: user.name,
      }));
      setClientOptions(clientsList);

      /* GROUPS LIST */
      const groupsList = groupData.data.groups.map((group) => ({
        value: group.groupId,
        label: group.grpname,
      }));
      setGroupOptions(groupsList);

      /* STRATEGIES LIST */
      const strategies = strategyData.data.strategies.map((data) => ({
        value: data?.strategyId,
        label: data?.name,
      }));
      setStrategyOptions(strategies);

      let combinedArrays = clientsList.concat(groupsList);
      setAllClientsData(combinedArrays);
    };

    const storedColors = localStorage.getItem("tradingColors");
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    }

    fetchInitialData();
  }, [adminId]);

  /* USE EFFECT */
  useEffect(() => {
    const fetchExpiryData = async (segment, symbol) => {
      const [expiryResponse] = await Promise.all([
        request.get(
          `api/jainam/findExpiryList?segment=${segment}&symbol=${symbol}`
        ),
      ]);

      const expiryData = expiryResponse?.data?.map((data) => ({
        value: data,
        label: data,
      }));

      setExpiryOptions(expiryData);
    };

    fetchExpiryData(segmentSelected, symbolSelected);
  }, [segmentSelected, symbolSelected]);

  /* USE EFFECT */
  useEffect(() => {
    const fetchStrikePriceData = async (segment, symbol, expiry) => {
      const [strikePrice] = await Promise.all([
        request.get(
          `api/jainam/findStrikePriceList?segment=${segment}&symbol=${symbol}&expiry=${expiry}`
        ),
      ]);

      const strikeData = strikePrice?.data?.map((data) => ({
        value: data,
        label: data,
      }));

      setStrikeOptions(strikeData);
    };

    fetchStrikePriceData(segmentSelected, symbolSelected, expirySelected);
  }, [segmentSelected, symbolSelected, expirySelected]);

  /* LOAD MORE TICKERS */
  const loadMoreTickers = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    const start = page * TICKERS_PER_LOAD;
    const end = start + TICKERS_PER_LOAD;
    const allTickers = Object.keys(tickerData);

    const newTickers = allTickers.slice(start, end).map((ticker) => ({
      value: ticker,
      label: ticker,
    }));

    setDisplayedTickers((prev) => [...prev, ...newTickers]);
    setPage((prev) => prev + 1);
    setHasMore(end < allTickers.length);
    setIsLoading(false);
  };

  /* LOAD MORE OPTIONS */
  const loadMoreOptions = () => {
    if (isLoadingOptions || !hasMoreOptions) return;

    setIsLoadingOptions(true);

    const start = page * TICKERS_PER_LOAD;
    const end = start + TICKERS_PER_LOAD;
    const allTickers = Object.keys(optionsData);

    const newTickers = allTickers.slice(start, end).map((ticker) => ({
      value: ticker,
      label: ticker,
    }));

    setDisplayedOptions((prev) => [...prev, ...newTickers]);
    setPage((prev) => prev + 1);
    setHasMoreOptions(end < allTickers.length);
    setIsLoadingOptions(false);
  };

  /* ADD CLIENT */
  const addClient = () => {
    let formValues = formik.values.clients;
    formValues.push({ clientName: "", positions: "" });
    formik.setFieldValue("clients", formValues);
  };

  /* REMOVE CLIENT */
  const removeClient = (index) => {
    let formValues = formik.values.clients;
    formValues.splice(index, 1);
    formik.setFieldValue("clients", formValues);
  };

  /* SELECTED CLIENT FUNCTION */
  const handleClientSelect = (index, e) => {
    let formValues = formik.values.clients;
    formValues[index].clientName = e.value;
    formik.setFieldValue("clients", formValues);
  };

  /* HANDLE POSITIONS ENTERED */
  const handlePositionsEntered = (index, e) => {
    let formValues = formik.values.clients;
    formValues[index].positions = e?.target?.value;
    formik.setFieldValue("clients", formValues);
  };

  /* CLIENTS LIST */
  const clientsGroupList = [
    {
      label: "Clients",
      options: clientOptions,
    },
    {
      label: "Groups",
      options: groupOptions,
    },
  ];

  /* ADD ORDER */
  const addOrder = () => {
    let formValues = allOrdersList;
    formValues.push({
      orderside: null,
      ordertype: null,
      segments: null,
      symbol: null,
      expiry: null,
      strike: null,
      strategyOptions: null,
      optionstype: null,
      price: "0",
      clients: [clientsData],
    });
    setAllOrdersList(formValues);
  };

  /* ORDER FORMIK */
  const formik = useFormik({
    initialValues: {
      index: 0,
      orderside: null,
      ordertype: null,
      segments: null,
      symbol: null,
      expiry: null,
      strike: null,
      strategyOptions: null,
      optionstype: null,
      price: "0",
      clients: [clientsData],
    },
    validationSchema:
      segmentSelected === "option"
        ? optionsValidationSchema
        : segmentSelected === "future"
          ? futuresValidationSchema
          : equityValidationSchema,
    onSubmit: async (values) => {
      /* FINAL JSON OBJECT */
      const obj = {
        orderside: values.orderside,
        ordertype: values.ordertype,
        segments: values.segments,
        symbol: values.symbol,
        expiry: values?.expiry,
        strike: values?.strike,
        optionstype: values?.optionstype,
        strategyOptions: values?.strategyOptions,
        clients: values?.clients,
        price: values?.price,
      };

      allOrdersList.splice(values.index, 1, obj);
      formik.setFieldValue("index", values.index + 1);
      addOrder();
      formik.handleReset();
    },
  });

  /* REMOVE ROW */
  const removeRow = (index) => {
    let formValues = allOrdersList;
    formValues.splice(index, 1);
    setAllClientsData((prevState) => [...prevState, formValues]);
  };

  /* HANDLE ALL ORDERS */
  const handleAllOrders = () => {
    const finalList = allOrdersList
      .filter((data) => data?.orderside !== null)
      .map((order) => ({
        ...order,
        orderside: order.orderside?.value || null,
        ordertype: order.ordertype?.value || null,
        segments: order.segments?.value || null,
        strategyOptions: order.strategyOptions?.value || null,
        symbol: order.symbol?.value || null,
        expiry: order.expiry?.value || null,
        optionstype: order.optionstype?.value || null,
      }));
    console.log("Final List: ", finalList);
  };

  return (
    <React.Fragment>
      {allOrdersList.map((data, index) => {
        console.log("All data: ", data);
        return (
          <form key={index}>
            <div
              className={`card pb-2.5 ${(formik.values.orderside?.value || data?.orderside?.value) === "Buy" && "border-green-500"} ${(formik.values.orderside?.value || data?.orderside?.value) === "Sell" && "border-red-500"}`}
            >
              {/* CARD HEADER */}
              <div
                className={`card-header ${(formik.values.orderside?.value || data?.orderside?.value) === "Buy" && "border-green-500"} ${(formik.values.orderside?.value || data?.orderside?.value) === "Sell" && "border-red-500"}`}
              >
                <h3 className="card-title">Order - {index + 1}</h3>

                {/* BADGES */}
                <div className="flex gap-2">
                  {/* BUY BADGE */}
                  {(formik.values.orderside?.value ||
                    data?.orderside?.value) === "Buy" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.buy }}
                    >
                      BUY
                    </span>
                  )}

                  {/* SELL BADGE */}
                  {(formik.values.orderside?.value ||
                    data?.orderside?.value) === "Sell" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.sell }}
                    >
                      SELL
                    </span>
                  )}

                  {/* MARKET BADGE */}
                  {(formik.values.ordertype?.value ||
                    data?.ordertype?.value) === "Market" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.market }}
                    >
                      MARKET
                    </span>
                  )}

                  {/* LIMIT BADGE */}
                  {(formik.values.ordertype?.value ||
                    data?.ordertype?.value) === "Limit" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.limit }}
                    >
                      LIMIT
                    </span>
                  )}

                  {/* EQUITY BADGE */}
                  {(formik.values.segments?.value || data?.segments?.value) ===
                    "equity" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.equity }}
                    >
                      EQUITY
                    </span>
                  )}

                  {/* OPTIONS BADGE */}
                  {(formik.values.segments?.value || data?.segments?.value) ===
                    "options" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.option }}
                    >
                      OPTIONS
                    </span>
                  )}

                  {/* FUTURES BADGE */}
                  {(formik.values.segments?.value || data?.segments?.value) ===
                    "future" && (
                    <span
                      className="badge px-4 font-extrabold text-xs badge-info"
                      style={{ backgroundColor: colors.future }}
                    >
                      FUTURES
                    </span>
                  )}
                </div>
              </div>

              {/* CARD BODY */}
              <div className="card-body">
                {/* ORDER PLACING FORM */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                  {/* ORDER SIDE */}
                  <div>
                    <label className="form-label block mb-1">Order Side</label>
                    <div className="mt-1">
                      <Select
                        className="react-select"
                        classNamePrefix="dropdown"
                        options={orderSideOptions}
                        {...formik.getFieldProps("orderside")}
                        placeholder="Select Order Side"
                        onChange={(option) =>
                          formik.setFieldValue("orderside", option)
                        }
                        value={data.orderside || formik.values.orderside}
                      />
                      {formik.touched.orderside && formik.errors.orderside ? (
                        <div className="mt-1 text-red-500 text-sm">
                          {formik.errors.orderside}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* ORDER TYPE */}
                  <div>
                    <label className="form-label block mb-1">Order Type</label>
                    <Select
                      className="react-select"
                      classNamePrefix="dropdown"
                      options={orderTypeOptions}
                      {...formik.getFieldProps("ordertype")}
                      placeholder="Select Order Type"
                      onChange={(option) =>
                        formik.setFieldValue("ordertype", option)
                      }
                      value={data.ordertype || formik.values.ordertype}
                    />
                    {formik.touched.ordertype && formik.errors.ordertype ? (
                      <div className="mt-1 text-red-500 text-sm">
                        {formik.errors.ordertype}
                      </div>
                    ) : null}
                  </div>

                  {/* SEGMENTS */}
                  <div>
                    <label className="form-label block mb-1">Segments</label>
                    <Select
                      className="react-select"
                      classNamePrefix="dropdown"
                      options={segmentsOptions}
                      {...formik.getFieldProps("segments")}
                      placeholder="Select Segments"
                      onChange={(option) => {
                        formik.setFieldValue("segments", option);
                        setSegmentSelected(option?.value);
                      }}
                      value={data.segments || formik.values.segments}
                    />
                    {formik.touched.segments && formik.errors.segments ? (
                      <div className="mt-1 text-red-500 text-sm">
                        {formik.errors.segments}
                      </div>
                    ) : null}
                  </div>

                  {/* SYMBOL */}
                  {formik.values.segments?.value === "equity" ? (
                    <div>
                      <label className="form-label block mb-1">Symbol</label>
                      <Select
                        className="react-select"
                        id="symbol"
                        classNamePrefix="dropdown"
                        options={displayedOptions}
                        {...formik.getFieldProps("symbol")}
                        placeholder="Select Symbol"
                        onMenuScrollToBottom={loadMoreOptions}
                        isLoading={isLoadingOptions}
                        onChange={(option) => {
                          formik.setFieldValue("symbol", option);
                          setSymbolSelected(option?.value);
                        }}
                        value={data.symbol || formik.values.symbol}
                      />
                      {formik.touched.symbol && formik.errors.symbol ? (
                        <div className="mt-1 text-red-500 text-sm">
                          {formik.errors.symbol}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div>
                      <label className="form-label block mb-1">Symbol</label>
                      <Select
                        className="react-select"
                        id="symbol"
                        classNamePrefix="dropdown"
                        options={displayedTickers}
                        {...formik.getFieldProps("symbol")}
                        placeholder="Select Symbol"
                        onMenuScrollToBottom={loadMoreTickers}
                        isLoading={isLoading}
                        onChange={(option) => {
                          formik.setFieldValue("symbol", option);
                          setSymbolSelected(option?.value);
                        }}
                        value={data.symbol || formik.values.symbol}
                      />
                      {formik.touched.symbol && formik.errors.symbol ? (
                        <div className="mt-1 text-red-500 text-sm">
                          {formik.errors.symbol}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* EQUITY SELECTED */}
                  {formik.values.segments?.value !== "equity" &&
                    (formik.values.segments?.value === "option" ||
                      formik.values.segments?.value === "future") && (
                      <div>
                        <label className="form-label block mb-1">Expiry</label>
                        <Select
                          className="react-select"
                          classNamePrefix="dropdown"
                          options={expiryOptions}
                          {...formik.getFieldProps("expiry")}
                          placeholder="Select Expiry"
                          onChange={(option) => {
                            formik.setFieldValue("expiry", option);
                            setExpirySelected(option?.value);
                          }}
                          value={data.expiry || formik.values.expiry}
                        />
                        {formik.touched.expiry && formik.errors.expiry && (
                          <div className="mt-1 text-red-500 text-sm">
                            {formik.errors.expiry}
                          </div>
                        )}
                      </div>
                    )}

                  {/* OPTIONS SELECTED */}
                  {formik.values.segments?.value === "option" ? (
                    <>
                      <div>
                        <label className="form-label block mb-1">
                          Strike price
                        </label>
                        <Select
                          className="react-select"
                          classNamePrefix="dropdown"
                          options={strikeOptions}
                          {...formik.getFieldProps("strike")}
                          placeholder="Select Strike"
                          onChange={(option) =>
                            formik.setFieldValue("strike", option)
                          }
                          value={data.strike || formik.values.strike}
                        />
                        {formik.values.segments?.value === "Options" &&
                        formik.touched.strike &&
                        formik.errors.strike ? (
                          <div className="mt-1 text-red-500 text-sm">
                            {formik.errors.strike}
                          </div>
                        ) : null}
                      </div>

                      <div>
                        <label className="form-label block mb-1">
                          Options Type
                        </label>
                        <Select
                          className="react-select"
                          classNamePrefix="dropdown"
                          options={optionsTypeOptions}
                          {...formik.getFieldProps("optionstype")}
                          placeholder="Select Options Type"
                          onChange={(option) =>
                            formik.setFieldValue("optionstype", option)
                          }
                          value={data.optionstype || formik.values.optionstype}
                        />
                        {formik.touched.optionstype &&
                        formik.errors.optionstype ? (
                          <div className="mt-1 text-red-500 text-sm">
                            {formik.errors.optionstype}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}

                  {/* STRATEGY */}
                  <div>
                    <label className="form-label block mb-1">Strategy</label>
                    <Select
                      className="react-select"
                      classNamePrefix="dropdown"
                      options={strategyOptions}
                      {...formik.getFieldProps("strategyOptions")}
                      placeholder="Select Strategy"
                      onChange={(option) =>
                        formik.setFieldValue("strategyOptions", option)
                      }
                      value={
                        data.strategyOptions || formik.values.strategyOptions
                      }
                    />
                    {formik.touched.strategyOptions &&
                    formik.errors.strategyOptions ? (
                      <div className="mt-1 text-red-500 text-sm">
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
                        value={data.price || formik.values.price}
                        onChange={formik.handleChange}
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

                <hr className="my-5" />

                {/* USERS LIST */}
                <div className="mt-5">
                  {/* HEADING */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-black dark:text-white">
                      Add clients/groups
                    </h2>
                    <button
                      type="button"
                      className="bg-white bg-opacity-15 hover:bg-opacity-30 transition-all duration-300 ease-in-out border border-white border-opacity-30 text-sm font-medium text-white px-5 py-2 rounded-md"
                      onClick={addClient}
                    >
                      Add client
                    </button>
                  </div>

                  {/* BODY */}
                  <div className="mt-5">
                    {formik.values.clients.map((data, index) => {
                      console.log("Client details: ", data);
                      return (
                        <div
                          className="flex items-center gap-5 mt-5 first:mt-0"
                          key={index}
                        >
                          <div className="w-full">
                            <label className="form-label block mb-1">
                              Client/Group
                            </label>
                            <div className="mt-1">
                              <Select
                                className="react-select"
                                classNamePrefix="dropdown"
                                options={clientsGroupList}
                                value={allClientsData.find(
                                  (data) => data?.value === data[index]?.value
                                )}
                                onChange={(e) => handleClientSelect(index, e)}
                                name="clientName"
                                placeholder="Select client/group"
                              />
                              {showClientError && data?.clientName === "" && (
                                <div className="mt-1 text-red-500 text-sm">
                                  Please select client
                                </div>
                              )}
                            </div>
                          </div>

                          {!groupOptions.find(
                            (group) => group.value === data.clientName
                          ) && (
                            <div className="w-full">
                              <label className="form-label block mb-1">
                                Position
                              </label>
                              <div className="mt-1">
                                <input
                                  className="input"
                                  type="text"
                                  name="positions"
                                  value={data.positions}
                                  onChange={(e) =>
                                    handlePositionsEntered(index, e)
                                  }
                                  placeholder="No. of positions"
                                />
                                {showClientError && data?.positions === "" && (
                                  <div className="mt-1 text-red-500 text-sm">
                                    Please enter positions
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {formik.values.clients.length !== 1 && (
                            <button
                              onClick={() => removeClient(index)}
                              className="mt-5 shadow-none hover:shadow-none bg-red-500 hover:bg-opacity-80 transition-all duration-300 ease-in-out text-xs font-medium text-white px-5 py-3 rounded-md"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BUTTONS ROW */}
                <div className="col-span-3 mt-7 w-full flex items-center justify-end gap-5">
                  {allOrdersList?.length !== 1 && (
                    <button
                      onClick={() => {
                        removeRow(index);
                      }}
                      className="bg-red-500 bg-opacity-15 hover:bg-opacity-30 transition-all duration-300 ease-in-out border border-red-500 border-opacity-30 text-sm font-medium text-red-500 px-5 py-2 rounded-md"
                    >
                      Remove
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        formik.values.clients.length === 1 &&
                        formik.values.clients.filter(
                          (data) => data?.clientName === null
                        )
                      ) {
                        setShowClientError(true);
                      } else {
                        setShowClientError(false);
                      }
                      formik.handleSubmit();
                    }}
                    className="btn btn-primary"
                  >
                    Add order
                  </button>
                </div>
              </div>
            </div>
          </form>
        );
      })}

      <div className="flex items-center justify-end">
        <button
          onClick={handleAllOrders}
          className="bg-[#24c09a] transition-all duration-300 ease-in-out border border-green-500 border-opacity-30 text-sm font-medium text-white px-5 py-3 rounded-md"
        >
          Place order
        </button>
      </div>
    </React.Fragment>
  );
};

export { User_View };
