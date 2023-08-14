import * as Validators from "../../utils/validators";
import { useLocation } from "../../contexts/LocationContext";
import { useForm } from "../../hooks/useForm";
import { TextInput } from "../inputs/TextInput/TextInput";
import { Dropdown } from "../inputs/Dropdown/Dropdown";
import "./SignupForm.css";

const SignupForm: React.FC = () => {
  // Extract location-related utilities and data from the LocationContext
  const {
    states,
    cities,
    fetchCitiesForState,
    cityHasNoOptions,
    loading: locationLoading,
    error: locationError,
  } = useLocation();

  // Define form fields and their validation rules
  const { form, validateForm, getValues } = useForm({
    firstName: { initialValue: "", validators: [Validators.validateRequired] },
    lastName: { initialValue: "", validators: [Validators.validateRequired] },
    state: { initialValue: "", validators: [Validators.validateRequired] },
    city: {
      initialValue: "",
      validators: [Validators.validateCityBasedOnState(cities)],
    },
    email: {
      initialValue: "",
      validators: [Validators.validateRequired, Validators.validateEmail],
    },
    password: { initialValue: "", validators: [Validators.validateRequired] },
  });

  // Handle form submission: Validate form and log results/errors
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      console.log("FORM_VALUES:", getValues());
    }
  };

  return (
    <div>
      <h1>Sign Up!</h1>
      <form onSubmit={handleFormSubmit} className="container signup-form-grid">
        {/* Basic Text Inputs for FirstName, LastName */}
        <TextInput
          label={"First Name"}
          placeholder={"John"}
          type="text"
          value={form.firstName.value}
          onChange={(e) => form.firstName.setValue(e.target.value)}
          onBlur={() => form.firstName.validate()}
          onFocus={() => form.firstName.clearError()}
          error={form.firstName.error}
        />
        <TextInput
          label={"Last Name"}
          placeholder={"Wick"}
          type="text"
          value={form.lastName.value}
          onChange={(e) => form.lastName.setValue(e.target.value)}
          onBlur={() => form.lastName.validate()}
          onFocus={() => form.lastName.clearError()}
          error={form.lastName.error}
        />
        {/* State Dropdown: On change, fetch corresponding cities */}
        <Dropdown
          label={"State"}
          options={states.map((s) => s.stateName)}
          value={form.state.value}
          onChange={(value) => {
            form.state.setValueAndValidate(value);
            form.city.setValue(""); // Reset city
            fetchCitiesForState(value);
          }}
          loading={!form.state.value && locationLoading}
          error={form.state.error || locationError}
        />
        {/* City Dropdown: Dynamically populated based on chosen state */}

        <Dropdown
          label={"City"}
          options={(cities[form.state.value] || []).map((c) => c.cityName)}
          value={form.city.value}
          onChange={form.city.setValueAndValidate}
          error={form.city.error}
          disabled={
            locationLoading ||
            !form.state.value ||
            cityHasNoOptions(form.state.value)
          }
          loading={form.state.value && locationLoading}
        />
        {/* Email and Password Inputs */}
        <div className={"signup-form-grid-full"}>
          <TextInput
            placeholder={"johnwick@clickaway.com"}
            label={"Email"}
            type="text"
            value={form.email.value}
            onChange={(e) => form.email.setValue(e.target.value)}
            onBlur={() => form.email.validate()}
            onFocus={() => form.email.clearError()}
            error={form.email.error}
          />
        </div>
        <div className={"signup-form-grid-full"}>
          <TextInput
            placeholder={"●●●●●●●●"}
            label={"Password"}
            type="password"
            value={form.password.value}
            onChange={(e) => form.password.setValue(e.target.value)}
            onBlur={() => form.password.validate()}
            onFocus={() => form.password.clearError()}
            error={form.password.error}
          />
        </div>
        <div className={"signup-form-submit-wrapper"}>
          <button className={"signup-form-submit"} type="submit">
            Continue
          </button>
        </div>
      </form>
      <p className={"signup-form-disclaimer"}>
        By signing up with <b>placerai.devon.dev</b>, you agree to <br /> our{" "}
        <a href={"https://devon.dev"}>
          <b>Privacy Policy</b>
        </a>{" "}
        &amp;{" "}
        <a href={"https://devon.dev"}>
          <b>Terms and Conditions</b>
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
