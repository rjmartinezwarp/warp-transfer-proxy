export const config = {
  runtime: 'edge'
}

export default async function handler(req) {
  const { function: func } = await req.json();
  let destination = "unknown";

  if (func?.arguments) {
    let args = typeof func.arguments === "string"
      ? JSON.parse(func.arguments)
      : func.arguments;
    destination = args.destination || "unknown";
  }

  const routingMap = {
    dispatch: "+14807354111",
    carrier_sales: "+12132694511"
  };

  if (routingMap[destination]) {
    return new Response(
      JSON.stringify({ action: "forward_call", phoneNumber: routingMap[destination] }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } else {
    return new Response(
      JSON.stringify({ action: "say_message", message: "Unknown destination." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
