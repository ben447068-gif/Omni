// Omni AI Assistant Chat
document.getElementById('send-message').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === '') {
        alert('Please enter a message.');
        return;
    }

    // Display user message
    const messagesDiv = document.getElementById('messages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.textContent = `You: ${userInput}`;
    messagesDiv.appendChild(userMessageDiv);

    // Send user message to the backend
    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();

    if (data.reply) {
        // Display AI response
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.classList.add('ai-message');
        aiMessageDiv.textContent = `Omni: ${data.reply}`;
        messagesDiv.appendChild(aiMessageDiv);

        // Clear input field
        document.getElementById('user-input').value = '';
    } else {
        alert('Error processing your request.');
    }
});

// Image Generation
document.getElementById('generate-image').addEventListener('click', async () => {
    const prompt = document.getElementById('image-prompt').value;

    if (prompt.trim() === '') {
        alert('Please provide a description for the image.');
        return;
    }

    const response = await fetch('/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();

    if (data.imageUrl) {
        // Display the generated image
        const imageContainer = document.getElementById('generated-image-container');
        imageContainer.classList.remove('hidden');
        document.getElementById('generated-image').src = data.imageUrl;
    } else {
        alert('Error generating image. Please try again.');
    }
});

// Task Management
document.getElementById('add-task').addEventListener('click', async () => {
    const taskInput = document.getElementById('task-input').value;

    if (taskInput.trim() === '') {
        alert('Please enter a task.');
        return;
    }

    // Send task to backend
    const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput })
    });

    const data = await response.json();

    // Update task list
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    data.tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        taskList.appendChild(li);
    });

    document.getElementById('task-input').value = ''; // Clear input field
});
