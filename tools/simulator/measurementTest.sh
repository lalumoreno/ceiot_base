#!/bin/bash

send_post (){
	curl -X POST http://localhost:8080/measurement \
	     -d "id=$RANDOM_ID&t=$TEMP&h=$HUM"
	echo""
}

#WRONG MSG
RANDOM_ID="000"
NAME="000"
KEY="000"
TEST="000"
curl -X POST http://localhost:8080/measurement \
	     -d "id=$RANDOM_ID&n=$NAME&k=$KEY"
	echo""

#WRONG MSG
RANDOM_ID="000"
TEMP="000"
HUM="000"
TEST="000"
curl -X POST http://localhost:8080/measurement \
	     -d "id=$RANDOM_ID&t=$TEMP&h=$HUM&k=$TEST"
	echo""

#WRONG ID
RANDOM_ID="0"
TEMP="000"
HUM="000"
send_post

#WRONG ID
RANDOM_ID="aaa"
TEMP="aaa"
HUM="aaa"
send_post

#WRONG ID
RANDOM_ID="-1"
TEMP="-1"
HUM="-1"
send_post

#WRONG ID
RANDOM_ID="111111"
TEMP="111111"
HUM="111111"
send_post

#WRONG TEMP
RANDOM_ID="11"
TEMP="111111"
HUM="111111"
send_post

#WRONG TEMP
RANDOM_ID="11"
TEMP="aaa"
HUM="111111"
send_post

#WRONG TEMP
RANDOM_ID="11"
TEMP="-101"
HUM="111111"
send_post

#WRONG TEMP
RANDOM_ID="11"
TEMP="101"
HUM="111111"
send_post

#WRONG HUM
RANDOM_ID="11"
TEMP="11"
HUM="111111"
send_post

#WRONG HUM
RANDOM_ID="11"
TEMP="11"
HUM="aaa"
send_post

#WRONG HUM
RANDOM_ID="11"
TEMP="11"
HUM="-11"
send_post

#WRONG HUM
RANDOM_ID="11"
TEMP="11"
HUM="111"
send_post

#OK
RANDOM_ID="11"
TEMP="11"
HUM="11"
send_post

