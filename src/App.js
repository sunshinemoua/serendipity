import { NavLink, BrowserRouter, Route, Routes } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "./redux/entrySlice";

const signUpSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address"),
});

const entrySchema = yup.object().shape({
  date: yup
    .date()
    .max(new Date(), "Cannot use future date!")
    .required("Please enter a valid date"),
  feeling: yup.string().required("Please enter your feeling"),
  entry: yup.string().required("Please enter an entry"),
});

const NavBar = () => {
  return (
    <div className="navbar-wrapper">
      <h1> Serendipity</h1>
      <div className="navlinks">
        <NavLink className="link" to="/">
          Home
        </NavLink>
        <NavLink className="link" to="/my-entries">
          My Entries
        </NavLink>
        <NavLink className="link" to="/sign-up">
          Sign Up
        </NavLink>
      </div>
    </div>
  );
};

const Entries = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(entrySchema),
  });

  const entry = useSelector((state) => state.entries);
  const dispatch = useDispatch();

  const onSubmit = (data, event) => {
    dispatch(addEntry(data));
    console.log(data);
    alert("thanks for submitting");
    event.target.reset();
  };
  console.log(entry);

  return (
    <div className="page-wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            <h2>What's on your mind?</h2>
            <input type="date" {...register("date")} placeholder="Date" />
            <p>{errors.date?.message}</p>
            <input
              type="text"
              {...register("feeling")}
              placeholder="How are you feeling?"
            />
            <p>{errors.feeling?.message}</p>
            <textarea
              type="text"
              {...register("entry")}
              placeholder="Say something..."
              rows="10"
            />
            <p>{errors.entry?.message}</p>
            <button>Add</button>
          </label>
        </form>
      </div>
    </div>
  );
};

const PastEntries = () => {
  return (
    <div className="page-wrapper">
      <NavBar />
      PAST ENTRIES
    </div>
  );
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = (data, event) => {
    console.log(data);
    event.target.reset();
    alert("thanks for signing up!");
  };

  return (
    <div className="page-wrapper">
      <NavBar />
      <div className="form-wrapper sign-up">
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
    </div>
  );
};

const Home = () => {
  return (
    <div className="page-wrapper">
      <NavBar />
      <Entries />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-entries" element={<PastEntries />} />
        <Route path="/sign-up" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
