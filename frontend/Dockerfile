FROM nginx:1.29.0-alpine

# Remove default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy all files from current directory to Nginx's public folder
COPY ./dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]