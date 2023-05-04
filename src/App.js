import { NavLink, BrowserRouter, Route, Routes } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { addEntry, deleteEntry, deleteAllEntries } from "./redux/entrySlice";
import { v4 as uuid } from "uuid";
import { addUser, checkUser } from "./redux/usersSlice";

const signUpSchema = yup.object().shape({
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
        <NavLink className="link" to="/sign-in">
          Sign In
        </NavLink>
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

  const onSubmit = (data) => {
    action(data);
    reset();
  };

  return (
    <div className="form-wrapper sign-up">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            <h1> {header} </h1>
            {formSchema === signUpSchema ? (
              <div>
                {" "}
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
              </div>
            ) : (
              <div>
                <input type="text" {...register("email")} placeholder="Email" />
                <p>{errors.email?.message}</p>
                <button>Log In</button>
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

  const action = (data) => {
    dispatch(checkUser(data));
  };

  return (
    <div className="page-wrapper">
      <NavBar />
      <Form header="Sign In" formSchema={signInSchema} action={action} />
    </div>
  );
};

const SignUp = () => {
  const dispatch = useDispatch();

  const action = (data) => {
    dispatch(addUser(data));
  };

  return (
    <div className="page-wrapper">
      <NavBar />
      <Form header="Sign Up" formSchema={signUpSchema} action={action} />
    </div>
  );
};

const Entries = ({ entry, dispatch, deleteHandler, deleteAllHandler }) => {
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
                <button onClick={deleteAllHandler}>Delete All Entries</button>
              )}
            </div>
          </label>
        </form>

        <EntriesList entry={entry} deleteHandler={deleteHandler} />
      </div>
    </div>
  );
};

const PastEntries = ({ entry, deleteHandler, deleteAllHandler }) => {
  return (
    <div className="page-wrapper">
      <NavBar />
      <div className="form-wrapper">
        <h2> All Entries</h2>
        {entry.length > 0 ? (
          <button onClick={deleteAllHandler}>Delete All Entries</button>
        ) : (
          <p>No entries yet!</p>
        )}

        <EntriesList entry={entry} deleteHandler={deleteHandler} />
      </div>
    </div>
  );
};

const EntriesList = ({ entry, deleteHandler }) => {
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

const Home = ({ entry, dispatch, deleteHandler, deleteAllHandler }) => {
  return (
    <div className="page-wrapper">
      <NavBar />
      <Entries
        entry={entry}
        dispatch={dispatch}
        deleteHandler={deleteHandler}
        deleteAllHandler={deleteAllHandler}
      />
    </div>
  );
};

function App() {
  const entry = useSelector((state) => state.entry.entries);
  const user = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  const deleteHandler = (id) => {
    const entryCopy = [...entry, id];
    const filteredEntries = entryCopy.filter((item) => item !== id);
    dispatch(deleteEntry(filteredEntries));
  };

  const deleteAllHandler = () => {
    dispatch(deleteAllEntries());
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              entry={entry}
              dispatch={dispatch}
              deleteHandler={deleteHandler}
              deleteAllHandler={deleteAllHandler}
            />
          }
        />
        <Route
          path="/my-entries"
          element={
            <PastEntries
              entry={entry}
              deleteHandler={deleteHandler}
              deleteAllHandler={deleteAllHandler}
            />
          }
        />
        <Route
          path="/sign-up"
          element={<SignUp user={user} dispatch={dispatch} />}
        />
        <Route path="sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
