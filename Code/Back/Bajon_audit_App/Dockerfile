FROM maven:3.9.6-eclipse-temurin-21

WORKDIR /app

# Copier Maven Wrapper + projet
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src

# Rendre mvnw exécutable
RUN chmod +x mvnw

# Compiler sans tests
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]
