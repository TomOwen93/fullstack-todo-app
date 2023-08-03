import { ToDoType } from "./utils/interfaces";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import moment from "moment";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "./utils/api";

interface ListProps {
  listData: ToDoType[];
  handleCompleted: (element: ToDoType) => void;
  handleChangeDelete: (element: ToDoType) => void;
  handleChangeExisting: (key: string, value: string, element: ToDoType) => void;
}

export default function List({
  listData,
  handleCompleted,
  handleChangeDelete,
  handleChangeExisting,
}: ListProps): JSX.Element {
  const handleChangeCompleted = (element: ToDoType) => {
    handleCompleted(element);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [animationParent] = useAutoAnimate();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    element: ToDoType
  ) => {
    if (e.key === "Enter") {
      axios.patch(`${baseUrl}/to-dos/${element.id}`, { title: element.title });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    element: ToDoType
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    handleChangeExisting(key, value, element);
    // setEditedKeyValue({[key]:value})
  };

  return (
    <>
      <div className="list-table">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Due Date</th>
              <th>Creation Date</th>
              <th>Done?</th>
              <th>Delete?</th>
            </tr>
          </thead>

          <tbody ref={animationParent}>
            {listData.map((element, index) => (
              <tr key={element.id}>
                <td>
                  {isEditing ? (
                    <input
                      name="title"
                      value={element.title}
                      onKeyDown={(e) => handleKeyDown(e, element)}
                      onChange={(e) => handleInputChange(e, element)}
                    ></input>
                  ) : (
                    <div onClick={() => setIsEditing(true)}>
                      {element.title}
                    </div>
                  )}
                </td>
                <td>
                  {moment(new Date(element.dueDate)).format("DD/MM/YYYY")}
                </td>
                <td>
                  {moment(new Date(element.creationDate)).format("DD/MM/YYYY")}
                </td>
                <td>
                  <>
                    {element.completed === true ? (
                      <select onChange={() => handleChangeCompleted(element)}>
                        <option>Done</option>
                        <option value="In Progress" defaultValue="In Progress">
                          In Progress
                        </option>
                      </select>
                    ) : (
                      <select onChange={() => handleChangeCompleted(element)}>
                        <option>In Progress</option>
                        <option value="Done" defaultValue="Done">
                          Done
                        </option>
                      </select>
                    )}
                  </>
                </td>
                <td>
                  <button onClick={() => handleChangeDelete(element)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
