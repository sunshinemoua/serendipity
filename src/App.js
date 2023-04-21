import { NavLink, BrowserRouter, Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.scss";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Please enter a valid email address"),
});

const NavBar = () => {};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    alert("thanks for signing up!");
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <h1> Sign Up </h1>
          <input {...register("firstName")} placeholder="First Name" />
          <p>{errors.firstName?.message}</p>
          <input {...register("lastName")} placeholder="Last Name" />
          <p>{errors.lastName?.message}</p>
          <input {...register("email")} placeholder="Email" />
          <p>{errors.email?.message}</p>
          <button>Submit</button>
        </label>
      </form>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <h1> serendipity </h1>
      <Form />
    </BrowserRouter>
  );
}

export default App;
