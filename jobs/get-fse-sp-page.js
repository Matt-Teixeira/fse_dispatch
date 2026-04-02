const { get_share_point_token } = require("../api_call");
const fetch = require("node-fetch");

async function get_fse_sp_page() {
  const siteId = process.env.SITE_ID;
  const listId = process.env.PROD_SVC_LIST;

  const token = await get_share_point_token();

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  const items = [];

  const params = new URLSearchParams({
    expand: "fields",
    $top: "500"
  });

  let url = `${baseUrl}?${params}`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    // push this page's items
    items.push(...data.value);

    // follow nextLink if present
    url = data["@odata.nextLink"] || null;
  }

  console.log(items);

  return;
}

async function get_fse_sp_one(token) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  const params = new URLSearchParams({
    expand: "fields",
    $filter: `fields/Title eq 'SVC46341'`
  });

  const res = await fetch(`${baseUrl}?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  return data;
}

module.exports = get_fse_sp_page;
