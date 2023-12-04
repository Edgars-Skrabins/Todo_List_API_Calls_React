import {CreateTaskProps} from "../App.tsx";

const CreateTaskDialog = ({onCreateBtnClick,onNameInput,onDescriptionInput}: CreateTaskProps) => {
    return (
        <div className="header">
            <h1 className="header__header-text">TODO LIST</h1>
            <form className="header__form">
                <label htmlFor="input-text-name"> Task Name </label>
                <input maxLength={20}
                       type="text"
                       className="header__input-text-name input" id="input-text-name"
                       onChange={(e) => onNameInput(e.currentTarget.value)}/>

                <label htmlFor="input-text-description"> Task Description </label>
                <textarea maxLength={150}
                          className="header__input-text-description input"
                          id="input-text-description"
                          onChange={(e) => onDescriptionInput(e.currentTarget.value)}>
                </textarea>

                <button className="button header__btn"
                        onClick={onCreateBtnClick}> Create Task </button>
            </form>
        </div>
    )
}

export default CreateTaskDialog;