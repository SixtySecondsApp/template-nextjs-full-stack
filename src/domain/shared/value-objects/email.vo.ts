/**
 * Email Value Object
 * Encapsulates email validation and equality logic
 * Immutable and self-validating
 */
export class Email {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  /**
   * Validates email format using RFC 5322 simplified regex
   * @throws Error if email format is invalid
   */
  private validate(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  /**
   * Factory method to create Email instance
   * @param email Email string to validate and create
   * @returns Email instance
   * @throws Error if email format is invalid
   */
  public static create(email: string): Email {
    return new Email(email.toLowerCase().trim());
  }

  /**
   * Get the email value
   * @returns Email string
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Check equality with another Email
   * @param other Email to compare with
   * @returns True if emails are equal
   */
  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * Get string representation
   * @returns Email string
   */
  public toString(): string {
    return this.value;
  }
}
