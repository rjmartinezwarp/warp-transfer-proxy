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

    if (routingMap[destination]) {
      return res.status(200).json({
        action: "forward_call",
        phoneNumber: routingMap[destination]
      });
    } else {
      return res.status(200).json({
        action: "say_message",
        message: "Unknown destination."
      });
    }

  } catch (err) {
    return res.status(200).json({
      action: "say_message",
      message: "Server error occurred."
    });
  }
}
