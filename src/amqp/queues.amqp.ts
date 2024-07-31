import { RegisterOrderWorker } from "../workers/registerOrder.worker";
import { IQueuesToSubscribe } from "../interfaces/queuesToSubscribe.interface";

export const QUEUES = {
  REGISTER_ORDER: {
    NAME: "REGISTER_ORDER",
    HANDLER: RegisterOrderWorker,
  },
};

export const QUEUES_TO_SUBSCRIBE: IQueuesToSubscribe[] = [];

export const QUEUE_LIST = Object.values(QUEUES);
