#!/usr/bin/env bash

docker build --file=Dockerfile --tag=nsimsiri/strain-view:latest --rm=true .

docker push nsimsiri/strain-view:latest
printf "\nPUSH image to repo\n"
