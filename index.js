("use strict");
require("dotenv").config();
const { fse_dispatch, get_lists, get_fse_sp_page, send } = require("./jobs");
const { get_sp_svc, get_one_field_det } = require("./api_call");

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

const run_job = async (run_log, job_type) => {
  await addLogEvent(I, run_log, "run_job", cal, null, null);
  try {
    switch (job_type) {
      case "lists":
        await get_lists();
        break;
      case "fse_sp_items":
        await get_fse_sp_page();
        break;
      case "get_svc":
        const svc = await get_sp_svc(run_log, null, process.argv[3]);
        console.log(svc);
        break;
      case "get_field_det":
        const field = await get_one_field_det(process.argv[3]);
        console.log(field);
        break;
      case "fse_dispatch":
        await fse_dispatch(run_log);
        break;
      case "send":
        await send(run_log);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "run_job", cat, null, error);
  }
};

const on_boot = async () => {
  const run_log = await makeAppRunLog();

  const job_type = process.argv[2];

  let note = {
    job_type
  };

  try {
    await addLogEvent(I, run_log, "on_boot", cal, note, null);
    await run_job(run_log, job_type);

    await writeLogEvents(run_log);
  } catch (error) {
    await addLogEvent(E, run_log, "on_boot", cat, null, error);
    await writeLogEvents(run_log);
    console.log(error);
  }
};

on_boot();
