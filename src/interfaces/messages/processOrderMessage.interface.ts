export interface IProcessOrderMessage {
  action: string;
  data: {
    status: string;
    uuid: string;
  };
}
