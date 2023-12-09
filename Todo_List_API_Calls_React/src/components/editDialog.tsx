import {EditDialogProps} from "../App.tsx";

const EditDialog = ({id, name, description, onEditCancel, onEditConfirm, onNameInput, onDescriptionInput}: EditDialogProps) => {
    return (
        <div className="edit-dialog-container">
            <form className="header__form">
                <label
                    htmlFor="js-edit-taskname"> Task Name </label>
                <input
                    maxLength={20}
                    type="text"
                    className="header__input-text-name input"
                    id="js-edit-taskname"
                    defaultValue={name}
                    onChange={(e) => onNameInput(e.currentTarget.value)}
                />

                <label htmlFor="js-edit-taskdescription"> Task Description </label>

                <textarea
                    maxLength={150}
                    className="header__input-text-description input"
                    id="js-edit-taskdescription"
                    defaultValue={description}
                    onChange={(e) => onDescriptionInput(e.currentTarget.value)}
                >

                </textarea>

                <div className="row-buttons">
                    <button
                        className="button header__btn"
                        onClick={onEditCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="button header__btn"
                        onClick={(e) => onEditConfirm(e, id)}
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditDialog;