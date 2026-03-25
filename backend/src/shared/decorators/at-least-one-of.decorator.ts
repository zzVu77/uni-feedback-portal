/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOneOf(
  fields: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneOf',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [fields],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedFields] = args.constraints;
          const obj = args.object as any;
          return [propertyName, ...relatedFields].some(
            (field) =>
              obj[field] !== undefined &&
              obj[field] !== null &&
              (typeof obj[field] === 'string'
                ? obj[field].trim().length > 0
                : true) &&
              (Array.isArray(obj[field]) ? obj[field].length > 0 : true),
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedFields] = args.constraints;
          return `At least one of the following fields must be provided: ${[
            args.property,
            ...relatedFields,
          ].join(', ')}`;
        },
      },
    });
  };
}
