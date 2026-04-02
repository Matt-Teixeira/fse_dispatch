const { get_share_point_token } = require("../api_call");
const fetch = require("node-fetch");

async function get_lists() {
  const token = await get_share_point_token();
  const siteId = process.env.SITE_ID;

  const url =
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists` +
    `?$select=id,name,displayName,createdDateTime,lastModifiedDateTime,webUrl,system`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  for (const list of data.value) {
    console.log(
      list.id,
      list.name,
      list.displayName,
      list.system ? "(system/hidden)" : ""
    );
  }
}

module.exports = get_lists;
