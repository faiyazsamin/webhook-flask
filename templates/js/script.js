document.addEventListener("DOMContentLoaded", function() {
	const urlParams = new URLSearchParams(window.location.search);
	const user = urlParams.get('user');
	fetchRequests(user);
});

// function fetchRequests() {
//     fetch('/get_requests')
//         .then(response => response.json())
//         .then(data => {
//             const sidebar = document.getElementById('sidebar');
//             sidebar.innerHTML = '';
//             data.forEach(request => {
//                 const div = document.createElement('div');
//                 div.textContent = `${request.method} ${request.timestamp}`;
//                 div.onclick = () => {
//                     document.querySelectorAll('#sidebar div').forEach(el => el.classList.remove('active'));
//                     div.classList.add('active');
//                     fetchRequestDetails(request.id);
//                 };
//                 sidebar.appendChild(div);
//             });
//         });
// }

function fetchRequests(user) {
	if (user == null) {
		user = '';
	}
	fetch('/get_requests/' + user)
		.then(response => response.json())
		.then(data => {
			const sidebar = document.getElementById('sidebar');
			sidebar.innerHTML = '';
			for (let i = data.length - 1; i >= 0; i--) {
				const request = data[i];
				const div = document.createElement('div');
				div.innerHTML = `<span class="method">${request.method}</span> ${request.timestamp}`;
				document.body.appendChild(div);
				div.onclick = () => {
					document.querySelectorAll('#sidebar div').forEach(el => el.classList.remove('active'));
					div.classList.add('active');
					fetchRequestDetails(request.id);
				};
				sidebar.appendChild(div);
			}
			const delete_button = document.createElement('div');
			delete_button.innerHTML = `<button id="delete" class="delete">Clear All Data</button>`;
			sidebar.appendChild(delete_button);
			deleteWebhook(user);
		});
}

function fetchRequestDetails(id) {
	fetch(`/get_request_details?id=${id}`)
		.then(response => response.json())
		.then(data => {
			document.getElementById('method').textContent = data.method;
			document.getElementById('ip').textContent = data.ip;
			document.getElementById('headers').textContent = JSON.stringify(JSON.parse(data.headers), null, 2);
			document.getElementById('query-strings').textContent = decodeURIComponent(data.query_strings.replace(/&/g, '\n'));
			if (data.raw_content === 'None') {
				document.getElementById('raw-content').textContent = data.raw_content;
			} else {
				document.getElementById('raw-content').textContent = JSON.stringify(JSON.parse(data.raw_content), null, 2);
			}
		});
}

function deleteWebhook(user) {
    const deleteButton = document.getElementById('delete');

    deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure?')) {
            fetch(`/delete/` + user, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('Deleted Successfully!');
                    fetchRequests(user);
                } else {
                    return Promise.reject('Network response was not ok.');
                }
            });
        }
    });
}

// Call the function to set up the event listener
