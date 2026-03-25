import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOneOf(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'atLeastOneOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fields],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedFields] = args.constraints as [string[]];

          const obj = args.object as Record<string, unknown>;

          return [propertyName, ...relatedFields].some((field) => {
            const fieldValue = obj[field];

            const isDefined = fieldValue !== undefined && fieldValue !== null;

            const isNotEmptyString =
              typeof fieldValue === 'string' && fieldValue.trim().length > 0;

            const isNotEmptyArray =
              Array.isArray(fieldValue) && fieldValue.length > 0;

            if (typeof fieldValue === 'string') return isNotEmptyString;
            if (Array.isArray(fieldValue)) return isNotEmptyArray;

            return isDefined;
          });
        },
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
