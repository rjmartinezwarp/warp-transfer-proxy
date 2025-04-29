export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const body = await req.json();
  console.log("INCOMING BODY:", JSON.stringify(body));

  const eventType = body?.event;

  if (eventType === "transfer-destination-request") {
    // Dynamically choose destination — here we're just hardcoding Dispatch
    return new Response(
      JSON.stringify({
        destination: {
          type: "number",
          message: "Connecting you to our Dispatch team.",
          number: "+12132695125",
          numberE164CheckEnabled: true,
          callerId: "+12136033597" // optional, but useful
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ message: "Not a transfer-destination-request" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
