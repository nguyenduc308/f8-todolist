const CONFIG = {
    parent: {
        selector: "#todo-list",
    },
    item: {
        element: "div",
        selector: ".todo-item",
        attrs: {
            class: "todo-item"
        }
    }
}
class Storage {
    state = {
        items: [],
        currentItem: null
    }
    storageKey;
    constructor(storageKey = "TODO_TODAY") {
        this.storageKey = storageKey;
        this.state = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    }
    get items() {
        return this.state.items;
    }
    get currentItem() {
        return this.state.currentItem;
    }
    addItem(item) {
        let { items = [] } = this.state;
        this.state = {...this.state, items: [item,...items]};
        this.saved();
        return item;
    }
    itemIndex(id) {
        return this.state.item.findIndex(item => item.id === id)
    }
    saved() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    }
}
const storage = new Storage("TODO_DATA");

class TodoItem {
    id; name; status; level; timestamp;
    constructor(name, level = 1) {
        this.id = this.UID();
        this.name = name;
        this.level = level;
        this.timestamp = new Date();
    }
    UID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

}

class TodoList {
    config;
    listElement;
    constructor(config = {}) {
        this.config = config;
        this.listElement = document.querySelector(this.config.parent.selector);
    }
    

    addTask(name, level) {
        const task = new TodoItem(name, level);
        storage.addItem(task);
        const itemElement = this.createItemElement(task);
        this.listElement.appendChild(itemElement);
    }
    deleteTask(id) {
        const index = storage.itemIndex(id);
        console.log(index)
    }
    createItemElement(item) {
        let nodeItem = document.createElement(this.config.item.element);
        const attrs = this.config.item.attrs;
        const attrsKey = Object.keys(attrs)
        attrsKey.forEach(attr => {
            nodeItem.setAttribute(`${attr}`, `${attrs[attr]}`);
        } )
        const itemContent = `
            <div class="todo-item__content">
                ${item.name}
            </div>
            `
        nodeItem.innerHTML = itemContent;
        return nodeItem;
    }
}
const todoList = new TodoList(CONFIG);

document.querySelector('#task-name').addEventListener('keyup', function(e) {
    if(e.keyCode === 13) {
        todoList.addTask(this.value);
        this.value = "";
    }
})