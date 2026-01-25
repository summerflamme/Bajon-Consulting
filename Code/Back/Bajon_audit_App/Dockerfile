FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# suppose que tu buildes un jar "app.jar" (ou target/*.jar)
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
