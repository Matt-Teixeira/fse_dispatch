("use strict");
require("dotenv").config();
const { fse_dispatch } = require("./jobs");

const run_job = async (job_type, action) => {
  switch (job_type) {
    case "fse_dispatch":
      await fse_dispatch(action);
      break;
    default:
      break;
  }
};

const on_boot = async () => {
  const job_type = process.argv[2];
  const action = process.argv[3];
  try {
    await run_job(job_type, action);
  } catch (error) {
    console.log(error);
  }
};

on_boot();
