document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const list = document.getElementById('task-list');

    // Função para buscar todas as tarefas do servidor
    async function fetchTasks() {
        const response = await fetch('http://3.15.223.200:3000/tasks');
        const tasks = await response.json();
        list.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.name;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.className = 'delete-btn';

            li.appendChild(checkbox);
            li.appendChild(taskSpan);
            li.appendChild(deleteBtn);
            list.appendChild(li);

            if (task.completed) {
                li.classList.add('completed');
            } else {
                li.classList.add('pending');
            }

            checkbox.addEventListener('change', async () => {
                await updateTask(task.id, { completed: checkbox.checked });
                await fetchTasks();
            });

            deleteBtn.addEventListener('click', async () => {
                await deleteTask(task.id);
                await fetchTasks();
            });
        });
    }

    // Evento para adicionar nova tarefa
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText !== '') {
            await addTask({ name: taskText, completed: false });
            input.value = '';
            await fetchTasks();
        }
    });

    // Função para adicionar nova tarefa
    async function addTask(task) {
        const response = await fetch('http://3.15.223.200:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        return response.json();
    }

    // Função para atualizar uma tarefa
    async function updateTask(id, updates) {
        const response = await fetch(`http://3.15.223.200:3000/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        return response.json();
    }

    // Função para deletar uma tarefa
    async function deleteTask(id) {
        const response = await fetch(`http://3.15.223.200:3000/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }

    // Buscar todas as tarefas ao carregar a página
    fetchTasks();
});
