// ------------------- open add ----------------
let openAdd = document.querySelector('.add-header');
let add = document.querySelector('.add')

openAdd.onclick = () => {
    add.classList.toggle('max-height1')
}

class TodoList {
    todoList = [
        {
            note_id: 'note1',
            note_title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            note_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit sapien diam, a varius tortor gravida vel. Sed auctor massa felis, quis pulvinar nisl feugiat commodo.'
        },
        {
            note_id: 'note2',
            note_title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            note_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit sapien diam, a varius tortor gravida vel. Sed auctor massa felis, quis pulvinar nisl feugiat commodo.'
        },
        {
            note_id: 'note3',
            note_title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            note_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit sapien diam, a varius tortor gravida vel. Sed auctor massa felis, quis pulvinar nisl feugiat commodo.'
        },
        {
            note_id: 'note 4',
            note_title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            note_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam hendrerit sapien diam, a varius tortor gravida vel. Sed auctor massa felis, quis pulvinar nisl feugiat commodo.'
        },
    ]

    creatItem(item) {
        let itemContent = `
            <div class="col-md-6">
                <div class="note">
                    <div class="note-title">
                        <div class="note-check" id="${item.note_id}">
                            <input class="note-check-input" type="checkbox" value="">
                            <label class="note-check-label" for="defaultCheck1">
                                ${item.note_title}
                            </label>
                        </div>
                        <div class="note-control">
                            <button class="note-title__btn" type="button">
                                <i class="far fa-plus-square"></i>
                            </button>
                            <button class="note-delete note-title__btn" type="button">
                                <i class=" fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="note-content">
                        <p>
                            ${item.note_content} 
                        </p>
                    </div>
                </div>
            </div>
            `    
        return itemContent;
    }

    render(){
        let renderElement = document.getElementById('list-notes')
        this.todoList.map((item) => {
            renderElement.innerHTML += this.creatItem(item);
        })
    }
}   
var todo = new TodoList;
todo.render();