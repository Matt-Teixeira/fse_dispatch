const https = require("https");
const { send_dispatch_channel } = require("../tools");
const {
  get_share_point_token,
  get_fse_dispatch,
  get_sp_svc,
  post_dispatch_row
} = require("../api_call");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

async function send(run_log) {
  try {
    await addLogEvent(I, run_log, "send", cal, null, null);

    // const token = await get_share_point_token();

    const acu_odata = await get_fse_dispatch(run_log);

    // For testing. Grab first value
    let first_v = acu_odata.value[0];

    console.log("\nfirst_v");
    console.log(first_v);

    send_dispatch_channel({
      channelName: "Bot-Test",
      title: "FSE Dispatch Automate",
      description: first_v.Description.trim(),
      fields: {
        "Status": first_v.Status,
        "EquipmentNbr": first_v.EquipmentNbr.trim(),
        "ServiceContractID": first_v.ServiceContractID ?? "N/A",
        "Contact": first_v.Contact ?? "N/A",
        "AddressLine1": first_v.AddressLine1 ?? "N/A",
        "City": first_v.City ?? "N/A",
        "State": first_v.State ?? "N/A",
        "PostalCode": first_v.PostalCode ?? "N/A",
        "Manufacturer": first_v.Manufacturer ?? "N/A",
        "Modality": first_v.Modality ?? "N/A",
        "Model": first_v.Model ?? "N/A",
        "ServiceOrderCreated": first_v.ServiceOrderCreated,
      }
    });

  } catch (error) {
    await addLogEvent(E, run_log, "send", cat, null, error);
    console.log(error);
  }
}

module.exports = send;

// Example usage — call this when your DB condition is met:
