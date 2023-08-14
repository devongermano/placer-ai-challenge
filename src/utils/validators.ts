import { City } from "../contexts/LocationContext";
import { FormState } from "../hooks/useForm";

export function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
    return "Email format is invalid";
  return "";
}

export function validateRequired(value: string) {
  if (!value) return "Required";
  return "";
}

export const validateCityBasedOnState = (cities: Record<string, City[]>) => {
  return (value: string, formState: FormState) => {
    if (
      cities[formState.state.value] &&
      cities[formState.state.value].length === 0
    ) {
      return "";
    }
    return validateRequired(value);
  };
};
