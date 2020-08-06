# node-server

> node-server for the funds chrome extension

# how to use

```javascript
docker images
docker build -t extension-server .
docker run -p 9966:9898 -d extension-server // 容器内部9898端口映射到主机的9966端口
docker ps // list containers
docker logs <container id> // Print app output
docker exec -it <container id> /bin/bash // 需要进入容器中
```

### node.js 部署到 docker

[教程](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
