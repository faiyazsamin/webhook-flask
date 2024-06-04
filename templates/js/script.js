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
    if(user == null) {
        user = '';
    }
      fetch('/get_requests/'+user)
          .then(response => response.json())
          .then(data => {
              const sidebar = document.getElementById('sidebar');
              sidebar.innerHTML = '';
              for (let i = data.length - 1; i >= 0; i--) {
                  const request = data[i];
                  const div = document.createElement('div');
                  div.textContent = `${request.method} ${request.timestamp}`;
                  div.onclick = () => {
                        document.querySelectorAll('#sidebar div').forEach(el => el.classList.remove('active'));
                        div.classList.add('active');
                        fetchRequestDetails(request.id);
                    };
                    sidebar.appendChild(div);
              }
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
            document.getElementById('raw-content').textContent = JSON.stringify(JSON.parse(data.raw_content), null, 2);
        });
}
