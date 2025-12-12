const { default: axios } = require("axios");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

const get_fse_dispatch = async (run_log) => {
  await addLogEvent(I, run_log, "get_fse_dispatch", cal, null, null);
  const odate_url = process.env.FSE_DISPATCH_URI;
  try {
    const res = await axios.get(odate_url, {
      // Axios will build the Basic Authorization header for you
      auth: {
        username: process.env.PROD_LOGIN_NAME, // e.g. "admin" or "admin@TenantName"
        password: process.env.PROD_LOGIN_PW
      },
      headers: {
        Accept: "application/json"
      }
    });

    await addLogEvent(
      I,
      run_log,
      "get_fse_dispatch",
      det,
      { res: res.data },
      null
    );

    return res.data;
  } catch (error) {
    await addLogEvent(E, run_log, "fse_dispatch", cat, null, error);
    console.error("OData error:", error.response?.status, error.response?.data);
  }
};

module.exports = get_fse_dispatch;
