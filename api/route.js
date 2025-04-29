export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body));

  const eventType = body?.event;

  if (eventType === "transfer-destination-request") {
    const conversationHistory = body?.artifact?.messages || [];

    let intent = "unknown";

    // Very basic keyword matching based on conversation
    for (const message of conversationHistory) {
      const text = message?.message?.toLowerCase() || "";

      if (text.includes("dispatch") || text.includes("delivery") || text.includes("warehouse")) {
        intent = "dispatch";
        break;
      } else if (text.includes("bid") || text.includes("posted load") || text.includes("carrier sales")) {
        intent = "carrier_sales";
        break;
      }
    }

    const routingMap = {
      dispatch: "+12132695125",
      carrier_sales: "+12132694511"
    };

    const phoneNumber = routingMap[intent];

    if (phoneNumber) {
      return new Response(
        JSON.stringify({
          destination: {
            type: "number",
            message: `Connecting you to our ${intent === "dispatch" ? "Dispatch" : "Carrier Sales"} team.`,
            number: phoneNumber,
            numberE164CheckEnabled: true
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          destination: {
            type: "number",
            message: "Connecting you to our main line.",
            number: "+12135550123", // fallback
            numberE164CheckEnabled: true
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Fallback if not a transfer-destination-request
  return new Response(
    JSON.stringify({ message: "Non-transfer event" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
