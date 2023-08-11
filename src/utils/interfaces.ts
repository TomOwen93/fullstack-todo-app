export interface ToDoType extends ToDoTypeNoId {
  id: number;
}

export interface ToDoTypeNoId {
  duedate: string;
  creationdate: string;
  completed: boolean;
  title: string;
}
