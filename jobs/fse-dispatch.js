const {
  get_share_point_token,
  get_fse_sp_page,
  get_fse_dispatch,
  post_dispatch_row
} = require("../api_call");
const { map_fse_fields, normalizeFieldsForSharePoint } = require("../tools");
const axios = require("axios");

const fse_dispatch = async (action) => {
  try {
    const token = await get_share_point_token();

    switch (action) {
      case "get_list":
        await list_lists(token);
        break;
      case "get_all":
        const data = await get_fse_sp_page(token);
        console.log(data);
        break;
      case "post":
        const acu_odata = await get_fse_dispatch();

        if (!acu_odata.value.length) {
          console.log("\n*** NO ODATA ***");
          console.log(acu_odata);
          return;
        }

        let mapped_objs = map_fse_fields(acu_odata);

        for (let list of mapped_objs) {
          let is_present = await get_fse_sp_one(token, list.Title);

          if (is_present) {
            console.log(`\n\n${list.Title} is already in table!`);
            continue;
          }

          let normalized_list = normalizeFieldsForSharePoint(list);

          let res = await post_dispatch_row(token, normalized_list);
        }
        break;
      case "get_one_field_det":
        const one_field_det = await logListColumns(token);
        console.log(one_field_det);
        break;
      case "get_one_title":
        const one_field = await get_fse_sp_one(token, "SVC46341");
        console.log(one_field);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

function escapeODataString(str) {
  // OData uses '' to escape single quotes
  return str.replace(/'/g, "''");
}

async function get_fse_sp_one(token, title) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const baseUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  const escapedTitle = escapeODataString(title);

  try {
    const res = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        $expand: "fields",
        $filter: `fields/Title eq '${escapedTitle}'`,
        $top: 1 // we only care if *any* exists
      }
    });

    // res.data.value is an array of items
    if (res.data.value && res.data.value.length > 0) {
      return res.data.value[0]; // existing item
    }

    return null; // no match
  } catch (error) {
    console.log("Error in get_fse_sp_one:", error.response?.data || error);
    throw error;
  }
}

async function logListColumns(token) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/columns`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  for (const col of res.data.value) {
    if (col.name === "field_29") {
      console.log(JSON.stringify(col, null, 2));
    }
  }
}

async function list_lists(token) {
  const siteId = process.env.SITE_ID;

  const url =
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists` +
    `?$select=id,name,displayName,createdDateTime,lastModifiedDateTime,webUrl,system`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  for (const list of res.data.value) {
    console.log(
      list.id,
      list.name,
      list.displayName,
      list.system ? "(system/hidden)" : ""
    );
  }
}

async function get_single_item_fields(token, listId, itemId) {
  const siteId = process.env.SITE_ID;
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}/fields`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log("Fields for item", itemId, ":", res.data);
  return res.data;
}

module.exports = fse_dispatch;
