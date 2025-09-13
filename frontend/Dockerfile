FROM nginx:alpine

# Copy custom nginx config if needed
COPY public/ /usr/share/nginx/html/

# Copy a simple index.html file
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
