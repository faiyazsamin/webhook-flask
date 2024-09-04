# Webhook Flask

This repository provides a Flask-based implementation for logging and managing webhooks. It includes endpoints for receiving, viewing, and deleting logged requests.

## Features

- **Receive Webhooks:** Accepts HTTP requests of various methods (GET, POST, PUT, DELETE) and logs them.
- **View Logs:** Retrieve summaries or details of logged requests.
- **Manage Logs:** Delete all or specific logged requests.

## Requirements

- Python 3.x
- Flask
- SQLAlchemy

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/faiyazsamin/webhook-flask.git
   cd webhook-flask
   ```
2. Create a virtual environment (optional but recommended):

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

## Running the Application
To start the Flask application, run:
```bash
python app.py
```
The application will be available at http://localhost:5000.

## API Endpoints

1. **Webhook Listener Endpoint:** /webhook_listener/\<endpoint>

    Listens for incoming webhooks on a specific endpoint and logs the request details.
    
2. **View All Webhooks:** Users can see all the upcoming webhooks by visiting http://localhost:5000 (while running locally) or the specific server address where the application is running

3. **View Specific Webhooks:** Users can see the webhooks coming to a specific endpoint by using the `?user=/<endpoint>` query string. For example, all the webhooks that went to the `<server_address>/webhook_listener/faiyaz` endpoint can be viewed by visiting `<server_address>/?user=faiyaz`

4. **Webhook Details:** Users can view the details of each webhook by clicking any specific webhook from the list of webhooks shown on the left side of the webhook view page.

5. **Delete Webhooks:** Users can delete the webhooks by pressing the `Clear All Data` button on the webhook view page. This will delete all the shown webhooks for that specific endpoint.


## Useful Links
DigitalOcean Tutorials:
- [How To Deploy a Flask App Using Gunicorn to App Platform](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-flask-app-using-gunicorn-to-app-platform)

- [How To Create Your First Web Application Using Flask and Python 3](https://www.digitalocean.com/community/tutorials/how-to-create-your-first-web-application-using-flask-and-python-3)

- [How to Use Flask-SQLAlchemy to Interact with Databases in a Flask Application](https://www.digitalocean.com/community/tutorials/how-to-use-flask-sqlalchemy-to-interact-with-databases-in-a-flask-application)
