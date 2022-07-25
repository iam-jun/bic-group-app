export default class Encoder {
  public encode(packet: any):unknown {
    return [this.encode(packet)];
  }
}
