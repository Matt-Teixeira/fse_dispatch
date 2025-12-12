const axios = require("axios");
const qs = require("querystring");

async function get_share_point_token() {
  const tenantId = process.env.TENANT_ID;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  // v2.0 endpoint with tenant
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  // For v2.0 + client_credentials, use "scope" with ".default"
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default"
  };
  // scope: "https://avantehealthsolutions.sharepoint.com/.default"

  const res = await axios.post(tokenUrl, qs.stringify(body), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  return res.data.access_token;
}

module.exports = get_share_point_token;
