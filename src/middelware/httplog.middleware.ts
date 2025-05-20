import logger from "../utils/logger";
import morgan from "morgan";

// Define a custom token to capture the client's IP address
morgan.token("client-ip", function (req) {
  // Access the forwarded-for header or default to the direct connection IP
  const xForwardedFor = req.headers["x-forwarded-for"];
  const clientIp =
    typeof xForwardedFor === "string"
      ? xForwardedFor.split(",")[0].trim()
      : req.socket.remoteAddress;

  return clientIp?.split(":").reverse()[0];
});
const morganFormat = ":client-ip :method :url :status :response-time ms";

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      const logObject = {
        ip: message.split(" ")[0],
        method: message.split(" ")[1],
        url: message.split(" ")[2],
        status: message.split(" ")[3],
        responseTime: message.split(" ")[4] + " ms",
      };
      logger.http(JSON.stringify(logObject));
    },
  },
});

export default morganMiddleware;
