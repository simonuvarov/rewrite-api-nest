export class UserCreatedEvent {
  constructor(readonly id: string, readonly email: string) {}
}
