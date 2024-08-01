import { IQueuesToSubscribe } from "../interfaces/queuesToSubscribe.interface";
import { ReceiveOrderFinishedWorker } from "../workers/receiveOrderFinished.worker";
import { UpdateStatusOrder } from "../workers/updateStatusOrder.worker";

export const QUEUES = {
  REGISTER_ORDER: {
    NAME: "REGISTER_ORDER",
  },
  RECEIVE_ORDER_FINISHED: {
    NAME: "RECEIVE_ORDER_FINISHED",
    HANDLER: ReceiveOrderFinishedWorker,
  },
  UPDATE_STATUS_ORDER: {
    NAME: "UPDATE_STATUS_ORDER",
    HANDLER: UpdateStatusOrder,
  },
};

export const QUEUES_TO_SUBSCRIBE: IQueuesToSubscribe[] = [
  QUEUES.RECEIVE_ORDER_FINISHED,
  QUEUES.UPDATE_STATUS_ORDER,
];

export const QUEUE_LIST = Object.values(QUEUES);
