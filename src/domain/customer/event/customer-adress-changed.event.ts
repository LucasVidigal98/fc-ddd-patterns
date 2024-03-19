import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";
import Address from "../value-object/address";

export class CustomerAdressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(data: Customer) {
    this.eventData = data;
  }
} 