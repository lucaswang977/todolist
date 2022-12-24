export type TodoTask = {
  id: string;
  name: string;
  completed: boolean;
};

export interface InputFormProps {
  taskAddHandler: (value: string) => void;
}

export interface TaskListProps {
  taskList: TodoTask[];
  toggleTaskHandler: (taskId: string, checked: boolean) => void;
  modifyTaskHandler: (taskId: string, name: string) => void;
  deleteTaskHandler: (taskId: string) => void;
  reorderTaskHandler: (taskList: TodoTask[]) => void;
  reorderTaskCompleteHandler: () => void;
}

export type Action =
  | {
      type: 'TASK_ADD';
      payload: {
        name: string;
      };
    }
  | {
      type: 'TASK_MODIFY';
      payload: {
        taskId: string;
        name: string;
      };
    }
  | {
      type: 'TASK_TOGGLE';
      payload: {
        taskId: string;
        checked: boolean;
      };
    }
  | {
      type: 'TASK_DELETE';
      payload: {
        taskId: string;
      };
    }
  | {
      type: 'TASK_REORDER';
      payload: {
        newTasks: TodoTask[];
      };
    }
  | {
      type: 'TASK_SAVE';
      payload: {
        saveHandler: (arg: TodoTask[]) => void;
      };
    };
