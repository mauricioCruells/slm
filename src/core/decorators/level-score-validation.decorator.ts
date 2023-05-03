import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ValidateUpperWithLowerValue(
  lowerField: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [lowerField],
      validator: ValidateUpperWithLowerValueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidateUpperWithLowerValue' })
export class ValidateUpperWithLowerValueConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const upperValue = value as number;
    if (!(typeof upperValue === 'number')) {
      return false;
    }

    const lowerValue = parseFloat(args.object[args.constraints[0]]);
    if (lowerValue === undefined) return false;

    return upperValue === lowerValue;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The ${args.constraints[0]} must be equal to ${args.property}`;
  }
}
