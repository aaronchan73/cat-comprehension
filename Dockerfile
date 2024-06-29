FROM node:alpine

# frontend
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

# backend
WORKDIR /app/backend
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend ./

# run app
EXPOSE 3000
EXPOSE 8080
WORKDIR /app
COPY . .
CMD ["npm", "start"]