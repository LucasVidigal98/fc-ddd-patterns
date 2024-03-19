import EventInterface from "../../@shared/event/event.interface";
import Customer from "../entity/customer";

export class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(data: Customer) {
    this.eventData = data;
  }

}