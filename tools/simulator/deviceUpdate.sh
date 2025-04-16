#!/bin/bash

send_post (){
	curl -X POST http://localhost:8080/device \
	     -d "id=$RANDOM_ID&n=$NAME&k=$KEY"
	echo""
}

# UPDATE FAIL
RANDOM_ID="11"
NAME="Test Device 11"
KEY="laura"
send_post

# UPDATE OK
RANDOM_ID="11"
NAME="Test Device 11"
KEY="123456"
send_post
