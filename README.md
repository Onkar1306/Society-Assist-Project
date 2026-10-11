# Society Assist

Society Assist is a web application for managing residential society activities.

## Tech Stack
- Backend: Java, Spring Boot, Spring Data JPA
- Database: MySQL
- Frontend: HTML, CSS, JavaScript

## Project Structure

- `SocietyAssist-Backend/` — Spring Boot backend
- `SocietyAssist-Frontend/` — Frontend pages for Admin and FlatOwner

## Setup Instructions

### 1. Database Setup

Install and start MySQL.

Create a database:

```sql
CREATE DATABASE society_assist;
```

### 2. Backend Setup

Navigate to:

```bash
cd SocietyAssist-Backend
```

Copy the example configuration:

```bash
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties
```

Update the following properties with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/society_assist
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Start the backend:

```bash
./mvnw spring-boot:run
```

The backend runs on:

http://localhost:8086

### 3. Frontend Setup

Open the `SocietyAssist-Frontend` directory.

Launch the required HTML pages using a local development server, such as VS Code Live Server.

Ensure the Spring Boot backend is running on port 8086.

## Database Notes

Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`, allowing it to create or update tables.

The MySQL database must exist before starting the application.

No initial database records are included.

## Security

The real `application.properties` file is excluded from Git to protect local database credentials.
