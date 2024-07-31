import { IQueuesToSubscribe } from "../interfaces/queuesToSubscribe.interface";
import { ReceiveOrderFinishedWorker } from "../workers/receiveOrderFinished.worker";

export const QUEUES = {
  REGISTER_ORDER: {
    NAME: "REGISTER_ORDER",
  },
  RECEIVE_ORDER_FINISHED: {
    NAME: "RECEIVE_ORDER_FINISHED",
    HANDLER: ReceiveOrderFinishedWorker,
  },
};

export const QUEUES_TO_SUBSCRIBE: IQueuesToSubscribe[] = [
  QUEUES.RECEIVE_ORDER_FINISHED,
];

export const QUEUE_LIST = Object.values(QUEUES);
