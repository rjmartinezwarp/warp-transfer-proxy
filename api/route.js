export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body));

  const destinationKey = body?.function?.arguments?.destination || "unknown";

  const routingMap = {
    dispatch: "+12132695125",
    carrier_sales: "+12132694511"
  };

  const phoneNumber = routingMap[destinationKey];

  if (phoneNumber) {
    return new Response(
      JSON.stringify({
        destination: {
          type: "number",
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
          number: "+12135550123", // fallback dummy number if needed
          numberE164CheckEnabled: true
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
