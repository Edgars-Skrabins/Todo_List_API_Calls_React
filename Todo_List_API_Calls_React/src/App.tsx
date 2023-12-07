import React, {useState} from 'react'
import axios from "axios";
import './App.css'

import CreateTaskDialog from "./components/createTaskDialog.tsx";
import TaskCard from "./components/taskCard.tsx";
import EditDialog from "./components/editDialog.tsx";

export type EditDialogProps = {
    id: number,
    name: string,
    description: string,

    onNameInput: (name: string) => void;
    onDescriptionInput: (name: string) => void;

    onEditCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onEditConfirm: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
}

export type CreateTaskProps = {
    onCreateBtnClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onNameInput: (name: string) => void;
    onDescriptionInput: (name: string) => void;
}

export type TaskProps = {
    id: number,
    name: string,
    description: string,
    createdAt: string,

    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

type Task = {
    id: number,
    name: string,
    description: string,
    createdAt: string,
}

function App() {

    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [editDialogs, setEditDialogs] = useState<EditDialogProps[]>([]);

    const [createTaskName, setCreateTaskName] = useState('');
    const [createTaskDescription, setCreateTaskDescription] = useState('');

    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');

    const [hasLoadedDB, setHasLoadedDB] = useState(false);

    const getCurrentDate = (): string => {
        const timeStamp = Date.now();
        const date = new Date(timeStamp);
        return date.toLocaleString();
    }

    const initializeDbTasks = () => {
        axios.get("http://localhost:3004/tasks")
            .then(response => {
                const dbTasks: Task[] = response.data;
                dbTasks.forEach((e) => {
                    const newTask: TaskProps = {
                        id: e.id,
                        name: e.name,
                        description: e.description,
                        createdAt: getCurrentDate(),
                        onEdit: () => editTask(e.id),
                        onDelete: () => deleteTask(e.id),
                    };

                    const newTasks = [...tasks, newTask];
                    setTasks(prevTasks => [...prevTasks, ...newTasks]);
                });
            })
            .catch(error => {
                console.error("Error:", error);
            });
    };

    if (!hasLoadedDB) {
        initializeDbTasks();
        setHasLoadedDB(true)
    }

    const createTask = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const newId = Date.now();

        const newTask: TaskProps = {
            id: newId,
            name: createTaskName,
            description: createTaskDescription,
            createdAt: getCurrentDate(),
            onEdit: () => editTask(newTask.id),
            onDelete: () => deleteTask(newTask.id),
        };

        saveToDB(newTask);

        const clonedTaskArr = [...tasks, newTask]
        setTasks(clonedTaskArr);
    };

    const saveToDB = (task: TaskProps) => {

        const apiUrl = `http://localhost:3004/tasks/`

        axios.post(apiUrl, {
            name: task.name,
            description: task.description,
            createdAt: task.createdAt,
            id: task.id,
        })
            .then(response => {
                console.log("Task saved", response.data);
            })
            .catch(error => {
                console.log("Error saving task", error);
            })
    }

    const updateToDB = (id: number) => {
        const apiUrl= `http://localhost:3004/tasks/${id}`

        let taskToSave = [...tasks];
        taskToSave = taskToSave.filter(task => task.id === id);

        axios.put(apiUrl, {
            name: editTaskName,
            description: editTaskDescription,
            createdAt: taskToSave[0].createdAt,
            id: taskToSave[0].id,
        })
            .then(response => {
                console.log("Task updated", response.data);
            })
            .catch(error => {
                console.log("Error updating task", error);
            })

    }

    const refreshBtnEvents = () => {
        let clonedTaskArr: TaskProps[] = [...tasks];
        clonedTaskArr.forEach((e) => {
            e.onEdit = () => editTask(e.id);
        })
    }
    refreshBtnEvents();

    const deleteFromDB = (id: number) => {

        const apiUrl = `http://localhost:3004/tasks/${id}`

        axios.delete(apiUrl)
            .then(response => {
                console.log("Task deleted", response.data);
            })
            .catch(error => {
                console.log("Error deleting task", error);
            })
    }

    const editTask = (id: number) => {
        setEditDialogs([]);

        let clonedTaskArr = [...tasks];
        clonedTaskArr = clonedTaskArr.filter(task => task.id === id);

        const task: TaskProps = clonedTaskArr[0];

        if (clonedTaskArr.length === 0) return;

        const newEditDialog: EditDialogProps = {
            id: task.id,
            name: task.name,
            description: task.description,

            onNameInput: setEditTaskName,
            onDescriptionInput: setEditTaskDescription,

            onEditCancel: onEditCancel,
            onEditConfirm: onEditConfirm,
        }

        const newEditDialogArr: EditDialogProps[] = [newEditDialog];

        setEditDialogs(newEditDialogArr);
    }

    const onEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setEditDialogs([]);
    }

    const onEditConfirm = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.preventDefault();

        setTasks(prevTasks =>
            prevTasks.map(task => task.id === id ?
                {...task, name: editTaskName, description: editTaskDescription} : task));



        updateToDB(id);

        setEditDialogs([]);
    }

    const refreshEditEvents = () => {
        let clonedEditDialogArr: EditDialogProps[] = [...editDialogs];
        clonedEditDialogArr.forEach((e) => {
            e.onEditConfirm = onEditConfirm;
        })
    }
    refreshEditEvents();

    const deleteTask = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));

        deleteFromDB(id)
    }

    return (
        <>
            <section>
                {editDialogs.map(({id, name, description, onEditCancel, onEditConfirm,onNameInput,onDescriptionInput}) => (
                    <EditDialog
                        key={id}
                        id={id}
                        name={name}
                        description={description}
                        onEditCancel={onEditCancel}
                        onEditConfirm={onEditConfirm}
                        onNameInput={onNameInput}
                        onDescriptionInput={onDescriptionInput}
                    />
                ))}
            </section>

            <section>
                <div className="container">
                    <CreateTaskDialog onCreateBtnClick={createTask}
                                      onNameInput={setCreateTaskName}
                                      onDescriptionInput={setCreateTaskDescription}/>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="tasks">
                        {tasks.map(({id, name, description, createdAt, onEdit, onDelete}) => (
                            <TaskCard key={id}
                                      id={id}
                                      name={name}
                                      description={description}
                                      createdAt={createdAt}
                                      onEdit={onEdit}
                                      onDelete={onDelete}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default App;