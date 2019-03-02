import os
import uuid
from flask import Flask, session
from flask_socketio import SocketIO, emit


app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'

socketio = SocketIO(app)


@socketio.on('connect', namespace='/iss')
def makeConnection():
    print('connected')

@socketio.on('message')
def handle_message(message, name):
    f= open(name,"a+")
    for doc in message:
        f.write(doc.encode('utf-8') + '\n')
    f.close()
    emit('cb',200)
    
@app.route('/')
def mainIndex():
    print 'in hello world'
    return app.send_static_file('index.html')
    


# start the server
if __name__ == '__main__':
        socketio.run(app)
