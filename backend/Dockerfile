# Stage 1: Build
FROM gradle:8.4-jdk17-alpine AS builder
COPY --chown=gradle:gradle . /app
WORKDIR /app
RUN gradle build -x test --no-daemon

# Stage 2: Run
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]