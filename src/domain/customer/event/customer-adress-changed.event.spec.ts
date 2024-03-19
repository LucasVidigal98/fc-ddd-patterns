import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import { CustomerAdressChangedEvent } from "./customer-adress-changed.event";
import { CustomerCreatedEvent } from "./customer-created.event";
import { SendLogWhenAdressChanged } from "./handler/send-log-when-adress-changed.handler";
import { SendLogWhenCustomerIsCreated1 } from "./handler/send-log-when-customer-is-created1.handler";
import { SendLogWhenCustomerIsCreated2 } from "./handler/send-log-when-customer-is-created2.handler";

describe('Testing Costumer adress changed event', () => {
  it('Shloud be able to dispath event', () => {
    const customer = new Customer('1', 'teste');

    const adress = new Address('Rua', 1, '123', 'Sao Paulo');

    customer.changeAddress(adress);

    const event = new CustomerAdressChangedEvent(customer);

    const eventHandler = new SendLogWhenAdressChanged();

    const spy = jest.spyOn(eventHandler, 'handle');

    const eventDispatcher = new EventDispatcher();

    eventDispatcher.register('CustomerAdressChangedEvent', eventHandler);

    eventDispatcher.notify(event);

    expect(spy).toHaveBeenCalled();
  });
});