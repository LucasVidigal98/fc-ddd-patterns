import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import { CustomerCreatedEvent } from "./customer-created.event";
import { SendLogWhenCustomerIsCreated1 } from "./handler/send-log-when-customer-is-created1.handler";
import { SendLogWhenCustomerIsCreated2 } from "./handler/send-log-when-customer-is-created2.handler";

describe('Testing Costumer Event Created', () => {
  it('Shloud be able to dispath event', () => {
    const customer = new Customer('1', 'teste');

    const event = new CustomerCreatedEvent(customer);

    const eventHandler1 = new SendLogWhenCustomerIsCreated1();
    const eventHandler2 = new SendLogWhenCustomerIsCreated2();

    const spy1 = jest.spyOn(eventHandler1, 'handle');
    const spy2 = jest.spyOn(eventHandler2, 'handle');

    const eventDispatcher = new EventDispatcher();

    eventDispatcher.register('CustomerCreatedEvent', eventHandler1);
    eventDispatcher.register('CustomerCreatedEvent', eventHandler2);

    eventDispatcher.notify(event);


    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
});