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
      return new Response(
        JSON.stringify({
          destination: {
            type: "number",
            message: `Connecting you to our ${destination === "carrier_sales" ? "Carrier Sales" : "Dispatch"} team.`,
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
  console.log("📤 RESPONSE SENT TO VAPI:", JSON.stringify(responsePayload));
  return new Response(
    JSON.stringify({ message: "Not a transfer-destination-request" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
