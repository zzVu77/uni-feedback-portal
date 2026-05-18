/**
 * @file Defines a custom class-validator decorator to ensure at least one of a set of properties is provided.
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

/**
 * A custom validation decorator that checks if at least one of the specified fields in an object is provided and not empty.
 *
 * @param fields - An array of other field names to check along with the decorated property.
 * @param validationOptions - Standard class-validator options.
 * @returns A decorator function.
 *
 * @example
 * class CreateMessageDto {
 *   @IsOptional()
 *   @IsString()
 *   @AtLeastOneOf(['attachments'], {
 *    message: 'Message must have either content or attachments',} attributes the validation to ensure that either `content` or `attachments` is provided.
 *   content?: string;
 *
 *   @IsOptional()
 *   @IsArray()
 *   attachments?: any[];
 * }
 */
export function AtLeastOneOf(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'atLeastOneOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fields], // Pass the related fields as a constraint
      options: validationOptions,
      validator: {
        /**
         * The validation logic.
         * @param value - The value of the decorated property (not directly used, as we inspect the whole object).
         * @param args - Validation arguments, including the object and constraints.
         * @returns `true` if at least one of the specified fields is valid, otherwise `false`.
         */
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedFields] = args.constraints as [string[]];
          const obj = args.object as Record<string, unknown>;

          // Check the decorated property itself along with the related fields.
          return [propertyName, ...relatedFields].some((field) => {
            const fieldValue = obj[field];

            // Basic check: not undefined or null
            const isDefined = fieldValue !== undefined && fieldValue !== null;

            // For strings: check if it's not just whitespace
            const isNotEmptyString =
              typeof fieldValue === 'string' && fieldValue.trim().length > 0;

            // For arrays: check if it's not empty
            const isNotEmptyArray =
              Array.isArray(fieldValue) && fieldValue.length > 0;

            // Apply specific checks based on type
            if (typeof fieldValue === 'string') return isNotEmptyString;
            if (Array.isArray(fieldValue)) return isNotEmptyArray;

            // For other types, the basic definition check is sufficient
            return isDefined;
          });
        },
        /**
         * Generates the default error message if validation fails.
         * @param args - Validation arguments.
         * @returns The error message string.
         */
        defaultMessage(args: ValidationArguments): string {
          const [relatedFields] = args.constraints as [string[]];
          return `At least one of the following fields must be provided: ${[
            args.property,
            ...relatedFields,
          ].join(', ')}`;
        },
      },
    });
  };
}
