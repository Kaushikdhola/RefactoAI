class ValidationError(Exception):
    status_code: int = 400

    def __init__(self, message: str, status: int = 400) -> None:
        super(Exception, self).__init__(message)
        self.message = message
        self.status_code = status
