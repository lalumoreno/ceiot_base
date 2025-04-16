#!/bin/bash

while true; do
	RANDOM_ID=$((1 + RANDOM % 30))
	NAME="Fake Device $RANDOM_ID"
	KEY=$((99000 + RANDOM % 1000000))
		
	curl -X POST http://localhost:8080/device \
	     -d "id=$RANDOM_ID&n=$NAME&k=$KEY"
	echo ""
	     
sleep 10
done
