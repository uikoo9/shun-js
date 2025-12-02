echo "version:"
read version

docker pull ghcr.io/uikoo9/tubiao-index:$version
docker rm -f tubiao-index

docker run -d -p 8002:8002 \
 -v /home/ec2-user/logs/tubiao-index:/home/tubiao-index/logs \
 --restart="always" --name="tubiao-index" \
 ghcr.io/uikoo9/tubiao-index:$version 