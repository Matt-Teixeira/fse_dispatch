const axios = require("axios");

async function get_fse_sp_page(token) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  const items = [];
  let url = baseUrl;

  while (url) {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        // only on the first request; Graph will include these in nextLink
        expand: "fields", // or "fields(select=Title,ServiceOrderNbr,Status,...)"
        $top: 500 // ask for a big page
      }
    });

    // push this page's items
    items.push(...res.data.value);

    // follow nextLink if present
    url = res.data["@odata.nextLink"] || null;
  }

  return items;
}

async function get_fse_sp_one(token) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  let url = baseUrl;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      expand: "fields",
      $filter: `fields/Title eq 'SVC46341'`
    }
  });

  return res.data;
}

module.exports = get_fse_sp_page;
