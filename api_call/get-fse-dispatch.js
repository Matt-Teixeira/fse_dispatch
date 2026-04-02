const fetch = require("node-fetch");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

const get_fse_dispatch = async (run_log) => {
  await addLogEvent(I, run_log, "get_fse_dispatch", cal, null, null);
  const odate_url = process.env.FSE_DISPATCH_URI;
  try {
    const res = await fetch(odate_url, {
      headers: {
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.PROD_LOGIN_NAME + ":" + process.env.PROD_LOGIN_PW
          ).toString("base64")
      }
    });

    const data = await res.json();

    await addLogEvent(
      I,
      run_log,
      "get_fse_dispatch",
      det,
      { res: data },
      null
    );

    return data;
  } catch (error) {
    await addLogEvent(E, run_log, "fse_dispatch", cat, null, error);
    console.error("OData error:", error.message);
  }
};

module.exports = get_fse_dispatch;
