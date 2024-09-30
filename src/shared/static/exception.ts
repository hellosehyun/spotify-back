interface ExceptionParams {
  message?: string
  stack?: string
}

export class BadRequest extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "BadRequest"
    this.stack = stack
  }
}

export class Unauthorized extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "Unauthorized"
    this.stack = stack
  }
}

export class Forbidden extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "Forbidden"
    this.stack = stack
  }
}

export class NotFound extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "NotFound"
    this.stack = stack
  }
}

export class Conflict extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "Conflict"
    this.stack = stack
  }
}

export class InternalError extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "InternalError"
    this.stack = stack
  }
}

export class BadGateway extends Error {
  constructor({ message, stack }: ExceptionParams = {}) {
    super(message)
    this.name = "BadGateway"
    this.stack = stack
  }
}
