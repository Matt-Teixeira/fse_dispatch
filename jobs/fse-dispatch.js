const {
  get_share_point_token,
  get_fse_dispatch,
  get_sp_svc,
  post_dispatch_row
} = require("../api_call");
const { map_fse_fields, normalizeFieldsForSharePoint } = require("../tools");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

const fse_dispatch = async (run_log) => {
  try {
    await addLogEvent(I, run_log, "fse_dispatch", cal, null, null);

    const token = await get_share_point_token();

    const acu_odata = await get_fse_dispatch(run_log);

    if (!acu_odata.value.length) {
      await addLogEvent(
        I,
        run_log,
        "fse_dispatch",
        cal,
        { message: "No Acumatica OData" },
        null
      );
      console.log("\n*** NO ODATA ***");
      return;
    }

    let mapped_objs = await map_fse_fields(run_log, acu_odata);

    for (let list of mapped_objs) {
      let is_present = await get_sp_svc(run_log, token, list.Title);

      if (is_present) {
        await addLogEvent(
          I,
          run_log,
          "fse_dispatch",
          det,
          { message: `No update: ${list.Title} is already in table` },
          null
        );
        console.log(`\n\n${list.Title} is already in table!`);
        continue;
      }

      let normalized_list = normalizeFieldsForSharePoint(list);
      await addLogEvent(
        I,
        run_log,
        "fse_dispatch",
        det,
        { normalized_list },
        null
      );

      console.log(normalized_list);
      continue;

      let res = await post_dispatch_row(run_log, token, normalized_list);
    }
  } catch (error) {
    await addLogEvent(E, run_log, "fse_dispatch", cat, null, error);
    console.log(error);
  }
};

module.exports = fse_dispatch;
