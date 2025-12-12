("use strict");
require("dotenv").config();
const { fse_dispatch } = require("./jobs");

const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog
] = require("./utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("./utils/logger/enums");

const run_job = async (run_log, job_type, action) => {
  await addLogEvent(I, run_log, "run_job", cal, null, null);
  try {
    switch (job_type) {
      case "fse_dispatch":
        await fse_dispatch(run_log, action);
        break;
      default:
        break;
    }
  } catch (error) {
    await addLogEvent(E, run_log, "run_job", cat, null, error);
  }
};

const on_boot = async () => {
  const run_log = await makeAppRunLog();

  const job_type = process.argv[2];
  const action = process.argv[3];

  let note = {
    job_type,
    action
  };

  try {
    await addLogEvent(I, run_log, "on_boot", cal, note, null);
    await run_job(run_log, job_type, action);

    await writeLogEvents(run_log);
  } catch (error) {
    await addLogEvent(E, run_log, "on_boot", cat, null, error);
    await writeLogEvents(run_log);
    console.log(error);
  }
};

on_boot();
