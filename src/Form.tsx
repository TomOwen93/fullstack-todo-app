import { ToDoType } from "./utils/interfaces";

interface FormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toSubmit: ToDoType;
}

export default function Form({
  handleSubmit,
  toSubmit,
  handleChange,
}: FormProps): JSX.Element {
  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <label>Description:</label>
        <input
          name="title"
          onChange={handleChange}
          value={toSubmit.title || ""}
        ></input>

        <label>Due Date:</label>

        <input
          name="dueDate"
          type="date"
          placeholder="dd-mm-yyyy"
          min={"2023-01-01"}
          max="2030-12-31"
          onChange={handleChange}
          value={toSubmit.dueDate || ""}
        ></input>

        <button>Submit</button>
      </form>
    </>
  );
}
