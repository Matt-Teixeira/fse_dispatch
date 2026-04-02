const get_share_point_token = require("./get-sp-token");
const fetch = require("node-fetch");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

async function get_sp_svc(run_log, token, title) {
  const siteId = process.env.SITE_ID;
  const listId = process.env.PROD_SVC_LIST;

  token = token ?? (await get_share_point_token());

  await addLogEvent(I, run_log, "get_sp_svc", cal, { title }, null);

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  const escapedTitle = escapeODataString(title);

  const params = new URLSearchParams({
    $expand: "fields",
    $filter: `fields/Title eq '${escapedTitle}'`,
    $top: "1"
  });

  try {
    const res = await fetch(`${baseUrl}?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    // data.value is an array of items
    if (data.value && data.value.length > 0) {
      return data.value[0]; // existing item
    }

    return null;
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "get_sp_svc", cat, null, error);
  }
}

function escapeODataString(str) {
  // OData uses '' to escape single quotes
  return str.replace(/'/g, "''");
}

module.exports = get_sp_svc;
