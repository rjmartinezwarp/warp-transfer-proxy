export default async function handler(req, res) {
  try {
    const body = req.body || {};
    let destination = "unknown";

    if (body.function?.arguments) {
      let args = typeof body.function.arguments === "string"
        ? JSON.parse(body.function.arguments)
        : body.function.arguments;

      destination = args.destination || "unknown";
    }

    const routingMap = {
      dispatch: "+12132695125",
      carrier_sales: "+12132694511"
    };

    const response = routingMap[destination]
      ? { action: "forward_call", phoneNumber: routingMap[destination] }
      : { action: "say_message", message: "Unknown destination." };

    console.log("Returning to Vapi:", JSON.stringify(response)); // 🔥 This is key

    return res.status(200).json(response);

  } catch (err) {
    console.log("Handler error:", err.message);
    return res.status(200).json({
      action: "say_message",
      message: "Server error occurred."
    });
  }
}
