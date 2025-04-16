#!/bin/bash

send_post (){
	curl -X POST http://localhost:8080/device \
	     -d "id=$RANDOM_ID&n=$NAME&k=$KEY"
	echo""
}

# WRONG MSG
RANDOM_ID="000"
TEMP="000"
HUM="000"
curl -X POST http://localhost:8080/device \
	     -d "id=$RANDOM_ID&t=$TEMP&h=$HUM"
	echo""
	
# WRONG MSG
RANDOM_ID="000"
NAME="000"
KEY="000"
TEST="000"
curl -X POST http://localhost:8080/device \
	     -d "id=$RANDOM_ID&n=$NAME&k=$KEY&t=$TEST"
	echo""

# WRONG ID
RANDOM_ID="0"
NAME="000"
KEY="000"
send_post

# WRONG ID
RANDOM_ID="aaa"
NAME="aaa"
KEY="aaa"
send_post

# WRONG ID
RANDOM_ID="-1"
NAME="-1"
KEY="-1"
send_post

# WRONG ID
RANDOM_ID="111111"
NAME="111111"
KEY="111111"
send_post

# WRONG NAME
RANDOM_ID="11"
NAME="111111111111111111111"
KEY="111111"
send_post

# WRONG NAME
RANDOM_ID="11"
NAME="aaaaaaaaaaaaaaaaaaaaa"
KEY="111111"
send_post

# WRONG KEY
RANDOM_ID="11"
NAME="000"
KEY="000"
send_post

# WRONG KEY
RANDOM_ID="11"
NAME="aaa"
KEY="aaa"
send_post

# WRONG KEY
RANDOM_ID="11"
NAME="-1"
KEY="-1"
send_post

# OK
RANDOM_ID="11"
NAME="111111"
KEY="111111"
send_post

