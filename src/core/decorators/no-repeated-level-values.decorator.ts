import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ValidateRepeatedLevelValues(
  upperField: string,
  validationOptions?: ValidationOptions,
): (object: any, propertyName: string) => void {
  return (object: any, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [upperField],
      validator: ValidateRepeatedLevelValuesConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ValidateRepeatedLevelValues' })
export class ValidateRepeatedLevelValuesConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments): boolean {
    const lowerValue = value as number;
    if (!(typeof lowerValue === 'number')) {
      return false;
    }

    const upperValue = parseFloat(args.object[args.constraints[0]]);
    if (upperValue === undefined) return false;

    return lowerValue < upperValue && lowerValue !== upperValue;
  }

  defaultMessage(args: ValidationArguments): string {
    return `The ${args.constraints[0]} must be greater and not equal to ${args.property}`;
  }
}
