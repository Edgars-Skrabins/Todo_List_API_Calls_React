import {TaskProps} from "../App.tsx";

const TaskCard = ({id,name,description,createdAt,onEdit,onDelete}:TaskProps) => {
    return (
        <div className="tasks__task">
            <div className="tasks__task-thumbnail-wrapper">
                <img src="./public/target.png" className="tasks__task-thumbnail"/>
            </div>
            <div className="tasks__task-name-wrapper">
                <h2 className="tasks__task-name"> {name} </h2>
            </div>
            <div className="tasks__task-description-wrapper">
                <p className="tasks__task-description"> {description} </p>
            </div>
            <div className="tasks__task-createdat-wrapper">
                <p className="tasks__task-createdat">Created at: {createdAt} </p>
            </div>
            <div className="row-buttons">
                <button className="button row-buttons-button" onClick={() => onEdit(id)}> Edit </button>
                <button className="button row-buttons-button" onClick={() => onDelete(id)} > Delete </button>
            </div>
        </div>
    )
}

export default TaskCard;