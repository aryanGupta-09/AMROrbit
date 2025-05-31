#!/bin/sh

PID=$(sudo lsof -t -i:3002)
if [ -n "$PID" ]; then
    sudo kill -9 $PID
fi

nohup npm run start > output.log 2>&1 &