FROM golang:1.23

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

EXPOSE 8000

RUN go build -v -o /usr/local/bin/app ./main.go 

CMD ["/usr/local/bin/app"] 
