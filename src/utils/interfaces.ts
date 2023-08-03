export interface ToDoType extends ToDoTypeNoId {
  id: number;
}

export interface ToDoTypeNoId {
  dueDate: string;
  creationDate: string;
  completed: boolean;
  title: string;
}
