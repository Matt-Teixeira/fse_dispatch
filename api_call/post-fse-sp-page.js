const fetch = require("node-fetch");

const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, E },
  tag: { cal, det, cat }
} = require("../utils/logger/enums");

/**
 * Create a new list item (row) in SharePoint via Graph
 */
async function post_dispatch_row(run_log, token, fields) {
  await addLogEvent(I, run_log, "post_dispatch_row", cal, null, null);
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields })
    });

    const data = await res.json();

    await addLogEvent(
      I,
      run_log,
      "post_dispatch_row",
      det,
      `Create Item: ${fields.Title}`,
      null
    );

    console.log(
      `\nCreated item: ${fields.Title}`,
      data.id,
      data.webUrl
    );
    return data;
  } catch (error) {
    await addLogEvent(E, run_log, "post_dispatch_row", cat, null, error);
    console.error("Error:", error.message);
  }
}

module.exports = post_dispatch_row;
