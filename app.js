const todo = {
	todos: [],
	input:       document.querySelector("#new_todo"),
	mainContent: document.querySelector("#main-content"),
	show: function(){
		if(localStorage.hasOwnProperty("todos")) {
			this.todos = JSON.parse(localStorage.getItem("todos"));

			if(this.todos.length > 0) {
				this.showMoreOptions();
				this.showTodoList();
				this.showTodoStatus();
			}else {
				if(document.querySelector("#moreOptions")  !== null) this.mainContent.removeChild(document.querySelector("#moreOptions"));
				if(document.querySelector("#todo_section") !== null) this.mainContent.removeChild(document.querySelector("#todo_section"));
				if(document.querySelector("#todosStatus")  !== null) this.mainContent.removeChild(document.querySelector("#todosStatus"));
			}
			
		} else {
			if(document.querySelector("#moreOptions")  !== null) this.mainContent.removeChild(document.querySelector("#moreOptions"));
			if(document.querySelector("#todo_section") !== null) this.mainContent.removeChild(document.querySelector("#todo_section"));
			if(document.querySelector("#todosStatus")  !== null) this.mainContent.removeChild(document.querySelector("#todosStatus"));
		}
	},
	create: function(){
		if(this.input.value === "" || this.input.value.length < 4) {
			this.showError(["Input field must be filled or at least 4 characters long"]);
		} else if(!isNaN(this.input.value)){
			this.showError(["Input field must contain a letter signs"]);
		} else {
			if(localStorage.hasOwnProperty("todos")) {
				this.todos = JSON.parse(localStorage.getItem("todos"));
			} else {
				localStorage.setItem("completedTodos", "0");
				localStorage.setItem("uncompletedTodos", "0");
			}

			let text = this.convertText();
			let newTodo = {
				text: text,
				completed: false
			}

			this.todos.push(newTodo);
			localStorage.uncompletedTodos++;
			this.input.value = "";

			localStorage.setItem("todos", JSON.stringify(this.todos));

			this.show();
		}
	},
	edit: function(index) {
		if(document.querySelector(".edit-content") !== null)   this.mainContent.removeChild(document.querySelector(".edit-content"));
		if(document.querySelector(".remove-content") !== null) this.mainContent.removeChild(document.querySelector(".remove-content"));

		let editModal = this.createEditModal(index);

		this.mainContent.insertBefore(editModal, document.querySelector("#todo_section"));
		document.querySelector("#edit-input").focus();
	},
	remove: function(index) {
		if(document.querySelector(".remove-content") !== null) this.mainContent.removeChild(document.querySelector(".remove-content"));
		if(document.querySelector(".edit-content") !== null)   this.mainContent.removeChild(document.querySelector(".edit-content"));

		let text = this.todos[index].text;
		let removeModal = this.createRemoveModal(index, text);

		this.mainContent.insertBefore(removeModal, document.querySelector("#todo_section"));
	},
	sort: function() {
		this.todos.sort(function(x, y){
			return x.text > y.text;
		});
		localStorage.setItem("todos", JSON.stringify(this.todos));
		this.show();
	},
	reverse: function() {
		this.todos.sort(function(x, y){
			return x.text > y.text;
		});
		this.todos.reverse();
		localStorage.setItem("todos", JSON.stringify(this.todos));
		this.show();
	},
	toggleCompleted: function(index) {
		this.todos[index].completed = !this.todos[index].completed;

		if(this.todos[index].completed) {
			localStorage.completedTodos++;
			localStorage.uncompletedTodos--
		} else {
			localStorage.completedTodos--;
			localStorage.uncompletedTodos++;
		}

		localStorage.setItem("todos", JSON.stringify(this.todos));
		this.show();
	},
	removeAll: function() {
		this.todos = [];
		localStorage.clear();
		this.show();
	},
	toggleAll(completed = true) {
		for(let i = 0; i < this.todos.length; i++) {
			this.todos[i].completed = completed;
			if(completed) {
				if(localStorage.completedTodos < this.todos.length) {
					localStorage.completedTodos++;
					localStorage.uncompletedTodos--;
				}
			} else {
				if(localStorage.uncompletedTodos < this.todos.length) {
					localStorage.completedTodos--;
					localStorage.uncompletedTodos++;
				}
			}
			
		}
		localStorage.setItem("todos", JSON.stringify(this.todos));
		this.show();
	},
	showMoreOptions: function() {
		if(document.querySelector("#moreOptions") !== null) this.mainContent.removeChild(document.querySelector("#moreOptions"));

		let moreOptions = document.createElement("div");
			moreOptions.setAttribute("id", "moreOptions");
		let checkAll = document.createElement("button");
			checkAll.className   = "check-all-btn option-btn";
			checkAll.textContent = "Check All";
			checkAll.addEventListener("click", function(e){
				todo.toggleAll();
			});
		let uncheckAll = document.createElement("button");
			uncheckAll.className   = "uncheck-all-btn option-btn";
			uncheckAll.textContent = "Uncheck All";
			uncheckAll.addEventListener("click", function(e){ todo.toggleAll(false); });
		let removeAll = document.createElement("button");
			removeAll.className = "remove-all-btn option-btn";
			removeAll.textContent = "Remove All";
			removeAll.addEventListener("click", function(e){ todo.removeAll(); });
		let sort = document.createElement("button");
			sort.className = "sort-btn option-btn";
			sort.textContent = "A-Z";
			sort.addEventListener("click", function(e){ todo.sort(); });
		let reverse = document.createElement("button");
			reverse.className = "reverse-btn option-btn";
			reverse.textContent = "Z-A";
			reverse.addEventListener("click", function(e){ todo.reverse(); });

		moreOptions.appendChild(checkAll);
		moreOptions.appendChild(uncheckAll);
		moreOptions.appendChild(removeAll);
		moreOptions.appendChild(sort);
		moreOptions.appendChild(reverse);

		this.mainContent.appendChild(moreOptions);
	},
	showTodoList: function() {
		if(document.querySelector("#todo_section") !== null) this.mainContent.removeChild(document.querySelector("#todo_section"));

		let ul = this.createUl({id: "todo_section", class: ""});

		this.todos.forEach(function(item, index){
			let li        = todo.createLi({class: "todo-item", value: index}, item);
			let span      = todo.createSpan({class: "todo-text", text: item.text});
			let editBtn   = todo.createButton({class: "todo-edit-btn fas fa-edit", title: "Edit", value: index});
			let removeBtn = todo.createButton({class: "todo-remove-btn fas fa-trash-alt", title: "Remove", value: index});

			li.appendChild(span);
			li.appendChild(removeBtn);
			li.appendChild(editBtn);
			
			ul.appendChild(li);
		});

		this.mainContent.appendChild(ul);
	},
	showTodoStatus: function() {
		if(document.querySelector("#todosStatus") !== null) this.mainContent.removeChild(document.querySelector("#todosStatus"));

		let totalItems = this.todos.length;
		let todosStatus = document.createElement("div");
			todosStatus.setAttribute("id", "todosStatus");
		let p1 = document.createElement("p");
			p1.className = "todos-status-1";
			p1.textContent = `Total todos: ${totalItems}`;
		let p2 = document.createElement("p");
			p2.className = "todos-status-2";
			p2.textContent = `Completed todos: ${localStorage.getItem("completedTodos")}`;
		let p3 = document.createElement("p");
			p3.className = "todos-status-3";
			p3.textContent = `Uncompleted todos: ${localStorage.getItem("uncompletedTodos")}`;

		todosStatus.appendChild(p1);
		todosStatus.appendChild(p2);
		todosStatus.appendChild(p3);
		this.mainContent.appendChild(todosStatus);
	},
	completeEdit: function(i, text) {
		let input = document.querySelector("#edit-input");

		if(text === "") {
			input.classList.add("invalid-edit");
			input.setAttribute("placeholder", "Invalid empty input");
		} else {
			if(input.classList.contains("invalid-edit")) {
				input.classList.remove("invalid-edit");
				input.removeAttribute("placeholder");
			}
			
			this.todos[i].text = text;
			this.mainContent.removeChild(document.querySelector(".edit-content"));
			localStorage.setItem("todos", JSON.stringify(this.todos));
			this.show();
		}
	},
	completeRemove: function(i) {
		if(this.todos[i].completed) {
			localStorage.completedTodos--;
		} else {
			localStorage.uncompletedTodos--;
		}
		this.todos.splice(i, 1);
		this.mainContent.removeChild(document.querySelector(".remove-content"));

		if(this.todos.length > 0) {
			localStorage.setItem("todos", JSON.stringify(this.todos));
		} else {
			localStorage.clear();
		}
		
		this.show();
	},
	closeModal: function(name) {
		this.mainContent.removeChild(document.querySelector(`.${name}`));
	},
	createRemoveModal: function(i, text) {
		let modal = document.createElement("div");
			modal.className = "remove-content";
		let p = document.createElement("p");
		let spanLeft = document.createElement("span");
			spanLeft.className = "remove-todo-title";
			spanLeft.innerHTML = `Are you sure you want to remove <strong>${text}</strong> todo?`;
		let spanRight = document.createElement("span");
			spanRight.setAttribute("id", "remove-todo-close");
			spanRight.setAttribute("title", "Close");
			spanRight.innerHTML = "&times;";
			spanRight.addEventListener("click", function(e){ todo.closeModal("remove-content"); });
		let modalButton = this.createModalButton({id: "completedRemoveBtn", text: "Confirm", title: "Remove"});
			modalButton.addEventListener("click", function(e){ todo.completeRemove(i); });

		p.appendChild(spanLeft);
		p.appendChild(spanRight);

		modal.appendChild(p);
		modal.appendChild(modalButton);

		return modal;
	},
	createEditModal: function(i, func) {
		let modal = document.createElement("div");
			modal.className = "edit-content";
		let p = document.createElement("p");
		let spanLeft = document.createElement("span");
			spanLeft.className = "edit-todo-title";
			spanLeft.textContent = "Edit your todo task";
		let spanRight = document.createElement("span");
			spanRight.setAttribute("id","edit-todo-close");
			spanRight.setAttribute("title", "Close");
			spanRight.innerHTML = "&times;";
			spanRight.addEventListener("click", function(e){ todo.closeModal("edit-content"); });
		let modalInput  = this.createModalInput({type: "text", id: "edit-input", value: this.todos[i].text});
		let modalButton = this.createModalButton({id: "completeEditBtn", text: "Confirm", title: "Edit"});
			modalButton.addEventListener("click", function(e){ todo.completeEdit(i, modalInput.value); });
			modalButton.addEventListener("focus", function(e){
				this.style.backgroundColor = "#006400";
				this.style.color = "#FFF";
			});
			modalButton.addEventListener("blur", function(e){
				this.style = "";
			});

		p.appendChild(spanLeft);
		p.appendChild(spanRight);

		modal.appendChild(p);
		modal.appendChild(modalInput);
		modal.appendChild(modalButton);

		return modal;
	},
	createModalButton: function(param = {}) {
		let modalButton = document.createElement("button");

		if(param.hasOwnProperty("id"))    modalButton.setAttribute("id", param.id);
		if(param.hasOwnProperty("title")) modalButton.setAttribute("title", param.title);
		if(param.hasOwnProperty("class")) modalButton.className = param.class;
		if(param.hasOwnProperty("text"))  modalButton.textContent = param.text;

		return modalButton;
	},
	createModalInput: function(param = {}) {
		let modalInput = document.createElement("input");

		if(param.hasOwnProperty("type"))  modalInput.setAttribute("type", param.type);
		if(param.hasOwnProperty("id"))	  modalInput.setAttribute("id",   param.id);
		if(param.hasOwnProperty("value")) modalInput.setAttribute("value", param.value);
		
		return modalInput;
	},
	createUl: function(param = {}) {
		let ul = document.createElement("ul");

		if(param.hasOwnProperty("id"))    ul.setAttribute("id", param.id);
		if(param.hasOwnProperty("class")) ul.className = param.class;

		return ul;
	},
	createLi: function(param = {}, item) {
		let li = document.createElement("li");

		if(param.hasOwnProperty("id"))    li.setAttribute("id", param.id);
		if(param.hasOwnProperty("value")) li.setAttribute("value", param.value);
		if(param.hasOwnProperty("class")) li.className   = param.class;
		if(param.hasOwnProperty("text"))  li.textContent = param.text;
		if(item.completed)                li.classList.add("completed");

		return li;
	},
	createSpan: function(param = {}) {
		let span = document.createElement("span");

		if(param.hasOwnProperty("id"))    span.setAttribute("id", param.id);
		if(param.hasOwnProperty("class")) span.className = param.class;
		if(param.hasOwnProperty("text"))  span.textContent = param.text;

		return span;
	},
	createButton: function(param = {}) {
		let button = document.createElement("button");

		if(param.hasOwnProperty("id"))    button.setAttribute("id", param.id);
		if(param.hasOwnProperty("title")) button.setAttribute("title", param.title);
		if(param.hasOwnProperty("class")) button.className = param.class;
		if(param.hasOwnProperty("text"))  button.textContent = param.text;

		if(param.hasOwnProperty("title") && param.title === "Edit") {
			button.addEventListener("focus", function(event) {
				this.style.backgroundColor = "#006400";
				this.style.color = "#FFF";
			});
			button.addEventListener("blur", function(event){
				this.style = "";
			});
		} else if(param.hasOwnProperty("title") && param.title === "Remove") {
			button.addEventListener("focus", function(event){
				this.style.backgroundColor = "red";
				this.style.color = "#FFF";
			});
			button.addEventListener("blur", function(event){
				this.style = "";
			});
		}

		return button;
	},
	convertText: function() {
		let firstChar = this.input.value[0];
			firstChar = firstChar.toUpperCase();
		let text = this.input.value.substr(1);
			text = firstChar + text;

		return text;
	},
	showError: function(errors = []) {
		if(errors.length > 0 && document.querySelector(".errors") === null) {
			let errorContent = document.createElement("div");
			errorContent.classList.add("errors");

			errors.forEach(function(error){
				let p = document.createElement("p");
					p.textContent = error;
				errorContent.appendChild(p);
			});

			if(this.mainContent.children.length > 0) {
				this.mainContent.insertBefore(errorContent, this.mainContent.children[0]);
			} else {
				this.mainContent.appendChild(errorContent);
			}

			setTimeout(function(){ todo.mainContent.removeChild(errorContent); }, 4000);
		}
	}
};
// Add new todo, focus and blur on todo input
document.querySelector("#add").addEventListener("click", function(event){
	todo.create();
	todo.input.focus();
});
document.querySelector("#add").addEventListener("focus", function(event){
	this.style.backgroundColor = "orange";
});
document.querySelector("#add").addEventListener("blur", function(event){
	this.style = "";
});
// Complete edit or remove todo
document.querySelector("#new_todo").addEventListener("focus", function(event){
	if(document.querySelector(".edit-content") !== null)   todo.mainContent.removeChild(document.querySelector(".edit-content"));
	if(document.querySelector(".remove-content") !== null) todo.mainContent.removeChild(document.querySelector(".remove-content"));
	this.style.borderBottomColor = "orange";
});
document.querySelector("#new_todo").addEventListener("blur", function(event){
	this.style.borderBottomColor = "#333";
});
// Todo toggle completed, edit and remove modal
document.querySelector("#main-content").addEventListener("click", function(event){
	let position;

	if(event.target.classList.contains("todo-text")) {
		position = Number(event.target.parentElement.value);
		todo.toggleCompleted(position);
	}
	if(event.target.classList.contains("todo-item")) {
		position = Number(event.target.value);
		todo.toggleCompleted(position);
	}
	if(event.target.classList.contains("todo-edit-btn")) {
		position = Number(event.target.parentElement.value);
		todo.edit(position);
	}
	if(event.target.classList.contains("todo-remove-btn")) {
		position = Number(event.target.parentElement.value);
		todo.remove(position);
	}
});
// Display output
todo.show();