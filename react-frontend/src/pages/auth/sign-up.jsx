import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../slices/auth/registerSlice";
import {
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    zip_code: "",
    is_superadmin: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required.";
    if (!formData.last_name) newErrors.last_name = "Last name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required.";
    } else if (!/^\+?\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number is invalid.";
    }
    if (!formData.zip_code) newErrors.zip_code = "Zip code is required.";
    if (!formData.is_superadmin)
      newErrors.is_superadmin = "Please select an option.";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must accept the terms and conditions.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    dispatch(register(formData));
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Background"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Join Us Today
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Fill in the details to register.
          </Typography>
          <Link to="/auth/sign-in" className="text-gray-900 ml-1">
            Sign in
          </Link>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col gap-4">
            <Input
              size="lg"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={Boolean(errors.first_name)}
            />
            {errors.first_name && <Typography color="red">{errors.first_name}</Typography>}

            <Input
              size="lg"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={Boolean(errors.last_name)}
            />
            {errors.last_name && <Typography color="red">{errors.last_name}</Typography>}

            <Input
              size="lg"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
            />
            {errors.email && <Typography color="red">{errors.email}</Typography>}

            <Input
              size="lg"
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              error={Boolean(errors.phone_number)}
            />
            {errors.phone_number && <Typography color="red">{errors.phone_number}</Typography>}

            <Input
              size="lg"
              label="Zip Code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              error={Boolean(errors.zip_code)}
            />
            {errors.zip_code && <Typography color="red">{errors.zip_code}</Typography>}

            <Select
              label="Is Super Admin"
              name="is_superadmin"
              value={formData.is_superadmin}
              onChange={(value) =>
                setFormData({ ...formData, is_superadmin: value })
              }
            >
              <Option value="1">Yes</Option>
              <Option value="0">No</Option>
            </Select>
            {errors.is_superadmin && <Typography color="red">{errors.is_superadmin}</Typography>}
          </div>

          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            containerProps={{ className: "-ml-2.5" }}
          />
          {errors.termsAccepted && (
            <Typography color="red">{errors.termsAccepted}</Typography>
          )}

          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
