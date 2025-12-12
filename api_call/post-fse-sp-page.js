const axios = require("axios");

/**
 * Create a new list item (row) in SharePoint via Graph
 */
async function post_dispatch_row(token, fields) {
  const siteId = process.env.SITE_ID;

  const listId = process.env.PROD_SVC_LIST;

  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;

  try {
    const res = await axios.post(
      url,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(
      `\nCreated item: ${fields.Title}`,
      res.data.id,
      res.data.webUrl
    );
    return res.data;
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Error body:", JSON.stringify(err.response?.data, null, 2));
  }
}

module.exports = post_dispatch_row;
