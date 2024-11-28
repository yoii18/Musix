import rateLimit from "express-rate-limit";

const RateLimitter = rateLimit({
    windowMs: 1*60*1000,
    max: 30,
    message: "Rate Limit Exceeded"
});

export default RateLimitter;