#!/bin/bash

while true; do
	RANDOM_ID=$((1 + RANDOM % 50))
	TEMP=$((RANDOM % 150))
	HUM=$((RANDOM % 150))
		
	curl -X POST http://localhost:8080/measurement \
	     -d "id=$RANDOM_ID&t=$TEMP&h=$HUM"
	echo ""
	     
sleep 1
done
