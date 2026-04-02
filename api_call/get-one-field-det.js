const get_share_point_token = require("./get-sp-token");
const fetch = require("node-fetch");

async function get_one_field_det(field_prop_name) {
  try {
    const siteId = process.env.SITE_ID;
    const listId = process.env.PROD_SVC_LIST;

    const token = await get_share_point_token();

    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    for (const col of data.value) {
      if (col.name === field_prop_name) {
        console.log(JSON.stringify(col, null, 2));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = get_one_field_det;
