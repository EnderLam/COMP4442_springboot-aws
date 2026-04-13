FROM openjdk:17-jdk-slim AS build
WORKDIR /app
COPY gradlew .
COPY .mvn .mvn
COPY pom.xml .
RUN ./gradlew dependency:go-offline -B
COPY src src
RUN ./gradlew package -DskipTests

FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]