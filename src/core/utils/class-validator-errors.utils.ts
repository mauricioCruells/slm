import { iterate } from 'iterare';
import { ValidationError } from 'class-validator';

export function flattenValidationErrors(
  validationErrors: ValidationError[],
): string[] {
  return iterate(validationErrors)
    .map((error) => mapValidationError(error))
    .flatten()
    .filter((item) => !!item.constraints)
    .map((item) => Object.values(item.constraints) as any)
    .flatten()
    .toArray();
}

function prependConstraintsWithParentProp(
  parentPath: string,
  error: ValidationError,
): ValidationError {
  const constraints = {};
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`;
  }
  return {
    ...error,
    constraints,
  };
}

function mapChildrenValidationErrors(
  error: ValidationError,
  parentPath?: string,
): ValidationError[] {
  const validationErrors = [];
  parentPath = parentPath
    ? `${parentPath}.row[${error.property}]`
    : error.property;
  for (const item of error.children) {
    if (item.children && item.children.length) {
      validationErrors.push(...mapChildrenValidationErrors(item, parentPath));
    }
    validationErrors.push(prependConstraintsWithParentProp(parentPath, item));
  }
  return validationErrors;
}

function mapValidationError(error: ValidationError): ValidationError[] {
  if (!(error.children && error.children.length)) {
    return [error];
  }
  return mapChildrenValidationErrors(error.children[0], error.property);
}
