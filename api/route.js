export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body));

  const eventType = body?.event;

  if (eventType === "transfer-destination-request") {
    const messagesArtifact = body?.artifact?.messages || [];
    const messagesFormatted = body?.messagesOpenAIFormatted || [];
    const allMessages = [...messagesArtifact, ...messagesFormatted];

    let intent = "unknown";

    for (const message of allMessages) {
      const text = (message?.message || message?.content || "").toLowerCase();

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
            number: "+12135550123",
            numberE164CheckEnabled: true
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(
    JSON.stringify({ message: "Not a transfer-destination-request" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
