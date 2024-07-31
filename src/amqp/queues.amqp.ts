import { RegisterOrderWorker } from "../workers/registerOrder.worker";

export const QUEUES = {
  REGISTER_ORDER: {
    NAME: "REGISTER_ORDER",
    HANDLER: RegisterOrderWorker,
  },
};

export const QUEUE_LIST = Object.values(QUEUES);
