import queue from "bull";
import bottleneck from "bottleneck";
import emailQueueProcessor from "../helpers/emailQueueProcessor.js";

const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const emailQueue = new queue("emailQueue", {
  redis: redisConfig,
});

export const limiter = new bottleneck({
  maxConcurrent: 1,
  minTime: 60000 / 100,
});

emailQueue.process(emailQueueProcessor);
