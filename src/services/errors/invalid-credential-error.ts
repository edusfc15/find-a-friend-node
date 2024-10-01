export class InvalidCredentialError extends Error {
    constructor() {
        super("Invalid credentials");
        this.name = "InvalidCredentialError";
    }
}