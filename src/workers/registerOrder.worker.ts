import { Service } from "typedi";

@Service()
export class RegisterOrderWorker {
  async run(message: string) {
    const msj = JSON.parse(message);
    try {
      console.log("EL MENSAJE ES", msj);
    } catch (exception) {
      console.error("ERROR:vacancy.candidates.discard", exception);
      throw exception; // Maneja el error según tu lógica
    }
  }
}
