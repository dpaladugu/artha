// /cloudflare-worker/index.js
// Cloudflare Worker to handle Telegram requests and write to Excel Online

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();
    const { command, payload } = body;
    const token = env.GRAPH_TOKEN; // Use Azure AD app token
    const fileId = env.EXCEL_FILE_ID; // OneDrive file ID or path

    try {
      const response = await handleExcelCommand(command, payload, token, fileId);
      return new Response(JSON.stringify({ status: "ok", data: response }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

async function handleExcelCommand(command, payload, token, fileId) {
  switch (command) {
    case "add_vehicle":
      return appendRow(token, fileId, "vehicles", [
        new Date().toISOString(),
        payload.vehicle,
        payload.odo,
        payload.fuel || "",
      ]);
    case "add_income":
      return appendRow(token, fileId, "transactions", [
        new Date().toISOString(),
        payload.amount,
        "Income",
        payload.category,
        ""
      ]);
    default:
      throw new Error("Unknown command: " + command);
  }
}

async function appendRow(token, fileId, sheetName, row) {
  const endpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/tables('Table1')/rows/add`; // adjust Table1 if renamed
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Graph API Error: ${error}`);
  }

  return await response.json();
}
