import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: "Too many requests, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: true, // Skip failed requests
    skipSuccessfulRequests: false, // Do not skip successful requests
})