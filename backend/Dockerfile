FROM golang:1.24.6-alpine3.22 AS builder

WORKDIR /app

COPY . /app/

RUN CGO_ENABLED=0 GOOS=linux go build main.go

FROM alpine

COPY --from=builder /app/main /main

RUN chmod +x /main

EXPOSE 8090

ENTRYPOINT ["/main", "serve", "--http=0.0.0.0:8090"]