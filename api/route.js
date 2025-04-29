export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body));

  const eventType = body?.event;

  if (eventType === "transfer-destination-request") {
    const destination = body?.function?.arguments?.destination;

    const routingMap = {
      dispatch: "+12132695125",
      carrier_sales: "+12132694511"
    };

    const phoneNumber = routingMap[destination];

    if (phoneNumber) {
      const responsePayload = {
        destination: {
          type: "number",
          message: `Connecting you to our ${destination === "carrier_sales" ? "Carrier Sales" : "Dispatch"} team.`,
          number: phoneNumber,
          numberE164CheckEnabled: true
        }
      };

      console.log("📤 RESPONSE SENT TO VAPI:", JSON.stringify(responsePayload));

      return new Response(
        JSON.stringify(responsePayload),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      const fallbackPayload = {
        destination: {
          type: "number",
          message: "Connecting you to our main line.",
          number: "+12135550123",
          numberE164CheckEnabled: true
        }
      };

      console.log("📤 FALLBACK RESPONSE SENT:", JSON.stringify(fallbackPayload));

      return new Response(
        JSON.stringify(fallbackPayload),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  console.log("📤 EVENT WAS NOT A TRANSFER REQUEST");
  return new Response(
    JSON.stringify({ message: "Not a transfer-destination-request" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
