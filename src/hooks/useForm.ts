import { useReducer } from "react";

type ValidatorFn<T> = (value: T, state: FormState) => string | null;

interface FieldConfig<T = any> {
  initialValue?: T;
  validators?: ValidatorFn<T>[];
}

type FormConfig = {
  [key: string]: FieldConfig;
};

interface FieldState<T = any> {
  value: T;
  error: string | null;
}

export interface FormState {
  [key: string]: FieldState;
}

type FormAction<T = any> =
  | { type: "SET_VALUE"; key: string; value: T }
  | { type: "SET_ERROR"; key: string; error: string | null };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "SET_VALUE":
      return {
        ...state,
        [action.key]: { ...state[action.key], value: action.value },
      };
    case "SET_ERROR":
      return {
        ...state,
        [action.key]: { ...state[action.key], error: action.error },
      };
    default:
      return state;
  }
};

export const useForm = (config: FormConfig) => {
  const initialState: FormState = Object.keys(config).reduce<FormState>(
    (acc, key) => {
      acc[key] = { value: config[key].initialValue || "", error: null };
      return acc;
    },
    {},
  );

  const [state, dispatch] = useReducer(formReducer, initialState);

  const setValue = (key: string, value: any) => {
    dispatch({ type: "SET_VALUE", key, value });
  };

  const setValueAndValidate = (key: string, value: any) => {
    setValue(key, value);
    return validate(key, value);
  };

  const validate = (key: string, value: any) => {
    const validators = config[key].validators;
    if (validators) {
      for (let validator of validators) {
        const error = validator(value, state); // passing the entire form state here
        if (error) {
          dispatch({ type: "SET_ERROR", key, error });
          return false;
        }
      }
    }

    dispatch({ type: "SET_ERROR", key, error: null });
    return true;
  };

  const form = Object.keys(config).reduce(
    (acc, key) => {
      acc[key] = {
        value: state[key].value,
        error: state[key].error,
        setValue: (value: any) => setValue(key, value),
        setValueAndValidate: (value: any) => setValueAndValidate(key, value),
        validate: () => validate(key, state[key].value),
        clearError: () => dispatch({ type: "SET_ERROR", key, error: null }),
      };
      return acc;
    },
    {} as {
      [key: string]: {
        value: any;
        error: string | null;
        setValue: (value: any) => void;
        setValueAndValidate: (value: any) => boolean;
        validate: () => void;
        clearError: () => void;
      };
    },
  );

  const validateForm = () => {
    let isValid = true;
    for (let key in form) {
      if (!form[key].setValueAndValidate(form[key].value)) {
        isValid = false;
      }
    }
    return isValid;
  };

  const getValues = (): { [key: string]: any } => {
    return Object.fromEntries(
      Object.entries(form).map(([key, field]) => [key, field.value]),
    );
  };

  return {
    form,
    validateForm,
    getValues,
  };
};
