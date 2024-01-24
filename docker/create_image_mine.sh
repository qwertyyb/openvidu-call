#!/bin/bash -x

VERSION=$1
if [[ ! -z $VERSION ]]; then
    cd ..
    docker buildx build --platform=linux/amd64 --pull --no-cache --rm=true -f docker/Dockerfile.node -t qwertyyb/openvidu_openvidu-call:$VERSION --build-arg BASE_HREF=/ .
else
    echo "Error: You need to specify a version as first argument"
fi
