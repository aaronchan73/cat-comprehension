FROM node:latest

# frontend
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install

# backend
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm install

# run app
COPY . /app
EXPOSE 3000
CMD ["npm", "start"]