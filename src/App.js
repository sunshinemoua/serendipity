import { useState } from "react";

import {
  NavLink,
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { addEntry, deleteEntry, deleteAllEntries } from "./redux/entrySlice";
import { v4 as uuid } from "uuid";
import { addUser, checkUser, deleteAllUsers, logOut } from "./redux/usersSlice";

const createAccountSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address"),
});

const signInSchema = yup.object().shape({
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
  const dispatch = useDispatch();
  const verified = useSelector((state) => state.user.verifiedUsers);

  return (
    <div className="navbar-wrapper">
      <h1> Serendipity</h1>
      <div className="nav-inner-div">
        {!verified && (
          <NavLink className="link" to="/sign-in">
            Sign In
          </NavLink>
        )}
        {verified && (
          <div className="navlinks">
            <NavLink className="link" to="/">
              Home
            </NavLink>

            <NavLink className="link" to="/my-entries">
              My Entries
            </NavLink>
            <button className="logout-btn" onClick={() => dispatch(logOut())}>
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
const Form = ({ header, formSchema, action }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    action(data);
    navigate("/", { replace: true });
    reset();
  };

  return (
    <div className="form-page-outermost-div">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`${
            header == "Sign Up" ? "form-wrapper " : "form-wrapper-login"
          }`}
        >
          <h1> {header} </h1>

          <label>
            {formSchema === createAccountSchema ? (
              <div className="form-inputs-wrapper">
                <input
                  type="text"
                  {...register("firstName")}
                  placeholder="First Name"
                />
                <p>{errors.firstName?.message}</p>
                <input
                  type="text"
                  {...register("lastName")}
                  placeholder="Last Name"
                />
                <p>{errors.lastName?.message}</p>
                <input type="text" {...register("email")} placeholder="Email" />
                <p>{errors.email?.message}</p>
                <button>Submit</button>
                <div className="sign-up-link-wrapper">
                  Already have an account?
                  <NavLink className="link" to="/sign-in">
                    Log In
                  </NavLink>
                </div>
              </div>
            ) : (
              <div className="form-inputs-wrapper">
                <input type="text" {...register("email")} placeholder="Email" />
                <p>{errors.email?.message}</p>
                <button>Log In</button>
                <div className="sign-up-link-wrapper">
                  Don't have an account?
                  <NavLink className="link" to="/create-account">
                    Sign Up
                  </NavLink>
                </div>
              </div>
            )}
          </label>
        </div>
      </form>
    </div>
  );
};

const SignIn = () => {
  const dispatch = useDispatch();
  const verifiedUser = useSelector((state) => state.user.verifiedUsers);

  const action = (data) => {
    dispatch(checkUser(data));
  };

  return (
    <div className="page-wrapper">
      <NavBar />
      <Form header="Welcome Back!!" formSchema={signInSchema} action={action} />
    </div>
  );
};

const CreateAccount = () => {
  const dispatch = useDispatch();
  const verified = useSelector((state) => state.user.verifiedUsers);

  const action = (data) => {
    dispatch(addUser(data));
  };

  return (
    <div className="page-wrapper">
      <NavBar />
      <Form header="Sign Up" formSchema={createAccountSchema} action={action} />

      <button onClick={() => dispatch(deleteAllUsers())}>
        Delete All Users
      </button>
    </div>
  );
};

const Entries = () => {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.entry.entries);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(entrySchema),
  });

  const onSubmit = (data) => {
    data.id = uuid();
    dispatch(addEntry(data));
    reset();
  };

  return (
    <div className="page-wrapper">
      <div className="form-page-outermost-div">
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
              <div className="btn-wrapper">
                <button>Add</button>
                {entry.length > 0 && (
                  <button onClick={() => dispatch(deleteAllEntries())}>
                    Delete All Entries
                  </button>
                )}
              </div>
            </label>
          </form>

          <EntriesList />
        </div>
      </div>
    </div>
  );
};

const PastEntries = () => {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.entry.entries);

  return (
    <div className="page-wrapper">
      <NavBar />
      <div className="form-page-outermost-div">
        <div className="form-wrapper">
          <h2> All Entries</h2>
          {entry.length > 0 ? (
            <button onClick={() => dispatch(deleteAllEntries())}>
              Delete All Entries
            </button>
          ) : (
            <p>No entries yet!</p>
          )}

          <EntriesList entry={entry} />
        </div>
      </div>
    </div>
  );
};

const EntriesList = () => {
  const dispatch = useDispatch();
  const entry = useSelector((state) => state.entry.entries);

  const deleteHandler = (id) => {
    const entryCopy = [...entry, id];
    const filteredEntries = entryCopy.filter((item) => item !== id);
    dispatch(deleteEntry(filteredEntries));
  };

  const mappedEntries = entry.map((item) => {
    return (
      <div key={item.id}>
        <div className="item-wrapper">
          <li>
            I'm feeling <span>{item.feeling}</span> because . . .
            <p>{item.entry}</p>
          </li>
          {deleteHandler !== null && (
            <button className="delete-btn" onClick={() => deleteHandler(item)}>
              Delete
            </button>
          )}
        </div>
      </div>
    );
  });

  return <div>{mappedEntries}</div>;
};

const Home = () => {
  return (
    <div className="page-wrapper">
      <NavBar />
      <Entries />
    </div>
  );
};

const PrivateRoutes = () => {
  const verifiedUser = useSelector((state) => state.user.verifiedUsers);

  const isVerified = verifiedUser;

  return isVerified ? <Outlet /> : <Navigate to="/sign-in" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/my-entries" element={<PastEntries />} />
        </Route>

        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
