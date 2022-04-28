#Run with: uvicorn main:app --reload

from fastapi import FastAPI, HTTPException, WebSocket
import aioredis
from httpx import post
from notification import Notification
from channel import Channel
import uuid
import json
import stomp


app = FastAPI(title="Notifications API")
redis = aioredis.from_url('redis://localhost:6379', decode_responses=True)
c = stomp.Connection([('127.0.0.1', 61613)])


@app.get("/")
async def root():
    return {"message" : "Server says It's All Good Man"}

#This has to send to the channels
#This has to receive the user to autentication???
@app.post("/notification")
async def post_notification(notification: Notification):    #preciso de mandar o user aqui? por causa do connect?
    #comunicar com o broker
    c.connect('admin', 'admin', wait=True)

    if notification.channels != None:
        for channel in notification.channels:
            c.send('/topic/' + channel, notification.message)   #aqui a mensagem fica a espera se n houver nng ou segue se houver alguem

    return {"message" : "POST /notification good"}

#NOTE: When a User X creates a channel, you need to put his id on the users list
#This returns a string with the id
#TODO: check if it's passed a valid channel json
@app.post("/channel")
async def create_channel(channel: Channel):
    channel_uuid = uuid.uuid4()

    while (await redis.exists(str(channel_uuid)) != 0):
        channel_uuid =uuid.uuid4()
    
    created_channel = {"Name" : channel.name, "Users" : [channel.users[0]]}
    jval = json.dumps(created_channel)
    await redis.set(str(channel_uuid), jval) 
    c.connect('user1', 'admin', wait=True)  #deve ser dinamico isto, onde é que estas credenciais sao definidas??
    c.subscribe('/topic/' + channel.name, channel.users[0], 'auto', 
        headers= {"client-id": channel.users[0], "activemq.subscriptionName":channel.users[0] })
    return channel_uuid

#Deletes a channel
#TODO: Change status code
@app.delete("/channel/{channelId}")
async def delete_channel(channelId: str):
    if await redis.exists(channelId) == 0:
        raise HTTPException(status_code=404, detail="Channel UUID invalid, it doesn't exists")
    await redis.delete(channelId)
    return {"message" : "DELETE /channel good"}     #remove this ?

#Adds a user to the channel
#TODO: Change status code
@app.put("/channel/{channelId}/{userId}")
async def add_user_to_channel(channelId: str, userId: str):
    if await redis.exists(channelId) == 0 :
        raise HTTPException(status_code=404, detail="Channel UUID invalid, it doesn't exists")

    data = await redis.get(channelId)
    result = json.loads(data)
    users = result["Users"]

    if userId in users:
        raise HTTPException(status_code=404, detail="User already belongs to the channel")

    c.connect('user1', 'admin', wait=True)  #deve ser dinamico isto??
    c.subscribe('/topic/' + result["Name"], userId, 'auto', 
        headers= {"client-id": userId, "activemq.subscriptionName":userId })

    users.append(userId)
    jval = json.dumps(result)
    await redis.set(channelId, jval)

    return {"message" : "PUT /channel good"}

#Get a channel
#TODO: change status code
@app.get("/channel/{channelId}")
async def get_channel(channelId: str):
    if await redis.exists(channelId) == 0 :
        raise HTTPException(status_code=404, detail="Channel UUID invalid, it doesn't exists")

    data = await redis.get(channelId)
    result = json.loads(data)
    return result

#Get all channels
#Que sentido é que isto faz??
@app.get("/channels")
async def get_channels():
    return "not done yet"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            #dados da notificação
            data = await websocket.receive_text()      #tem de ser formato de notificação
            #chamar o metodo das notificaçoes
            post_notification(data)
            #await websocket.send_text(f"Message text was: {data}")
        except:
            break
