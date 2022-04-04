#Run with: uvicorn main:app --reload

from fastapi import FastAPI
import aioredis
from notification import Notification
from channel import Channel
import uuid
import json

app = FastAPI(title="Notifications API")
redis = aioredis.from_url('redis://localhost:6379', decode_responses=True)

@app.get("/")
async def root():
    return {"message" : "Server says It's All Good Man"}

#This has to send to the channels
@app.post("/notification")
async def post_notification(notification: Notification):
    return {"message" : "POST /notification good"}

#NOTE: When a User X creates a channel, you need to put his id on the users list
#This returns a string with the id
@app.post("/channel")
async def create_channel(channel: Channel):
    channel_uuid = uuid.uuid4()
    created_channel = {"Name" : channel.name, "Users" : [channel.users[0]]}
    jval = json.dumps(created_channel)
    await redis.set(str(channel_uuid), jval)   
    return channel_uuid

#Deletes a channel
#TODO: Check if channel id exists
@app.delete("/channel/{channelId}")
async def delete_channel(channelId: str):
    await redis.delete(channelId)
    return {"message" : "DELETE /channel good"}

#Adds a user to the channel
#TODO: Check if user id is unique
#TODO: Check if channel id exists
@app.put("/channel/{channelId}/{userId}")
async def add_user_to_channel(channelId: str, userId: int):
    data = await redis.get(channelId)
    result = json.loads(data)
    result["Users"].append(userId)
    jval = json.dumps(result)
    await redis.set(channelId, jval)
    return {"message" : "PUT /channel good"}

#Get a channel
#TODO: Check if channel id exists
@app.get("/channel/{channelId}")
async def get_channel(channelId: str):
    data = await redis.get(channelId)
    result = json.loads(data)
    return result

#Get all channels
#Que sentido é que isto faz??
@app.get("/channels")
async def get_channels():
    return "not done yet"
